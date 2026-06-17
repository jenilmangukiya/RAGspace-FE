import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appsApi } from '../api/apps.api';
import { toast } from 'sonner';

export const useApps = () => {
  const queryClient = useQueryClient();

  // Query: Get all apps
  const appsQuery = useQuery({
    queryKey: ['apps'],
    queryFn: appsApi.getApps,
  });

  // Query: Get a single app details
  const useAppQuery = (appId: string | undefined) => {
    return useQuery({
      queryKey: ['app', appId],
      queryFn: () => appsApi.getApp(appId!),
      enabled: !!appId,
    });
  };

  // Mutation: Create an app
  const createAppMutation = useMutation({
    mutationFn: appsApi.createApp,
    onSuccess: (newApp) => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success(`App "${newApp.name}" created successfully.`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || error.message || 'Failed to create app';
      toast.error(msg);
    },
  });

  // Mutation: Delete an app
  const deleteAppMutation = useMutation({
    mutationFn: appsApi.deleteApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success('App deleted successfully.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || error.message || 'Failed to delete app';
      toast.error(msg);
    },
  });

  return {
    apps: appsQuery.data || [],
    isLoading: appsQuery.isLoading,
    error: appsQuery.error,
    refetchApps: appsQuery.refetch,
    useAppQuery,
    createApp: createAppMutation.mutateAsync,
    isCreating: createAppMutation.isPending,
    deleteApp: deleteAppMutation.mutateAsync,
    isDeleting: deleteAppMutation.isPending,
  };
};
