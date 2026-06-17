import { api } from './axios';
import { ChatMessage, ChatResponse, SearchResponse } from '../types';

export interface SendMessagePayload {
  app_id: string;
  query: string;
  history: ChatMessage[];
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

  search: async (payload: SearchPayload): Promise<SearchResponse> => {
    const response = await api.post<SearchResponse>('/api/search/', payload);
    return response.data;
  },
};
