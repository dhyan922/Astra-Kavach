import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ScanRemediate from './pages/ScanRemediate';
import ExploitLab from './pages/ExploitLab';
import ComplianceAudit from './pages/ComplianceAudit';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-cyber-dark text-cyber-light selection:bg-cyber-green/30 selection:text-white">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Panel Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />

          <main className="flex-1 p-8 overflow-y-auto radar-grid relative">
            {/* Ambient scanner beam visual element */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-green/10 to-transparent scanner-beam opacity-40" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/scan" element={<ScanRemediate />} />
                <Route path="/exploit" element={<ExploitLab />} />
                <Route path="/audit" element={<ComplianceAudit />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}
