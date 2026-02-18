// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const errorText = await res.text(); // 👈 Obtén el cuerpo del error
        console.error('❌ Error en API:', url, res.status, errorText);
        throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
};

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => fetchWithAuth('/api/products'),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData: any) =>
            fetchWithAuth('/api/products', {
                method: 'POST',
                body: JSON.stringify(productData),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            fetchWithAuth(`/api/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            fetchWithAuth(`/api/products/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}