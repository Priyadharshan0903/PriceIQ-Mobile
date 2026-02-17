import api from './api';
import { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart | null> {
    const response = await api.get('/api/cart');
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  },

  async addItem(productId: string, quantity: number = 1): Promise<Cart> {
    const response = await api.post('/api/cart/add', { productId, quantity });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to add item to cart');
  },

  async updateItem(productId: string, quantity: number): Promise<Cart> {
    const response = await api.put('/api/cart/update', { productId, quantity });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update cart');
  },

  async removeItem(productId: string): Promise<Cart> {
    const response = await api.delete(`/api/cart/remove/${productId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to remove item');
  },

  async clearCart(): Promise<void> {
    await api.delete('/api/cart/clear');
  },
};
