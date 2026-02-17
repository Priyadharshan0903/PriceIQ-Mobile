import api, { apiClient } from './api';
import { AuthResponse } from '../types';

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', { email, password });
    if (response.data.success) {
      apiClient.setAccessToken(response.data.data.accessToken);
      return response.data.data;
    }
    throw new Error(response.data.error || 'Registration failed');
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.success) {
      apiClient.setAccessToken(response.data.data.accessToken);
      return response.data.data;
    }
    throw new Error(response.data.error || 'Login failed');
  },

  async logout(userId: string, refreshToken: string): Promise<void> {
    await api.post('/api/auth/logout', { userId, refreshToken });
    apiClient.setAccessToken(null);
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    if (response.data.success) {
      apiClient.setAccessToken(response.data.data.accessToken);
      return response.data.data;
    }
    throw new Error('Token refresh failed');
  },
};
