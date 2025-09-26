import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  Product,
  Movement,
  CreateProductDto,
  CreateMovementDto,
  UpdateProductDto,
  UpdateMovementDto,
  MovementsSummary,
  DashboardOverview,
  ProductFilters,
  MovementFilters,
  MovementType,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.category) {
      params.append('category', filters.category);
    }

    const response: AxiosResponse<Product[]> = await api.get('/products', {
      params: Object.fromEntries(params),
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.get(`/products/${id}`);
    return response.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await api.get('/products/low-stock');
    return response.data;
  },

  create: async (productData: CreateProductDto): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.post('/products', productData);
    return response.data;
  },

  update: async (id: string, productData: UpdateProductDto): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const movementsApi = {
  getAll: async (filters?: MovementFilters): Promise<Movement[]> => {
    const params = new URLSearchParams();
    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.productId) {
      params.append('productId', filters.productId);
    }

    const response: AxiosResponse<Movement[]> = await api.get('/movements', {
      params: Object.fromEntries(params),
    });
    return response.data;
  },

  getById: async (id: string): Promise<Movement> => {
    const response: AxiosResponse<Movement> = await api.get(`/movements/${id}`);
    return response.data;
  },

  getByProduct: async (productId: string): Promise<Movement[]> => {
    const response: AxiosResponse<Movement[]> = await api.get('/movements', {
      params: { productId },
    });
    return response.data;
  },

  getByType: async (type: MovementType): Promise<Movement[]> => {
    const response: AxiosResponse<Movement[]> = await api.get('/movements', {
      params: { type },
    });
    return response.data;
  },

  getSummary: async (filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<MovementsSummary> => {
    const params = new URLSearchParams();
    if (filters?.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params.append('endDate', filters.endDate);
    }

    const response: AxiosResponse<MovementsSummary> = await api.get('/movements/summary', {
      params: Object.fromEntries(params),
    });
    return response.data;
  },

  create: async (movementData: CreateMovementDto): Promise<Movement> => {
    const response: AxiosResponse<Movement> = await api.post('/movements', movementData);
    return response.data;
  },

  update: async (id: string, movementData: UpdateMovementDto): Promise<Movement> => {
    const response: AxiosResponse<Movement> = await api.patch(`/movements/${id}`, movementData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/movements/${id}`);
  },
};

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    const [products, lowStockProducts, recentMovements, movementsSummary] = await Promise.all([
      productsApi.getAll(),
      productsApi.getLowStock(),
      movementsApi.getAll(),
      movementsApi.getSummary(),
    ]);

    return {
      totalProducts: products.length,
      lowStockProducts,
      recentMovements: recentMovements.slice(0, 5),
      movementsSummary,
    };
  },
};


export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: Date }> => {
    try {
      await api.get('/products', { params: { limit: 1 } });
      return {
        status: 'healthy',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
      };
    }
  },
};

export { api };

export type ApiClient = typeof api;
