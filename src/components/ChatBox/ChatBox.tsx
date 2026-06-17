import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, ArrowDown } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatSource, Document } from '../../types';
import ChatMessage from '../ChatMessage';

export interface ChatBoxProps {
  messages: ChatMessageType[];
  sources?: ChatSource[];
  documents: Document[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSourceClick?: (source: ChatSource) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  sources = [],
  documents,
  onSendMessage,
  isLoading,
  onSourceClick,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Show button if user scrolled up significantly
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollBtn(isScrolledUp);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const text = inputValue;
    setInputValue('');
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/10 border border-zinc-800 rounded-2xl overflow-hidden relative">
      {/* Chat Messages Feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto divide-y divide-zinc-900/30"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 animate-pulse-slow shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">AI Document Assistant</h4>
            <p className="max-w-xs text-xs text-zinc-500">
              Ask questions about your uploaded PDF documents. The AI will cite exact page chunks in its answer.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              // Only display sources on the last message if it's from the assistant
              sources={i === messages.length - 1 && msg.role === 'assistant' ? sources : []}
              documents={documents}
              onSourceClick={onSourceClick}
            />
          ))
        )}

        {/* Typing State Indicator */}
        {isLoading && (
          <div className="flex gap-4 py-6 px-4 md:px-6 bg-zinc-900/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-800 bg-indigo-950 text-indigo-400">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5 pt-1.5">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Assistant</span>
              <div className="flex items-center gap-1 mt-1 bg-zinc-800/40 border border-zinc-800 px-3 py-2.5 rounded-2xl rounded-tl-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-24 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shadow-xl hover:bg-zinc-800 transition-all"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-zinc-800 bg-zinc-950/40 backdrop-blur-xs flex items-center gap-3"
      >
        <div className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              documents.some((d) => d.status === 'processed')
                ? 'Ask a question about your documents...'
                : 'Upload processed documents to start chat'
            }
            disabled={isLoading || !documents.some((d) => d.status === 'processed')}
            rows={1}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/60 pl-4 pr-12 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors max-h-32 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="gradient-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
