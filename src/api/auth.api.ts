import { supabase } from '../services/supabase';

export const authApi = {
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};
