import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import { queryKeys } from '../lib/react-query';
import type {
    CreateProductDto,
    UpdateProductDto,
    ProductFilters
} from '../types/api';

export const useProducts = (filters?: ProductFilters) => {
    return useQuery({
        queryKey: queryKeys.products.list(filters || {}),
        queryFn: () => productsApi.getAll(filters),
        staleTime: 2 * 60 * 1000,
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: queryKeys.products.detail(id),
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useLowStockProducts = () => {
    return useQuery({
        queryKey: queryKeys.products.lowStock(),
        queryFn: () => productsApi.getLowStock(),
        staleTime: 30 * 1000,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData: CreateProductDto) => productsApi.create(productData),
        onSuccess: (newProduct) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
            queryClient.setQueryData(queryKeys.products.detail(newProduct.id), newProduct);
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock() });
        },
        onError: (error) => {
            console.error('Erro ao criar produto:', error);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
            productsApi.update(id, data),
        onSuccess: (updatedProduct, { id }) => {
            queryClient.setQueryData(queryKeys.products.detail(id), updatedProduct);
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock() });
        },
        onError: (error) => {
            console.error('Erro ao atualizar produto:', error);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => productsApi.delete(id),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: queryKeys.products.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock() });
        },
        onError: (error) => {
            console.error('Erro ao deletar produto:', error);
        },
    });
};

export const useProductOperations = () => {
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        isLoading: createProduct.isPending || updateProduct.isPending || deleteProduct.isPending,
        isError: createProduct.isError || updateProduct.isError || deleteProduct.isError,
        error: createProduct.error || updateProduct.error || deleteProduct.error,
    };
};