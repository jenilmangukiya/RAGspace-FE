import React, { useState } from 'react';
import { useApps } from '../../hooks/useApps';
import { useAuth } from '../../hooks/useAuth';
import AppCard from '../../components/AppCard';
import EmptyState from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { Search, Plus, FolderPlus, X, Loader2, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { apps, isLoading, createApp, deleteApp, isCreating } = useApps();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim() || isCreating) return;

    try {
      await createApp(newAppName.trim());
      setNewAppName('');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter apps by search query
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-8 max-w-7xl mx-auto">
        {user?.email === (import.meta.env.VITE_DEMO_EMAIL || 'demo@demo.com') && (
          <div className="flex items-start gap-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Logged in to Demo Workspace</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You are currently signed in as a guest with the public demo account (<span className="text-indigo-300 font-semibold">{import.meta.env.VITE_DEMO_EMAIL || 'demo@demo.com'}</span>). Feel free to explore, create app workspaces, upload documents, and chat with AI agents. Please note that data created here is shared.
              </p>
            </div>
          </div>
        )}

        {/* Upper header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            My <span className="gradient-text">Apps</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your document apps and ask questions with AI.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="gradient-btn flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Create App</span>
        </button>
      </div>

      {/* Search Bar */}
      {apps.length > 0 && (
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps by name..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Grid of Apps / Empty State */}
      {filteredApps.length === 0 ? (
        <div className="py-8">
          <EmptyState
            title={searchQuery ? 'No matching apps' : 'No apps created yet'}
            description={
              searchQuery
                ? `We couldn't find any app matching "${searchQuery}". Try searching for something else.`
                : "Create a new app workspace to upload PDFs and start asking questions with AI."
            }
            icon={<FolderPlus className="h-10 w-10 text-zinc-600" />}
            action={
              !searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="gradient-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create First App</span>
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onDelete={deleteApp}
            />
          ))}
        </div>
      )}

      {/* Create App Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Create New App</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Create a workspace container to group related PDF documents.
            </p>

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  App Name
                </label>
                <input
                  type="text"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. Legal Documents, Financial Reports"
                  autoFocus
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newAppName.trim() || isCreating}
                  className="gradient-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Create App</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Dashboard;
