import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { movementsApi } from '../services/api';
import { queryKeys } from '../lib/react-query';
import type {
    CreateMovementDto,
    UpdateMovementDto,
    MovementFilters,
    MovementType
} from '../types/api';

export const useMovements = (filters?: MovementFilters) => {
    return useQuery({
        queryKey: queryKeys.movements.list(filters || {}),
        queryFn: () => movementsApi.getAll(filters),
        staleTime: 1 * 60 * 1000,
    });
};

export const useMovement = (id: string) => {
    return useQuery({
        queryKey: queryKeys.movements.detail(id),
        queryFn: () => movementsApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useMovementsByProduct = (productId: string) => {
    return useQuery({
        queryKey: queryKeys.movements.byProduct(productId),
        queryFn: () => movementsApi.getByProduct(productId),
        enabled: !!productId,
        staleTime: 2 * 60 * 1000,
    });
};

export const useMovementsByType = (type: MovementType) => {
    return useQuery({
        queryKey: queryKeys.movements.list({ type }),
        queryFn: () => movementsApi.getByType(type),
        staleTime: 2 * 60 * 1000,
    });
};

export const useMovementsSummary = (filters?: {
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: queryKeys.movements.summary(filters || {}),
        queryFn: () => movementsApi.getSummary(filters),
        staleTime: 30 * 1000,
    });
};

export const useCreateMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (movementData: CreateMovementDto) => movementsApi.create(movementData),
        onSuccess: (newMovement) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.movements.lists() });
            queryClient.setQueryData(queryKeys.movements.detail(newMovement.id), newMovement);
            queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
            if (newMovement.productId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.products.detail(newMovement.productId)
                });
                queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
                queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock() });
            }
        },
        onError: (error) => {
            console.error('Erro ao criar movimentação:', error);
        },
    });
};

export const useUpdateMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMovementDto }) =>
            movementsApi.update(id, data),
        onSuccess: (updatedMovement, { id }) => {
            queryClient.setQueryData(queryKeys.movements.detail(id), updatedMovement);
            queryClient.invalidateQueries({ queryKey: queryKeys.movements.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
        },
        onError: (error) => {
            console.error('Erro ao atualizar movimentação:', error);
        },
    });
};

export const useDeleteMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => movementsApi.delete(id),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: queryKeys.movements.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.movements.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock() });
        },
        onError: (error) => {
            console.error('Erro ao deletar movimentação:', error);
        },
    });
};

export const useMovementOperations = () => {
    const createMovement = useCreateMovement();
    const updateMovement = useUpdateMovement();
    const deleteMovement = useDeleteMovement();

    return {
        createMovement,
        updateMovement,
        deleteMovement,
        isLoading: createMovement.isPending || updateMovement.isPending || deleteMovement.isPending,
        isError: createMovement.isError || updateMovement.isError || deleteMovement.isError,
        error: createMovement.error || updateMovement.error || deleteMovement.error,
    };
};
