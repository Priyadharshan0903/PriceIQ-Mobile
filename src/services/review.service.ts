import api from './api';
import { Review, ReviewStats } from '../types';

export const reviewService = {
  async getReviewsByProduct(productId: string, page: number = 1): Promise<{ reviews: Review[]; total: number }> {
    const response = await api.get(`/api/reviews/product/${productId}`, { params: { page, limit: 10 } });
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch reviews');
  },

  async createReview(productId: string, rating: number, title: string, content: string): Promise<Review> {
    const response = await api.post('/api/reviews', { productId, rating, title, content });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create review');
  },

  async getReviewStats(productId: string): Promise<ReviewStats | null> {
    const response = await api.get(`/api/reviews/stats/${productId}`);
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  },

  async markHelpful(reviewId: string): Promise<Review> {
    const response = await api.post(`/api/reviews/${reviewId}/helpful`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to mark review as helpful');
  },
};
