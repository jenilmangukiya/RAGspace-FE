import React from 'react';
import { FileText, Trash2, CheckCircle2, Loader2, AlertTriangle, FileClock } from 'lucide-react';
import { Document, DocumentStatus } from '../../types';
import { clsx } from 'clsx';

export interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  deletingId,
}) => {
  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'processed':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Processed
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
            <AlertTriangle className="h-3 w-3" />
            Failed
          </span>
        );
      case 'uploaded':
      default:
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <FileClock className="h-3 w-3" />
            Enqueued
          </span>
        );
    }
  };

  const handleDelete = (docId: string, fileName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${fileName}"? This will remove its embedded chunks from the vector database.`)) {
      onDelete(docId);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-10 w-10 text-zinc-700 mb-3" />
        <p className="text-sm font-medium text-zinc-400">No documents uploaded yet.</p>
        <p className="text-xs text-zinc-600 mt-1">Upload a PDF file to begin chatting.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800/60 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/10">
      {documents.map((doc) => {
        const createdDate = new Date(doc.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={doc.id}
            className="group flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-200 truncate pr-4" title={doc.file_name}>
                  {doc.file_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">{createdDate}</span>
                  {doc.error_message && (
                    <span className="text-xs text-rose-500/90 truncate max-w-[180px]" title={doc.error_message}>
                      • {doc.error_message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(doc.status)}
              <button
                onClick={(e) => handleDelete(doc.id, doc.file_name, e)}
                disabled={!!deletingId}
                className={clsx(
                  'rounded-lg p-1.5 text-zinc-500 hover:bg-red-950/20 hover:text-red-400 transition-colors disabled:opacity-50 focus:opacity-100 flex items-center justify-center min-w-[28px] min-h-[28px]',
                  deletingId === doc.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                )}
                title="Delete Document"
              >
                {deletingId === doc.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentList;
