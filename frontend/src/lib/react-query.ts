import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any> = {}) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    lowStock: () => [...queryKeys.products.all, 'lowStock'] as const,
  },

  movements: {
    all: ['movements'] as const,
    lists: () => [...queryKeys.movements.all, 'list'] as const,
    list: (filters: Record<string, any> = {}) =>
      [...queryKeys.movements.lists(), filters] as const,
    details: () => [...queryKeys.movements.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.movements.details(), id] as const,
    summary: (filters: Record<string, any> = {}) =>
      [...queryKeys.movements.all, 'summary', filters] as const,
    byProduct: (productId: string) =>
      [...queryKeys.movements.all, 'byProduct', productId] as const,
  },

  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
  },

  health: {
    all: ['health'] as const,
    check: () => [...queryKeys.health.all, 'check'] as const,
  },
} as const;
