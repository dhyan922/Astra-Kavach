import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Terminal, ClipboardCheck, Zap } from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Shield },
    { name: 'Scan & Remediate', path: '/scan', icon: Activity },
    { name: 'Exploit Lab', path: '/exploit', icon: Terminal },
    { name: 'Compliance Audit', path: '/audit', icon: ClipboardCheck },
  ];

  return (
    <aside className={`bg-cyber-black border-r border-cyber-green/15 flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 ${
      isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
    }`}>
      <div>
        {/* Brand/Logo */}
        <div className="p-6 border-b border-cyber-green/15 flex items-center gap-3 whitespace-nowrap">
          <div className="relative w-8 h-8 rounded border border-cyber-green flex items-center justify-center bg-cyber-green/10 shadow-[0_0_8px_rgba(0,255,102,0.3)]">
            <Shield className="w-5 h-5 text-cyber-green" />
            <Zap className="w-2.5 h-2.5 text-cyber-amber absolute" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-white uppercase">Astra Kavach</h1>
            <span className="text-[10px] text-cyber-green/70 tracking-wider">TACTICAL AUTO-SHIELD</span>
          </div>
        </div>


        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green shadow-[0_0_12px_rgba(0,255,102,0.06)]'
                    : 'text-cyber-light/60 hover:text-white hover:bg-cyber-gray/20 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyber-green' : 'text-cyber-light/40'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-cyber-green/10 bg-cyber-dark/40">
        <div className="text-[10px] text-cyber-light/40 space-y-1">
          <div>ENGINE VERSION: <span className="text-white">v1.2.0-STABLE</span></div>
          <div>RUNTIME: <span className="text-cyber-green">Wrangler Dev</span></div>
        </div>
      </div>
    </aside>
  );
}
