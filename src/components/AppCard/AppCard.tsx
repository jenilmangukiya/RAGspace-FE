import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, Calendar, FileText, Trash2 } from 'lucide-react';
import { App } from '../../types';

export interface AppCardProps {
  app: App;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onDelete, isDeleting }) => {
  const documentCount = app.document_count ?? 0;
  const createdDate = app.created_at
    ? new Date(app.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${app.name}"? This action cannot be undone.`)) {
      onDelete(app.id);
    }
  };

  return (
    <div className="group relative">
      <Link to={`/app/${app.id}`}>
        <div className="glass-panel glass-panel-hover flex flex-col justify-between h-48 rounded-2xl p-6 transition-all duration-300">
          <div>
            {/* Folder Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-indigo-400 mb-4 shadow-inner">
              <Folder className="h-6 w-6" />
            </div>
            
            {/* App Title */}
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {app.name}
            </h3>
          </div>

          {/* Metadata Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{createdDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
              <FileText className="h-3.5 w-3.5 text-indigo-500/80" />
              <span>
                {documentCount} {documentCount === 1 ? 'doc' : 'docs'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete Overlay Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 rounded-lg p-2 text-zinc-500 hover:bg-red-950/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
        title="Delete App"
      >
        <Trash2 className="h-4.5 w-4.5" />
      </button>
    </div>
  );
};

export default AppCard;
