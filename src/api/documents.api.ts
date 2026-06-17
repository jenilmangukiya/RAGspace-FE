import { api } from './axios';
import { Document } from '../types';

export const documentsApi = {
  getDocuments: async (appId: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(`/api/apps/${appId}/documents/list`);
    return response.data;
  },

  getDocument: async (appId: string, documentId: string): Promise<Document> => {
    const response = await api.get<Document>(`/api/apps/${appId}/documents/${documentId}`);
    return response.data;
  },

  uploadDocument: async (appId: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<Document>(
      `/api/apps/${appId}/documents/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteDocument: async (appId: string, documentId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/api/apps/${appId}/documents/${documentId}`
    );
    return response.data;
  },
};
