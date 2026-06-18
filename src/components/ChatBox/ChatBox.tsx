import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, ArrowDown, Menu, Plus, Trash2, Edit2, MessageSquare } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatSource, Document, Conversation } from '../../types';
import ChatMessage from '../ChatMessage';
import { Loader } from '../Loader';
import { clsx } from 'clsx';

export interface ChatBoxProps {
  messages: ChatMessageType[];
  sources?: ChatSource[];
  documents: Document[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSourceClick?: (source: ChatSource) => void;
  // Persistent Chat additions:
  conversations?: Conversation[];
  activeConversationId?: string | null;
  onSelectConversation?: (id: string | null) => Promise<void>;
  onDeleteConversation?: (id: string) => Promise<void>;
  onRenameConversation?: (id: string, title: string) => Promise<void>;
  isConversationsLoading?: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  sources = [],
  documents,
  onSendMessage,
  isLoading,
  onSourceClick,
  conversations = [],
  activeConversationId = null,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isConversationsLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Sidebar visibility state: default to closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inline renaming state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
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

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim() && onRenameConversation) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/10 border border-zinc-800 rounded-2xl overflow-hidden relative">
      
      {/* Header Bar */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800 bg-zinc-950/40 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            title={isSidebarOpen ? "Collapse history" : "Expand history"}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <span className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[250px]">
            {activeConversationId 
              ? conversations.find(c => c.id === activeConversationId)?.title || 'Active Chat'
              : 'New Chat'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectConversation?.(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Container: Sidebar + Chat Feed */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        
        {/* Sidebar Overlay Backdrop for Mobile */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={clsx(
            "absolute inset-y-0 left-0 z-35 flex w-60 shrink-0 flex-col bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 md:static md:translate-x-0 md:bg-zinc-950/20",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
          )}
        >
          <div className="p-3 border-b border-zinc-900 shrink-0">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Chat History</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {isConversationsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader size="sm" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <MessageSquare className="h-8 w-8 text-zinc-750 mb-2 opacity-50" />
                <p className="text-[11px] text-zinc-500 italic">No past chats yet</p>
              </div>
            ) : (
              conversations.map((convo) => {
                const isActive = convo.id === activeConversationId;
                const isEditing = convo.id === editingId;

                return (
                  <div
                    key={convo.id}
                    className={clsx(
                      "group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer relative border",
                      isActive
                        ? "bg-indigo-950/20 text-indigo-300 border-indigo-500/20 shadow-xs"
                        : "text-zinc-400 border-transparent hover:bg-zinc-850 hover:text-white"
                    )}
                    onClick={() => {
                      if (!isEditing) {
                        onSelectConversation?.(convo.id);
                        // On mobile, close sidebar after selecting conversation
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 mr-1.5 min-w-0">
                      <MessageSquare className={clsx("h-3.5 w-3.5 shrink-0", isActive ? "text-indigo-450" : "text-zinc-500")} />
                      
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, convo.id)}
                          onBlur={() => handleSaveEdit(convo.id)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="bg-zinc-900 text-white border border-zinc-700 rounded-sm px-1 py-0.5 w-full text-xs outline-hidden focus:border-indigo-500"
                        />
                      ) : (
                        <span className="truncate">{convo.title}</span>
                      )}
                    </div>

                    {/* Actions on hover */}
                    {!isEditing && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 bg-transparent transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(convo.id, convo.title);
                          }}
                          className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Rename chat"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation?.(convo.id);
                          }}
                          className="p-1 rounded-md text-zinc-500 hover:text-rose-450 hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Delete chat"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto divide-y divide-zinc-900/30 px-2 sm:px-4"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 animate-pulse-slow shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">AI Document Assistant</h4>
                <p className="max-w-xs text-xs text-zinc-500 leading-relaxed">
                  Ask questions about your uploaded PDF documents. The AI will cite exact page chunks in its answer.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  sources={i === messages.length - 1 && msg.role === 'assistant' ? sources : []}
                  documents={documents}
                  onSourceClick={onSourceClick}
                  isLoading={isLoading && i === messages.length - 1}
                />
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBtn && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="absolute bottom-24 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shadow-xl hover:bg-zinc-800 transition-all cursor-pointer z-10"
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
              className="gradient-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatBox;
