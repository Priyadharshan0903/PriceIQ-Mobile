import api from './api';
import { Order, Address } from '../types';

export const orderService = {
  async createOrder(shippingAddress: Address, paymentMethod: string): Promise<Order> {
    const response = await api.post('/api/orders', { shippingAddress, paymentMethod });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create order');
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get('/api/orders');
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get(`/api/orders/${orderId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Order not found');
  },
};
