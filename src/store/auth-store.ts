import { create } from 'zustand';
import api from '../api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'PLATFORM_ADMIN' | 'EXECUTIVE_LEADERSHIP' | 'ACCOUNT_LEAD' | 'DELIVERY_LEAD';
  roleLabel: string;
  isActive: boolean;
  tabsToShow?: string[];
  permissions?: Record<string, string[]>;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (email?: string) => Promise<boolean>;
  logout: () => void;
  checkMe: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user profile session detail immediately after login to capture tabsToShow list
      const meResponse = await api.get('/auth/me');
      const user = meResponse.data.data;

      set({
        isAuthenticated: true,
        user,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  loginWithGoogle: async (email) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/google', { email });
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user profile session detail immediately after login to capture tabsToShow list
      const meResponse = await api.get('/auth/me');
      const user = meResponse.data.data;

      set({
        isAuthenticated: true,
        user,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, user: null });
  },

  checkMe: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data;

      set({
        isAuthenticated: true,
        user: userData,
      });
      return true;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ isAuthenticated: false, user: null });
      return false;
    }
  },
}));
