import { useQuery } from '@tanstack/react-query';
import { dashboardApi, healthApi } from '../services/api';
import { queryKeys } from '../lib/react-query';

export const useDashboard = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.overview(),
        queryFn: () => dashboardApi.getOverview(),
        staleTime: 30 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
};

export const useHealthCheck = () => {
    return useQuery({
        queryKey: queryKeys.health.check(),
        queryFn: () => healthApi.check(),
        staleTime: 10 * 1000,
        refetchInterval: 30 * 1000,
        retry: false,
    });
};

export const useAppData = () => {
    const dashboard = useDashboard();
    const health = useHealthCheck();

    return {
        dashboard,
        health,
        isLoading: dashboard.isLoading || health.isLoading,
        isError: dashboard.isError || health.isError,
        error: dashboard.error || health.error,
        isHealthy: health.data?.status === 'healthy',
    };
};
