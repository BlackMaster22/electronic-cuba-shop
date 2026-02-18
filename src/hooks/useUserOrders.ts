// src/hooks/useUserOrders.ts
import { useQuery } from '@tanstack/react-query';
import { Order } from '@/types';

export function useUserOrders() {
    return useQuery<Order[]>({
        queryKey: ['userOrders'],
        queryFn: async () => {
            const res = await fetch('/api/orders/me', {
                credentials: 'include', // 👈 Envía cookies de autenticación
            });
            if (!res.ok) {
                // Si es 401, no lanzamos logout → solo error
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        },
        staleTime: 30 * 1000,
        retry: false, // Evita reintentos que causen múltiples 401
    });
}