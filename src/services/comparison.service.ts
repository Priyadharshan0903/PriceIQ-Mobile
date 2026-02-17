import api from './api';
import { ComparisonResult } from '../types';

export const comparisonService = {
  async compareProducts(productIds: string[]): Promise<ComparisonResult> {
    const response = await api.post('/api/comparison/compare', { productIds });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Comparison failed');
  },

  async getComparisonHistory(limit: number = 10): Promise<any[]> {
    const response = await api.get('/api/comparison/history', { params: { limit } });
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  },
};
