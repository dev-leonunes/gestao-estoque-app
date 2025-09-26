export { useProducts } from './useProducts';
export { useMovements } from './useMovements';
export { useDashboard, useHealthCheck, useAppData } from './useDashboard';
import { useProducts } from './useProducts';
import { useMovements } from './useMovements';
import { useDashboard, useHealthCheck } from './useDashboard';

export const useApiData = () => {
    const products = useProducts();
    const movements = useMovements();
    const dashboard = useDashboard();
    const health = useHealthCheck();

    const isLoading = products.isLoading || movements.isLoading || dashboard.isLoading;
    const isError = products.isError || movements.isError || dashboard.isError;
    const error = products.error || movements.error || dashboard.error;

    const isHealthy = health.data?.status === 'healthy';
    const isReady = !isLoading && !isError && isHealthy;

    return {
        products,
        movements,
        dashboard,
        health,
        isLoading,
        isError,
        error,
        isHealthy,
        isReady,
        refetchAll: () => {
            products.refetch();
            movements.refetch();
            dashboard.refetch();
            health.refetch();
        },
    };
};
