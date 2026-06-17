import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, MessageSquare, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useApps } from '../../hooks/useApps';
import { useDocuments } from '../../hooks/useDocuments';
import { useChat } from '../../hooks/useChat';
import UploadArea from '../../components/UploadArea';
import DocumentList from '../../components/DocumentList';
import ChatBox from '../../components/ChatBox';
import { Loader } from '../../components/Loader';
import { ChatSource } from '../../types';
import { clsx } from 'clsx';

export const AppDetails: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const { useAppQuery } = useApps();
  const { data: app, isLoading: isAppLoading } = useAppQuery(appId);
  const { documents, isLoading: isDocsLoading, uploadDocument, isUploading, deleteDocument } = useDocuments(appId);
  const { messages, sendMessage, isLoading: isChatLoading, sources } = useChat(appId);

  // Responsive active tab state for mobile/tablet screens
  const [activeTab, setActiveTab] = useState<'docs' | 'chat'>('docs');
  
  // Drawer state to view details of the clicked citation source card
  const [selectedSource, setSelectedSource] = useState<{ source: ChatSource; docName: string } | null>(null);

  const handleSourceClick = (source: ChatSource) => {
    const doc = documents.find((d) => d.id === source.document_id);
    setSelectedSource({
      source,
      docName: doc ? doc.file_name : 'Unknown Document',
    });
  };

  if (isAppLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">App Not Found</h3>
        <p className="text-sm text-zinc-400 mb-6">
          The application workspace you are trying to view does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/dashboard"
          className="gradient-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 md:p-6 lg:p-8 overflow-hidden max-w-7xl w-full mx-auto relative">
      {/* Upper context breadcrumbs and navigation */}
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        <Link to="/dashboard" className="hover:text-zinc-300 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-300">{app.name}</span>
      </div>

      {/* Tabs navigation for mobile only */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/30 rounded-xl p-1 mb-4 lg:hidden">
        <button
          onClick={() => setActiveTab('docs')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer',
            activeTab === 'docs'
              ? 'bg-zinc-800 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Documents ({documents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer',
            activeTab === 'chat'
              ? 'bg-zinc-800 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Workspace panel layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Side: Documents */}
        <section
          className={clsx(
            'lg:col-span-5 flex flex-col gap-6 min-h-0',
            activeTab === 'docs' ? 'flex' : 'hidden lg:flex'
          )}
        >
          {/* Upload Dropzone */}
          <div className="glass-panel rounded-2xl p-5 shadow-xs shrink-0">
            <h3 className="text-sm font-bold text-white mb-1">Upload Document</h3>
            <p className="text-xs text-zinc-400 mb-4">Add PDF document reference for indexing.</p>
            <UploadArea onUpload={uploadDocument} isUploading={isUploading} />
          </div>

          {/* Document list with polling indicator */}
          <div className="glass-panel rounded-2xl p-5 shadow-xs flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-bold text-white">Documents</h3>
              {documents.some((d) => d.status === 'processing' || d.status === 'uploaded') && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                  <span>Syncing...</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isDocsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader size="md" />
                </div>
              ) : (
                <DocumentList documents={documents} onDelete={deleteDocument} />
              )}
            </div>
          </div>
        </section>

        {/* Right Side: AI Chat Section */}
        <section
          className={clsx(
            'lg:col-span-7 flex flex-col min-h-0 h-full',
            activeTab === 'chat' ? 'flex' : 'hidden lg:flex'
          )}
        >
          <ChatBox
            messages={messages}
            sources={sources}
            documents={documents}
            onSendMessage={sendMessage}
            isLoading={isChatLoading}
            onSourceClick={handleSourceClick}
          />
        </section>
      </div>

      {/* Source Citation Details Slider/Drawer */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs p-4">
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setSelectedSource(null)}
          />
          
          <div className="glass-panel w-full max-w-md h-full rounded-2xl p-6 shadow-2xl relative z-10 flex flex-col gap-6 animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Citation Details</h3>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Doc details */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Document Name</span>
                <p className="text-sm font-semibold text-white break-all">{selectedSource.docName}</p>
              </div>

              {/* Chunk index */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Indexed Chunk</span>
                <p className="text-sm font-medium text-zinc-300">
                  Chunk Index: <span className="font-semibold text-zinc-100">{selectedSource.source.chunk_index}</span>
                </p>
              </div>

              {/* Relevance score */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Relevance Confidence Match</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-400">
                    {(selectedSource.source.score * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-zinc-500">(Cosine similarity index: {selectedSource.source.score.toFixed(4)})</span>
                </div>
              </div>

              {/* Notice */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 mt-6 text-xs text-zinc-400 leading-relaxed">
                This document chunk was dynamically retrieved from the Qdrant vector database using embeddings matching your chat question's semantic context.
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 shrink-0 flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="gradient-btn rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDetails;
