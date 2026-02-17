// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  specifications: Record<string, string | number>;
  stock: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
}

export interface ReviewStats {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Comparison types
export interface ComparisonResult {
  products: Product[];
  differences: {
    spec: string;
    values: Record<string, string | number>;
  }[];
  recommendation?: {
    productId: string;
    reason: string;
  };
}

// Cart types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// User preferences types
export interface UserPreferences {
  userId: string;
  favoriteCategories: string[];
  favoriteBrands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
