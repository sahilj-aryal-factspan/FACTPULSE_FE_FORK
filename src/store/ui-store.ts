import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initialize from localStorage if present, otherwise default to light
  theme:
    (typeof window !== 'undefined' &&
      (localStorage.getItem('factpulse_theme') as 'light' | 'dark')) ||
    'light',
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('factpulse_theme', nextTheme);
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    localStorage.setItem('factpulse_theme', theme);
    set({ theme });
  },
}));
