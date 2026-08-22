import React from 'react';
import { Activity, Cpu } from 'lucide-react';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="h-16 border-b border-cyber-green/15 bg-cyber-black/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-cyber-gray/20 border border-cyber-green/15 text-cyber-light/60 hover:text-cyber-green transition-all flex items-center justify-center"
          title="Toggle Navigation Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>


        <div className="flex items-center gap-3 border-l border-cyber-green/15 pl-4">
          <Activity className="w-5 h-5 text-cyber-green animate-pulse" />
          <span className="font-mono text-xs text-cyber-light/40">SYSTEM STATUS:</span>
          <span className="px-2 py-0.5 rounded bg-cyber-green/15 border border-cyber-green/30 text-[10px] font-mono text-cyber-green font-bold uppercase tracking-wider">
            ORCHESTRATOR ACTIVE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Environment Indicator */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyber-amber" />
          <span className="text-xs text-cyber-light/50">ENGINE:</span>
          <span className="text-xs font-mono font-bold text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-2 py-0.5 rounded">
            SANDBOX MODE
          </span>
        </div>

      </div>
    </header>
  );
}

