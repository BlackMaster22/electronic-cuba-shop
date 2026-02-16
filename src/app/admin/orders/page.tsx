// src/app/admin/orders/page.tsx
'use client';

import { OrderStatus } from '@/types';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { OrderList } from '@/components/admin/OrderList';

export default function OrdersPage() {
    const { data: orders = [], isLoading, error } = useOrders();
    const { mutate: updateOrderStatus } = useUpdateOrderStatus();

    const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
        updateOrderStatus({ orderId, status });
    };

    if (isLoading) {
        return <div>Cargando órdenes...</div>;
    }

    if (error) {
        return <div>Error al cargar órdenes.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Ventas</h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
                Gestiona el estado de las órdenes de tus clientes.
            </p>

            <OrderList orders={orders} onUpdateStatus={handleUpdateStatus} />
        </div>
    );
}