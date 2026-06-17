import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Menu, ChevronRight, LayoutDashboard, Folder } from 'lucide-react';
import { useApps } from '../../hooks/useApps';

export interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { appId } = useParams();
  const { useAppQuery } = useApps();
  const { data: currentApp } = useAppQuery(appId);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 backdrop-blur-md">
      {/* Breadcrumbs Left Area */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden items-center gap-2 text-sm font-medium text-zinc-400 sm:flex">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          {currentApp && (
            <>
              <ChevronRight className="h-4 w-4 text-zinc-600" />
              <div className="flex items-center gap-1.5 text-zinc-200">
                <Folder className="h-4 w-4 text-indigo-400" />
                <span className="font-semibold">{currentApp.name}</span>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Right User Status */}
      <div className="flex items-center gap-4">
        {currentApp && (
          <span className="hidden items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20 lg:flex">
            Active App
          </span>
        )}
        <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-lg text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
