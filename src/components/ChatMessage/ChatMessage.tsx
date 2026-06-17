import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatSource, Document } from '../../types';
import SourceCard from '../SourceCard';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';

export interface ChatMessageProps {
  message: ChatMessageType;
  sources?: ChatSource[];
  documents: Document[];
  onSourceClick?: (source: ChatSource) => void;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sources = [],
  documents = [],
  onSourceClick,
  isLoading = false,
}) => {
  const isUser = message.role === 'user';

  // Helper to lookup file_name by document_id
  const getDocumentName = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    return doc ? doc.file_name : 'Unknown Document';
  };

  return (
    <div className={clsx('flex w-full gap-4 py-6 px-4 md:px-6 border-b border-zinc-900/50', isUser ? 'bg-zinc-950/20' : 'bg-zinc-900/10')}>
      {/* Avatar */}
      <div
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold',
          isUser
            ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
            : 'bg-indigo-950 border-indigo-800 text-indigo-400'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-4 overflow-hidden">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {isUser ? 'You' : 'Assistant'}
        </p>

        {/* Text */}
        <div className="text-zinc-200 text-sm leading-relaxed break-words">
          {isLoading && !message.content ? (
            <div className="flex items-center gap-1 mt-1 bg-zinc-800/40 border border-zinc-800 px-3 py-2.5 rounded-2xl rounded-tl-xs w-max">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
            </div>
          ) : (
            <ReactMarkdown
              /* eslint-disable @typescript-eslint/no-unused-vars */
              components={{
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noreferrer" {...props} />,
                code: ({ node, ...props }) => <code className="bg-zinc-800/80 border border-zinc-700/50 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs" {...props} />,
                pre: ({ node, ...props }) => <pre className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg overflow-x-auto my-3 text-xs font-mono text-zinc-300" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mt-3 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mt-3 mb-1" {...props} />,
              }}
              /* eslint-enable @typescript-eslint/no-unused-vars */
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Citation Sources */}
        {!isUser && sources.length > 0 && (
          <div className="pt-4 border-t border-zinc-900/80">
            <p className="text-xs font-semibold text-zinc-500 mb-3">Sources Used</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sources.map((src, i) => (
                <SourceCard
                  key={i}
                  source={src}
                  documentName={getDocumentName(src.document_id)}
                  onClick={() => onSourceClick?.(src)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
