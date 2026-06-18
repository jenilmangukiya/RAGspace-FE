import React from 'react';
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Plus, Folder, LogOut, X } from 'lucide-react';
import { useApps } from '../../hooks/useApps';
import { useAuth } from '../../hooks/useAuth';
import { clsx } from 'clsx';

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { apps } = useApps();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { appId } = useParams();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 md:translate-x-0 md:static md:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header/Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-500">
              <span className="font-bold text-white text-sm">R</span>
            </div>
            <span className="font-extrabold tracking-tight text-lg text-white">
              RAG<span className="gradient-text">Space</span>
            </span>
          </Link>
          <button
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          </div>

          {/* User Apps Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <span>My Apps</span>
              <Link
                to="/dashboard"
                className="text-zinc-400 hover:text-indigo-400"
                title="Create new App"
              >
                <Plus className="h-4.5 w-4.5" />
              </Link>
            </div>

            <div className="space-y-1 max-h-[40vh] overflow-y-auto">
              {apps.length === 0 ? (
                <p className="px-3 py-2 text-xs text-zinc-600 italic">No apps yet</p>
              ) : (
                apps.map((app) => (
                  <NavLink
                    key={app.id}
                    to={`/app/${app.id}`}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors group',
                      appId === app.id
                        ? 'bg-indigo-950/40 text-indigo-300 border-l-2 border-indigo-500'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Folder className="h-4 w-4 shrink-0" />
                      <span className="truncate">{app.name}</span>
                    </div>
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </nav>

        {/* Footer User Info */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-900/50">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-300">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-red-950/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
