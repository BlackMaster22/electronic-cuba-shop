// src/components/products/OrderCard.tsx
'use client';

import { Order } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const getStatusColor = () => {
        switch (order.status) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'preparado':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const getStatusText = () => {
        switch (order.status) {
            case 'pendiente':
                return 'Pendiente';
            case 'preparado':
                return 'Preparado';
            default:
                return 'Enviado';
        }
    };

    return (
        <div className="flex-shrink-0 w-[360px] bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-gray-900 dark:text-white">
                    Orden #{order.id.split('_')[1]}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                </span>
            </div>

            <div className="mb-3">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
                    {getStatusText()}
                </span>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                <p className="font-medium mb-1">Productos:</p>
                <ul className="list-disc list-inside space-y-1">
                    {order.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="truncate">
                            {item.quantity} x {item.productName}
                        </li>
                    ))}
                    {order.items.length > 3 && (
                        <li className="text-gray-500">+{order.items.length - 3} más</li>
                    )}
                </ul>
            </div>

            <div className="flex justify-between font-bold text-gray-900 dark:text-white mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>Total:</span>
                <span>{order.finalTotal.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}</span>
            </div>
        </div>
    );
}