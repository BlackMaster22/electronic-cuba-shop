// src/components/products/OrderHistory.tsx
'use client';

import { useUserOrders } from '@/hooks/useUserOrders';
import { OrderCard } from './OrderCard';
import { Order } from '@/types';

export function OrderHistory() {
    const { data: orders = [], isLoading, error } = useUserOrders();

    // Ordenar de más reciente a más antigua
    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Historial de compras</h2>
                <p className="text-gray-600 dark:text-gray-400">Cargando historial...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Historial de compras</h2>
                <p className="text-red-600 dark:text-red-400">Error al cargar el historial.</p>
            </div>
        );
    }

    if (sortedOrders.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Historial de compras</h2>
                <p className="text-gray-600 dark:text-gray-400">Aún no has realizado ninguna compra.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Historial de compras</h2>

            {/* Carrusel horizontal */}
            <div
                className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'x mandatory'
                }}
            >
                {sortedOrders.map((order) => (
                    <div
                        key={order.id}
                        className="scroll-snap-align-start"
                    >
                        <OrderCard order={order} />
                    </div>
                ))}
            </div>
        </div>
    );
}