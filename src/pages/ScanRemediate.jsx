import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Terminal, AlertTriangle, CheckCircle, RefreshCw, Cpu, Brain } from 'lucide-react';

export default function ScanRemediate() {
  const [searchParams] = useSearchParams();
  const targetParam = searchParams.get('target');

  const [targets, setTargets] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [mode, setMode] = useState('simulation'); // "simulation" | "local"
  
  const [scanId, setScanId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanState, setScanState] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  const consoleEndRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadSuccess(`Uploaded "${data.name}" successfully!`);
        // Refresh targets
        const listRes = await fetch('/api/targets');
        if (listRes.ok) {
          const listData = await listRes.json();
          setTargets(listData);
          setSelectedTarget(data.name);
        }
      } else {
        console.error("Upload failed");
        setUploadSuccess("Upload failed. Verify file parameters.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadSuccess("Upload error. Try again.");
    } finally {
      setUploading(false);
    }
  };


  // Core 8-stage pipeline names
  const stages = [
    { key: "INTAKE", label: "Intake" },
    { key: "UNDERSTANDING", label: "AST Map" },
    { key: "SAST_SCANNING", label: "SAST Scan" },
    { key: "DAST_SCANNING", label: "DAST Probe" },
    { key: "FUZZING", label: "Fuzzing" },
    { key: "VALIDATING", label: "Exploit Proof" },
    { key: "PATCHING", label: "AI Patching" },
    { key: "VERIFYING", label: "Verification" }
  ];

  // Fetch targets list
  useEffect(() => {
    fetch('/api/targets')
      .then(res => res.json())
      .then(data => {
        setTargets(data);
        if (data.length > 0) {
          setSelectedTarget(targetParam || data[0].name);
        }
      })
      .catch(err => console.error("Error fetching targets:", err));
  }, [targetParam]);

  // Handle active polling
  useEffect(() => {
    let timer;
    if (scanning && scanId) {
      const poll = async () => {
        try {
          const res = await fetch(`/api/scan/${scanId}`);
          if (res.ok) {
            const data = await res.json();
            setScanState(data);
            if (data.status === 'COMPLETED' || data.status === 'FAILED') {
              setScanning(false);
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      };

      timer = setInterval(poll, 1500);
    }
    return () => clearInterval(timer);
  }, [scanning, scanId]);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scanState?.logs]);

  const handleStartScan = async () => {
    if (!selectedTarget) return;
    setScanning(true);
    setScanState(null);
    setScanId('');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: selectedTarget, mode })
      });
      if (res.ok) {
        const data = await res.json();
        setScanId(data.scan_id);
      } else {
        setScanning(false);
      }
    } catch (e) {
      console.error(e);
      setScanning(false);
    }
  };

  const getStageIndex = (currentStage) => {
    if (currentStage === 'COMPLETED') return 8;
    if (currentStage === 'FAILED') return -1;
    return stages.findIndex(s => s.key === currentStage);
  };

  // Basic diff line highlighter
  const renderDiff = (diffText) => {
    if (!diffText) return <p className="text-cyber-light/40 text-xs italic">No code diff generated.</p>;
    return (
      <pre className="font-mono text-xs overflow-x-auto p-4 bg-cyber-black rounded-lg border border-cyber-green/15 leading-relaxed text-cyber-light/80">
        {diffText.split('\n').map((line, idx) => {
          let color = 'text-cyber-light/70';
          if (line.startsWith('+') && !line.startsWith('+++')) color = 'text-cyber-green bg-cyber-green/5 font-bold';
          if (line.startsWith('-') && !line.startsWith('---')) color = 'text-red-400 bg-red-400/5 line-through';
          if (line.startsWith('@@')) color = 'text-cyan-400 font-bold';
          return (
            <div key={idx} className={`${color} px-2 py-0.5 rounded`}>
              {line}
            </div>
          );
        })}
      </pre>
    );
  };

  const currentStageIndex = getStageIndex(scanState?.stage);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Simulation Banner */}
      {scanState?.is_simulation && (
        <div className="bg-cyber-amber/10 border border-cyber-amber/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-amber"></span>
            </span>
            <div className="text-xs font-mono text-cyber-amber uppercase tracking-wider font-extrabold">
              Active Session: SIMULATED DEMO EXECUTION
            </div>
          </div>
        </div>
      )}

      {/* Control Module Deck */}
      <div className="bg-cyber-black/40 backdrop-blur-sm border border-cyber-green/15 rounded-xl p-6">
        <h3 className="text-sm font-mono uppercase tracking-widest text-cyber-green font-extrabold mb-4">Pipeline Controller</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-cyber-light/40">Select Target File</label>
              <label className="text-[10px] font-mono text-cyber-green hover:underline cursor-pointer flex items-center gap-1 select-none">
                {uploading ? (
                  <span className="animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <span>[+] Upload Custom</span>
                    <input
                      type="file"
                      accept=".py,.c,.cpp,.java,.js,.go,.rs,.txt"
                      onChange={handleFileUpload}
                      disabled={scanning || uploading}
                      className="hidden"
                    />
                  </>
                )}
              </label>
            </div>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              disabled={scanning}
              className="w-full bg-cyber-black border border-cyber-green/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-green font-mono"
            >
              {targets.map(t => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
            {uploadSuccess && (
              <div className="text-[9px] font-mono text-cyber-green animate-fadeIn whitespace-nowrap overflow-hidden text-ellipsis">
                {uploadSuccess}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-light/40">Remediation Mode</label>
            <div className="flex bg-cyber-black rounded border border-cyber-green/20 p-1">
              <button
                type="button"
                onClick={() => setMode('simulation')}
                disabled={scanning}
                className={`flex-1 text-center py-1 rounded text-xs font-mono font-bold transition-all ${
                  mode === 'simulation' ? 'bg-cyber-green text-cyber-black' : 'text-cyber-light/40 hover:text-white'
                }`}
              >
                SIMULATION
              </button>
              <button
                type="button"
                onClick={() => setMode('local')}
                disabled={scanning}
                className={`flex-1 text-center py-1 rounded text-xs font-mono font-bold transition-all ${
                  mode === 'local' ? 'bg-cyber-amber text-cyber-black' : 'text-cyber-light/40 hover:text-white'
                }`}
              >
                LOCAL WORKSPACE
              </button>
            </div>
          </div>

          <div className="md:col-span-2 text-right">
            <button
              onClick={handleStartScan}
              disabled={scanning || !selectedTarget}
              className={`w-full md:w-auto px-6 py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                scanning
                  ? 'bg-cyber-light/10 text-cyber-light/30 border border-cyber-light/15 cursor-not-allowed'
                  : mode === 'local'
                    ? 'bg-cyber-amber text-cyber-black hover:bg-cyber-amber/80 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:scale-105'
                    : 'bg-cyber-green text-cyber-black hover:bg-cyber-green/80 shadow-[0_0_12px_rgba(0,255,102,0.2)] hover:scale-105'
              }`}
            >
              {scanning ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  ANALYZING CODE...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  INITIATE RUN PIPELINE
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 8-Stage Progress Stepper */}
      {scanState && (
        <div className="bg-cyber-black/40 backdrop-blur-sm border border-cyber-green/15 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="font-mono text-xs text-cyber-light/40">
              RUN ID: <span className="text-white font-bold">{scanState.scan_id}</span>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              scanState.status === 'COMPLETED' ? 'bg-cyber-green/15 border border-cyber-green/30 text-cyber-green' :
              scanState.status === 'FAILED' ? 'bg-red-500/15 border border-red-500/30 text-red-500' :
              'bg-cyber-amber/15 border border-cyber-amber/30 text-cyber-amber animate-pulse'
            }`}>
              {scanState.status}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
            {stages.map((stage, idx) => {
              const isCompleted = currentStageIndex > idx || scanState.status === 'COMPLETED';
              const isActive = currentStageIndex === idx && scanState.status === 'RUNNING';
              const isPending = currentStageIndex < idx && scanState.status !== 'COMPLETED';
              
              return (
                <div
                  key={stage.key}
                  className={`border rounded-lg p-3 text-center transition-all ${
                    isCompleted ? 'bg-cyber-green/5 border-cyber-green/30 text-cyber-green' :
                    isActive ? 'bg-cyber-amber/5 border-cyber-amber/40 text-cyber-amber shadow-[0_0_10px_rgba(245,158,11,0.05)] animate-pulse' :
                    'bg-cyber-dark/40 border-cyber-green/10 text-cyber-light/30'
                  }`}
                >
                  <div className="text-[10px] font-mono mb-1">STAGE 0{idx + 1}</div>
                  <div className="text-xs font-bold font-mono uppercase tracking-wider truncate">{stage.label}</div>
                  <div className="text-[9px] mt-1.5 font-mono">
                    {isCompleted ? '✓ DONE' : isActive ? '⚡ SCAN' : 'WAIT'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {scanState && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Output Logs Console */}
          <div className="bg-cyber-black/40 backdrop-blur-sm border border-cyber-green/15 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-extrabold mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-green" />
                Raw Execution Output Logs
              </h3>

              <div className="h-96 bg-cyber-dark border border-cyber-green/10 rounded-lg p-4 font-mono text-[10px] overflow-y-auto space-y-2 leading-relaxed text-cyber-green/80">
                {scanState.logs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">{log}</div>
                ))}
                {scanning && (
                  <div className="flex items-center gap-2 text-cyber-amber animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Awaiting next telemetry signature...</span>
                  </div>
                )}
                <div ref={consoleEndRef} />
              </div>
            </div>
          </div>

          {/* AI Planner Thoughts & Code Diff */}
          <div className="bg-cyber-black/40 backdrop-blur-sm border border-cyber-green/15 rounded-xl p-6 space-y-6">
            {/* Thought log */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-extrabold mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyber-green" />
                AI Planner Reasoning Logs
              </h3>
              
              <div className="space-y-4 max-h-52 overflow-y-auto pr-1">
                {scanState.timeline?.map((step, idx) => (
                  <div key={idx} className="bg-cyber-dark/50 border border-cyber-green/15 rounded p-3 text-[11px] font-mono space-y-1.5">
                    <div className="flex justify-between items-center text-cyber-green">
                      <span className="font-bold">Stage: {step.stage}</span>
                      <span className="text-[10px] text-cyber-light/40">Confidence: {(step.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div><span className="text-cyber-light/40">Observe:</span> {step.observe}</div>
                    <div><span className="text-cyber-light/40">Hypothesis:</span> {step.hypothesis}</div>
                    <div><span className="text-cyber-light/40">Action:</span> <code className="bg-cyber-black px-1 rounded text-cyber-amber">{step.select_tool}</code></div>
                    <div><span className="text-cyber-light/40">Evaluation:</span> <span className="italic text-white">{step.evaluation}</span></div>
                  </div>
                ))}
                {!scanState.timeline?.length && (
                  <p className="text-xs text-cyber-light/30 italic font-mono">Telemetry active. Planner loops loading...</p>
                )}
              </div>
            </div>

            {/* Git Diff Panel */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-extrabold mb-4">
                Remediation Code Diff
              </h3>
              {renderDiff(scanState.patch_diff)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
