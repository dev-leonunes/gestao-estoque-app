import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { queryKeys } from '../lib/react-query';

export const useDashboard = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.overview(),
        queryFn: () => dashboardApi.getOverview(),
        staleTime: 30 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
};

export const useAppData = () => {
    const dashboard = useDashboard();

    return {
        dashboard,
        health: { data: { status: 'healthy' }, isLoading: false, isError: false, error: null },
        isLoading: dashboard.isLoading,
        isError: dashboard.isError,
        error: dashboard.error,
    };
};
