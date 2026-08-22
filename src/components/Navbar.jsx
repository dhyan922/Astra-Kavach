import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu } from 'lucide-react';

export default function Navbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-cyber-green/15 bg-cyber-black/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-cyber-green animate-pulse" />
        <span className="font-mono text-xs text-cyber-light/40">SYSTEM STATUS:</span>
        <span className="px-2 py-0.5 rounded bg-cyber-green/15 border border-cyber-green/30 text-[10px] font-mono text-cyber-green font-bold uppercase tracking-wider">
          ORCHESTRATOR ONLINE
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Environment Indicator */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyber-amber" />
          <span className="text-xs text-cyber-light/50">ENV:</span>
          <span className="text-xs font-mono font-bold text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-2 py-0.5 rounded">
            LOCAL DEV MODE
          </span>
        </div>

        {/* Date-Time Display */}
        <div className="text-right font-mono">
          <div className="text-xs text-white tracking-wider">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[9px] text-cyber-light/40">
            {time.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  );
}
