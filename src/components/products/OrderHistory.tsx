// src/components/products/OrderHistory.tsx
'use client';

import { Order } from '@/types';
import { useUserOrders } from '@/hooks/useUserOrders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function OrderHistory() {
    const { data: orders, isLoading, error } = useUserOrders();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Historial de compras</h2>
                <p className="text-gray-600 dark:text-gray-400">Cargando historial...</p>
            </div>
        );
    }

    if (error || !orders) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Historial de compras</h2>
                <p className="text-red-600 dark:text-red-400">Error al cargar el historial.</p>
            </div>
        );
    }

    if (orders.length === 0) {
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

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">Orden #{order.id.split('_')[1]}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === 'pendiente'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.status === 'preparado'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                {order.status === 'pendiente'
                                    ? 'Pendiente'
                                    : order.status === 'preparado'
                                        ? 'Preparado'
                                        : 'Enviado'}
                            </span>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            <p><strong>Productos:</strong></p>
                            <ul className="list-disc list-inside space-y-1 mt-1">
                                {order.items.slice(0, 2).map(item => (
                                    <li key={item.productId}>
                                        {item.quantity} x {item.productName}
                                    </li>
                                ))}
                                {order.items.length > 2 && (
                                    <li>+{order.items.length - 2} más</li>
                                )}
                            </ul>
                        </div>

                        <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                            <span>Total:</span>
                            <span>{order.finalTotal.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}