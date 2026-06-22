import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Menu, ChevronRight, LayoutDashboard, Folder, CreditCard } from 'lucide-react';
import { useApps } from '../../hooks/useApps';
import { useBilling } from '../../hooks/useBilling';

export interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { appId } = useParams();
  const { useAppQuery } = useApps();
  const { data: currentApp } = useAppQuery(appId);
  const { subscription, isLoading } = useBilling();

  // Helper to calculate trial days left
  const getTrialDaysRemaining = (endsAtStr: string) => {
    const endsAt = new Date(endsAtStr);
    const now = new Date();
    const diffTime = endsAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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

        {subscription && !isLoading && (
          <Link
            to="/settings"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-90 ${
              subscription.plan_name === 'free'
                ? 'bg-amber-500/5 text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
                : 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>
              {subscription.plan_name === 'free' ? 'Free Trial' : `${subscription.plan_name.charAt(0).toUpperCase()}${subscription.plan_name.slice(1)}`}
            </span>
            {subscription.plan_name === 'free' && subscription.trial_ends_at && (
              <span className="bg-amber-500/10 text-amber-400 text-[10px] px-1 py-0.5 rounded-sm font-bold border border-amber-500/10 ml-0.5">
                {getTrialDaysRemaining(subscription.trial_ends_at)}d left
              </span>
            )}
          </Link>
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
