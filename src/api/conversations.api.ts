import { api } from './axios';
import { Conversation } from '../types';

export const conversationsApi = {
  getConversations: async (appId: string): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/api/conversations/', {
      params: { app_id: appId },
    });
    return response.data;
  },

  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/api/conversations/${conversationId}`);
    return response.data;
  },

  createConversation: async (appId: string): Promise<Conversation> => {
    const response = await api.post<Conversation>(`/api/conversations/${appId}`);
    return response.data;
  },

  deleteConversation: async (conversationId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/conversations/${conversationId}`);
    return response.data;
  },

  renameConversation: async (conversationId: string, title: string): Promise<Conversation> => {
    const response = await api.put<Conversation>(`/api/conversations/${conversationId}`, { title });
    return response.data;
  },
};
