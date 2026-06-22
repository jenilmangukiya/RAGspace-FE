import { api } from './axios';

export interface SubscriptionInfo {
  plan_name: string;
  status: string;
  trial_ends_at: string | null;
}

export interface CheckoutRequest {
  price_id: string;
}

export const billingApi = {
  getSubscription: async (): Promise<SubscriptionInfo> => {
    const { data } = await api.get<SubscriptionInfo>('/api/billing/subscription');
    return data;
  },

  createCheckoutSession: async (priceId: string): Promise<string> => {
    // Note: The FastAPI endpoint returns the raw string URL returned by billing_service.create_checkout_session
    const { data } = await api.post<string>('/api/billing/checkout', { price_id: priceId });
    return data;
  },
};
