import React from 'react';
import { FileText, Award } from 'lucide-react';
import { ChatSource } from '../../types';

export interface SourceCardProps {
  source: ChatSource;
  documentName: string;
  onClick?: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, documentName, onClick }) => {
  // Convert score decimal into percentage if needed or display standard decimal
  const formattedScore = (source.score * 100).toFixed(0);

  return (
    <div
      onClick={onClick}
      className="glass-panel border-zinc-800 bg-zinc-900/30 rounded-xl p-3.5 flex flex-col justify-between hover:bg-zinc-800/30 hover:border-zinc-700 transition-all cursor-pointer select-none group h-full flex-1 min-w-[140px] sm:min-w-[180px] max-w-full sm:max-w-[280px]"
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 group-hover:bg-indigo-950/20 group-hover:text-indigo-300 transition-colors">
          <FileText className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate"
            title={documentName}
          >
            {documentName}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {source.page_number !== undefined ? (
              <>
                Page <span className="font-semibold text-zinc-400">{source.page_number}</span>
              </>
            ) : (
              <>
                Reference: <span className="font-semibold text-zinc-400">{source.chunk_index + 1}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-zinc-800/50 pt-2.5 mt-2.5">
        <span className="text-[10px] text-zinc-500 font-medium">Relevance Match</span>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 shrink-0">
          <Award className="h-3 w-3" />
          {formattedScore}%
        </span>
      </div>
    </div>
  );
};

export default SourceCard;
