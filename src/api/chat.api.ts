import { api, baseURL } from './axios';
import { supabase } from '../services/supabase';
import { ChatMessage, ChatResponse, SearchResponse, ChatSource } from '../types';

export interface SendMessagePayload {
  app_id: string;
  query: string;
  history: ChatMessage[];
}

export interface StreamMessageCallbacks {
  onToken: (token: string) => void;
  onSources: (sources: ChatSource[]) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export interface SearchPayload {
  app_id: string;
  query: string;
}

export const chatApi = {
  sendMessage: async (payload: SendMessagePayload): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat/', payload);
    return response.data;
  },

  streamMessage: async (
    payload: SendMessagePayload,
    callbacks: StreamMessageCallbacks
  ): Promise<void> => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const response = await fetch(`${baseURL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'token') {
                callbacks.onToken(parsed.data);
              } else if (parsed.type === 'sources') {
                callbacks.onSources(parsed.data);
              } else if (parsed.type === 'done') {
                callbacks.onDone();
              }
            } catch (err) {
              console.error('Error parsing stream chunk:', err);
            }
          }
        }
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      callbacks.onError(err);
    }
  },

  search: async (payload: SearchPayload): Promise<SearchResponse> => {
    const response = await api.post<SearchResponse>('/api/search/', payload);
    return response.data;
  },
};
