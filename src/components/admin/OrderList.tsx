// src/components/admin/OrderList.tsx
'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '../ui/Button';
import { Search, Package, MapPin, CreditCard } from 'lucide-react';

interface OrderListProps {
    orders: Order[];
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusLabels: Record<OrderStatus, string> = {
    pendiente: 'Pendiente',
    preparado: 'Preparado',
    enviado: 'Enviado',
};

const statusColors: Record<OrderStatus, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    preparado: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    enviado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function OrderList({ orders, onUpdateStatus }: OrderListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Filtros */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, email o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="preparado">Preparado</option>
                        <option value="enviado">Enviado</option>
                    </select>
                </div>
            </div>

            {/* Lista de órdenes */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map(order => (
                    <div key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            {/* Información principal */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <span className="font-medium">Orden #{order.id.split('_')[1]}</span>
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                        {statusLabels[order.status]}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        <span>{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        <span>{order.customerEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{order.shippingAddress.municipality}, {order.shippingAddress.province}</span>
                                    </div>
                                </div>

                                {/* Productos */}
                                <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Productos:</p>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        {order.items.slice(0, 2).map(item => (
                                            <li key={item.productId}>
                                                {item.quantity} x {item.productName} — {item.totalPrice.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                                            </li>
                                        ))}
                                        {order.items.length > 2 && (
                                            <li>+{order.items.length - 2} más</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* Acciones y total */}
                            <div className="flex flex-col items-end gap-3">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {order.finalTotal.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                                    </p>
                                    {order.requiresShipping && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            + envío
                                        </p>
                                    )}
                                </div>

                                {/* Botones de estado */}
                                <div className="flex flex-wrap gap-2">
                                    {order.status === 'pendiente' && (
                                        <Button
                                            size="sm"
                                            onClick={() => onUpdateStatus(order.id, 'preparado')}
                                        >
                                            Marcar como preparado
                                        </Button>
                                    )}
                                    {order.status === 'preparado' && (
                                        <Button
                                            size="sm"
                                            onClick={() => onUpdateStatus(order.id, 'enviado')}
                                        >
                                            Marcar como enviado
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron órdenes.
                </div>
            )}
        </div>
    );
}