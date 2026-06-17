import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Component */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col min-h-0 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
