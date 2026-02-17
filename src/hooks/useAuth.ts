import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(email, password);
      await setAuth(response.user, response.accessToken, response.refreshToken);
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      await setAuth(response.user, response.accessToken, response.refreshToken);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { user: currentUser, refreshToken } = useAuthStore.getState();
      if (currentUser && refreshToken) {
        await authService.logout(currentUser.id, refreshToken);
      }
      await clearAuth();
    } catch (err) {
      // Still clear auth even if API call fails
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
  };
};
