import { create } from 'zustand';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (userData: Omit<User, 'role'>) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getUserRole: () => Promise<Role>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (userData) => {
    try {
      set({ isLoading: true });
      
      // Get user role from Supabase
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userData.id)
        .maybeSingle();

      if (roleError) {
        throw roleError;
      }

      // Default to 'guest' if no role is found
      const role = (roleData?.role_id || 'guest') as Role;
      
      set({ 
        user: { ...userData, role },
        isAuthenticated: true,
        error: null
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to login' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to logout' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  getUserRole: async () => {
    const { user } = get();
    if (!user) return 'guest';
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return (data?.role_id || 'guest') as Role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'guest';
    }
  },
}));