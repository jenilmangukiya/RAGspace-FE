import { api } from './axios';
import { App } from '../types';

export const appsApi = {
  getApps: async (): Promise<App[]> => {
    const response = await api.get<App[]>('/api/apps/');
    return response.data;
  },

  getApp: async (appId: string): Promise<App> => {
    const response = await api.get<App>(`/api/apps/${appId}`);
    return response.data;
  },

  createApp: async (name: string): Promise<App> => {
    const response = await api.post<App>('/api/apps/', { name });
    return response.data;
  },

  deleteApp: async (appId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/apps/${appId}`);
    return response.data;
  },
};
