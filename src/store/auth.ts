import { create } from 'zustand';

import { UserProfile } from '@/types';

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: null,
  login: (token) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, user: null });
  },
  setUser: (user) => set({ user }),
  clearTokens: () => {
    set((state) => {
      state.logout();
      return state;
    });
  },
}));