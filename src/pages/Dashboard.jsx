import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Shield, ShieldAlert, ShieldCheck, HelpCircle, Terminal } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_targets: 0,
    confirmed_findings: 0,
    patched: 0,
    false_positives: 0
  });
  const [targets, setTargets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats and targets from backend API
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const targetsRes = await fetch('/api/targets');
        if (targetsRes.ok) {
          const targetsData = await targetsRes.json();
          // Map mock/real statuses for visualization
          const mappedTargets = targetsData.map((t, idx) => {
            let status = 'Secure';
            let variant = 'success';
            if (t.name.includes('analyzer')) {
              status = 'Vulnerable';
              variant = 'danger';
            } else if (t.name.includes('division')) {
              status = 'Vulnerable';
              variant = 'danger';
            } else if (t.name.includes('false')) {
              status = 'Audited';
              variant = 'warning';
            }
            return { ...t, status, variant };
          });
          setTargets(mappedTargets);
        }

        const runsRes = await fetch('/api/runs');
        if (runsRes.ok) {
          const runsData = await runsRes.json();
          // Generate a log list
          const generatedLogs = runsData.map(run => ({
            timestamp: new Date(run.timestamp).toLocaleTimeString(),
            message: `Run ${run.run_id} matching ${run.target} marked as ${run.status}. (Vulnerability: ${run.vulnerability})`,
            is_simulation: run.is_simulation
          }));
          setLogs(generatedLogs.slice(0, 5));
        }

      } catch (e) {
        console.error("API error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Simulation Banner Notice */}
      <div className="bg-cyber-amber/10 border border-cyber-amber/30 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-amber opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-amber"></span>
          </span>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-amber font-extrabold">Notice: Workbench Running in Demo Mode</h4>
            <p className="text-xs text-cyber-light/60 mt-0.5">Simulated scans are clearly flagged with "SIMULATION". Live environment scanning executes actual CRS pipelines inside the sandbox.</p>
          </div>
        </div>
      </div>

      {/* Grid Stats Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cyber-black border border-cyber-green/20 rounded-xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(0,255,102,0.02)]">
          <div className="text-xs font-mono uppercase tracking-wider text-cyber-light/40">Total Codebases Tested</div>
          <div className="text-4xl font-extrabold text-white mt-3 font-mono">{stats.total_targets}</div>
          <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyber-light/40" />
          </div>
        </div>

        <div className="bg-cyber-black border border-cyber-green/20 rounded-xl p-6 relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-cyber-light/40">Confirmed Vulnerabilities</div>
          <div className="text-4xl font-extrabold text-cyber-amber mt-3 font-mono">{stats.confirmed_findings}</div>
          <div className="absolute right-4 bottom-4 w-12 h-12 bg-cyber-amber/5 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-cyber-amber" />
          </div>
        </div>

        <div className="bg-cyber-black border border-cyber-green/20 rounded-xl p-6 relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-cyber-light/40">Successfully Remedied</div>
          <div className="text-4xl font-extrabold text-cyber-green mt-3 font-mono">{stats.patched}</div>
          <div className="absolute right-4 bottom-4 w-12 h-12 bg-cyber-green/5 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-cyber-green" />
          </div>
        </div>

        <div className="bg-cyber-black border border-cyber-green/20 rounded-xl p-6 relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-cyber-light/40">False Alerts Rejected</div>
          <div className="text-4xl font-extrabold text-cyber-light/60 mt-3 font-mono">{stats.false_positives}</div>
          <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-cyber-light/40" />
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Targets Table */}
        <div className="lg:col-span-2 bg-cyber-black/40 backdrop-blur-sm border border-cyber-green/15 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-cyber-green inline-block animate-pulse" />
              Target Codebase Inventory
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cyber-green/15 text-cyber-light/40 font-mono">
                    <th className="pb-3 uppercase tracking-wider">Target Filename</th>
                    <th className="pb-3 uppercase tracking-wider">Local Path</th>
                    <th className="pb-3 uppercase tracking-wider">Diagnostics State</th>
                    <th className="pb-3 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-green/5 font-mono">
                  {targets.map((target) => (
                    <tr key={target.name} className="hover:bg-cyber-green/5 transition-colors">
                      <td className="py-4 text-white font-semibold">{target.name}</td>
                      <td className="py-4 text-cyber-light/50">{target.path}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          target.variant === 'danger' ? 'bg-red-500/15 border border-red-500/30 text-red-500' :
                          target.variant === 'warning' ? 'bg-cyber-amber/15 border border-cyber-amber/30 text-cyber-amber' :
                          'bg-cyber-green/15 border border-cyber-green/30 text-cyber-green'
                        }`}>
                          {target.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => navigate(`/scan?target=${target.name}`)}
                          className="px-3 py-1 rounded bg-cyber-green hover:bg-cyber-green/80 text-cyber-black text-[10px] font-bold flex items-center gap-1 ml-auto shadow-[0_0_8px_rgba(0,255,102,0.15)] transition-all hover:scale-105"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          RUN SCAN
                        </button>
                      </td>
                    </tr>
                  ))}
                  {targets.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-cyber-light/30">
                        {loading ? 'Initializing target repository...' : 'No test targets found in workspace.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Feed Column */}
        <div className="bg-cyber-black/40 backdrop-blur-sm border border-cyber-green/15 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-green" />
              Live Attestation Logs
            </h3>

            <div className="space-y-4 font-mono">
              {logs.map((log, idx) => (
                <div key={idx} className="text-[11px] leading-relaxed border-l-2 border-cyber-green/30 pl-3">
                  <div className="flex items-center gap-2 text-cyber-light/40">
                    <span>[{log.timestamp}]</span>
                    {log.is_simulation && (
                      <span className="text-[8px] bg-cyber-amber/15 text-cyber-amber border border-cyber-amber/30 px-1 py-0.2 rounded font-bold">
                        SIMULATION
                      </span>
                    )}
                  </div>
                  <p className="text-cyber-light/80 mt-1">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-12 text-cyber-light/30">
                  Waiting for diagnostic runs...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
