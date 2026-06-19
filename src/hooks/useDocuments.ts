import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api/documents.api';
import { Document } from '../types';
import { toast } from 'sonner';

export const useDocuments = (appId: string | undefined) => {
  const queryClient = useQueryClient();

  // Query: Get documents for app
  const documentsQuery = useQuery({
    queryKey: ['documents', appId],
    queryFn: () => documentsApi.getDocuments(appId!),
    enabled: !!appId,
    // Poll every 10 seconds if any document is in 'uploaded' or 'processing' status
    refetchInterval: (query) => {
      const data = query.state.data as Document[] | undefined;
      if (!data) return false;
      
      const hasPending = data.some(
        (doc) => doc.status === 'uploaded' || doc.status === 'processing'
      );
      return hasPending ? 10000 : false;
    },
  });

  // Mutation: Upload document
  const uploadMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => documentsApi.uploadDocument(appId!, file),
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ['documents', appId] });
      // Also invalidate apps to update document count
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['app', appId] });
      toast.success(`Document "${newDoc.file_name}" uploaded successfully and enqueued for processing.`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || error.message || 'Failed to upload document';
      toast.error(msg);
    },
  });

  // Mutation: Delete document
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => documentsApi.deleteDocument(appId!, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', appId] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['app', appId] });
      toast.success('Document deleted successfully.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || error.message || 'Failed to delete document';
      toast.error(msg);
    },
  });

  const uploadDocument = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are supported.');
      return;
    }
    return uploadMutation.mutateAsync({ file });
  };

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    error: documentsQuery.error,
    uploadDocument,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables : null,
  };
};
