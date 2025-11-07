import { create } from 'zustand';

import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
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
}));