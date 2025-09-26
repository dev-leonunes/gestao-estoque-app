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
} from '../types/api';

const RAW_BASE_URL: string = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
const NORMALIZED_BASE_URL = (() => {
  const trimmed = RAW_BASE_URL.replace(/\/$/, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }
  return `${trimmed}/api`;
})();

const api = axios.create({
  baseURL: NORMALIZED_BASE_URL,
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
  getAll: async (_filters?: ProductFilters): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await api.get('/products');
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
  getAll: async (_filters?: MovementFilters): Promise<Movement[]> => {
    const response: AxiosResponse<Movement[]> = await api.get('/movements');
    return response.data;
  },

  getById: async (id: string): Promise<Movement> => {
    const response: AxiosResponse<Movement> = await api.get(`/movements/${id}`);
    return response.data;
  },

  getSummary: async (): Promise<MovementsSummary> => {
    const response: AxiosResponse<MovementsSummary> = await api.get('/movements/summary');
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
  check: async (): Promise<{ status: 'healthy' | 'unhealthy'; timestamp: string }> => {
    try {
      await api.get('/health');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export { api };
