import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  role: 'PLATFORM_ADMIN' | 'EXECUTIVE_LEADERSHIP' | 'ACCOUNT_LEAD' | 'DELIVERY_LEAD';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, role?: User['role']) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, role = 'ACCOUNT_LEAD') => {
    // Mock authentication delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({
      isAuthenticated: true,
      user: {
        name: email.split('@')[0].toUpperCase(),
        email,
        role,
      },
    });
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
