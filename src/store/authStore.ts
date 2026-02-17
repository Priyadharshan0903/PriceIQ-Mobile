import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: async (user, accessToken, refreshToken) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  clearAuth: async () => {
    await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    try {
      const [userStr, accessToken, refreshToken] = await AsyncStorage.multiGet([
        'user',
        'accessToken',
        'refreshToken',
      ]);

      const user = userStr[1] ? JSON.parse(userStr[1]) : null;

      if (user && accessToken[1] && refreshToken[1]) {
        set({
          user,
          accessToken: accessToken[1],
          refreshToken: refreshToken[1],
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
