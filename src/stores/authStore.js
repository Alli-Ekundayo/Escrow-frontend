import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      setUser: (user) => set({ user }),

      login: async (credentials) => {
        const { data } = await authApi.login(credentials);
        set({
          accessToken: data.access,
          refreshToken: data.refresh,
          user: data.user,
        });
        return data;
      },

      register: async (payload) => {
        const { data } = await authApi.register(payload);
        return data;
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },

      refreshAccessToken: async () => {
        const { refreshToken: rt } = get();
        if (!rt) throw new Error('No refresh token');
        const { data } = await authApi.refreshToken(rt);
        set({ accessToken: data.access });
        return data.access;
      },

      fetchProfile: async () => {
        const { data } = await authApi.getProfile();
        set({ user: data });
        return data;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
