// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types';

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await api.get<Order[]>('/orders');
            return response.data;
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            const response = await api.put(`/orders/${orderId}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}