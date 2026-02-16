// src/hooks/useFinancialSummary.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface FinancialSummary {
    totalRevenue: number;
    totalOrders: number;
    ordersByStatus: {
        pendiente: number;
        preparado: number;
        enviado: number;
    };
    topProducts: Array<{
        name: string;
        quantity: number;
        revenue: number;
    }>;
    growth: number;
    period: string;
}

export function useFinancialSummary(period: string = 'all') {
    return useQuery({
        queryKey: ['financialSummary', period],
        queryFn: async () => {
            const response = await api.get<FinancialSummary>(`/financial/summary?period=${period}`);
            return response.data;
        },
    });
}