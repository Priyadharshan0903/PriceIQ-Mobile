import api from './api';
import { Product, ProductListResponse, ProductFilters } from '../types';

export const productService = {
  async getProducts(filters?: ProductFilters, page: number = 1, limit: number = 20): Promise<ProductListResponse> {
    const params: any = { page, limit };
    if (filters?.category) params.category = filters.category;
    if (filters?.brand) params.brand = filters.brand;
    if (filters?.minPrice) params.minPrice = filters.minPrice;
    if (filters?.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters?.searchQuery) params.search = filters.searchQuery;

    const response = await api.get('/api/products', { params });
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch products');
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/api/products/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Product not found');
  },

  async searchProducts(query: string, page: number = 1): Promise<ProductListResponse> {
    const response = await api.post('/api/products/search', { query }, { params: { page, limit: 20 } });
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Search failed');
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get('/api/categories');
    if (response.data.success) {
      return response.data.data.map((c: any) => c.name);
    }
    return [];
  },

  async getBrands(): Promise<string[]> {
    const response = await api.get('/api/brands');
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  },
};
