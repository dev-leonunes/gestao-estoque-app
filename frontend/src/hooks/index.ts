export { useProducts } from './useProducts';
export { useMovements } from './useMovements';
export { useDashboard, useAppData } from './useDashboard';
import { useProducts } from './useProducts';
import { useMovements } from './useMovements';
import { useDashboard } from './useDashboard';

export const useApiData = () => {
    const products = useProducts();
    const movements = useMovements();
    const dashboard = useDashboard();

    const isLoading = products.isLoading || movements.isLoading || dashboard.isLoading;
    const isError = products.isError || movements.isError || dashboard.isError;
    const error = products.error || movements.error || dashboard.error;

    const isReady = !isLoading && !isError;

    return {
        products,
        movements,
        dashboard,
        isLoading,
        isError,
        error,
        isReady,
        refetchAll: () => {
            products.refetch();
            movements.refetch();
            dashboard.refetch();
        },
    };
};
