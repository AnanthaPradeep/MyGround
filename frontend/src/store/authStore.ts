import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'OWNER' | 'BROKER' | 'DEVELOPER' | 'ADMIN';
  isVerified: boolean;
  trustScore: number;
  mobile?: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  email: string;
  mobile: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'USER' | 'OWNER' | 'BROKER' | 'DEVELOPER';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', data);
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          // Ensure user object has 'id' field (convert _id to id if needed)
          const userData = response.data.user;
          const user = userData.id 
            ? userData 
            : { ...userData, id: userData._id || userData.id };
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      // On rehydrate, if token exists, set isLoading to true so ProtectedRoute waits for checkAuth
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Token exists, but we need to verify it - keep isLoading true until checkAuth completes
          state.isLoading = true;
        }
      },
    }
  )
);
