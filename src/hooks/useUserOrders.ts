// src/hooks/useUserOrders.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types'; // 👈 Importa el tipo

export function useUserOrders() {
    return useQuery<Order[]>({ // 👈 Tipa el resultado como Order[]
        queryKey: ['userOrders'],
        queryFn: async () => {
            const response = await api.get<Order[]>('/orders/me');
            return response.data;
        },
        staleTime: 30 * 1000,
    });
}