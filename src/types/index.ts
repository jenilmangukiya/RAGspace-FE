export interface User {
  id: string;
  email?: string;
}

export interface App {
  id: string;
  name: string;
  created_at?: string;
  document_count?: number;
}

export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed';

export interface Document {
  id: string;
  app_id: string;
  file_name: string;
  status: DocumentStatus;
  created_at: string;
  error_message?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSource {
  document_id: string;
  chunk_index: number;
  score: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export interface SearchResult {
  score: number;
  text: string;
  document_id: string;
  chunk_index: number;
}

export interface SearchResponse {
  results: SearchResult[];
}
