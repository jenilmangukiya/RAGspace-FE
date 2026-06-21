import { useQuery, useMutation } from '@tanstack/react-query';
import { billingApi, SubscriptionInfo } from '../api/billing.api';
import { toast } from 'sonner';

export const useBilling = () => {

  // Fetch subscription details
  const subscriptionQuery = useQuery<SubscriptionInfo>({
    queryKey: ['subscription'],
    queryFn: billingApi.getSubscription,
    // Keep data fresh for a moderate duration to avoid constant refetches on layout changes
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Stripe Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: billingApi.createCheckoutSession,
    onSuccess: (checkoutUrl) => {
      if (checkoutUrl) {
        toast.info('Redirecting to Stripe checkout...');
        // Redirect to the Stripe hosted checkout page
        window.location.href = checkoutUrl;
      } else {
        toast.error('Stripe checkout session created but no URL returned.');
      }
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || error.message || 'Failed to start checkout session';
      toast.error(msg);
    },
  });

  return {
    subscription: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isRefetching: subscriptionQuery.isRefetching,
    error: subscriptionQuery.error,
    refetchSubscription: subscriptionQuery.refetch,
    checkout: checkoutMutation.mutateAsync,
    isCheckingOut: checkoutMutation.isPending,
  };
};
