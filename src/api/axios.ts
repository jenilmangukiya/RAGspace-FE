import axios from 'axios';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token from Supabase
api.interceptors.request.use(
  async (config) => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting Supabase session:', error);
    }
    
    const token = data.session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.detail || error.message || 'An unexpected error occurred';

    if (status === 401) {
      // Clear Supabase session and redirect to login
      await supabase.auth.signOut();
      toast.error('Session expired. Please log in again.');
      
      // Prevent infinite redirect loops if already on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status >= 500) {
      toast.error(`Server Error: ${errorMessage}`);
    } else {
      // Don't toast for everything automatically to let custom component catch blocks handle validations (e.g. form fields)
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  }
);
