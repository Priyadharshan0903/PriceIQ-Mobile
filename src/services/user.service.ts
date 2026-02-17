import api from './api';

export const userService = {
  async getProfile(): Promise<any> {
    const response = await api.get('/api/users/profile');
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  },

  async updateProfile(data: any): Promise<any> {
    const response = await api.put('/api/users/profile', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update profile');
  },

  async getPreferences(): Promise<any> {
    const response = await api.get('/api/users/preferences');
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  },

  async updatePreferences(data: any): Promise<any> {
    const response = await api.put('/api/users/preferences', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update preferences');
  },
};
