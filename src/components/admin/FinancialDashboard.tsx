// src/components/admin/FinancialDashboard.tsx
'use client';

import { useState } from 'react';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, TrendingUp, Package, Truck, Clock, CheckCircle } from 'lucide-react';

interface FinancialDashboardProps {
    period: string;
    onPeriodChange: (period: string) => void;
}

export function FinancialDashboard({ period, onPeriodChange }: FinancialDashboardProps) {
    const { data: summary, isLoading, error } = useFinancialSummary(period);

    if (isLoading) {
        return <div>Cargando resumen financiero...</div>;
    }

    if (error || !summary) {
        return <div>Error al cargar el resumen financiero.</div>;
    }

    const { totalRevenue, totalOrders, ordersByStatus, topProducts } = summary;

    return (
        <div className="space-y-6">
            {/* Selector de período */}
            <div className="flex flex-wrap gap-2">
                {[
                    { value: 'all', label: 'Todo el tiempo' },
                    { value: 'month', label: 'Último mes' },
                    { value: 'week', label: 'Última semana' },
                ].map(option => (
                    <button
                        key={option.value}
                        onClick={() => onPeriodChange(option.value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${period === option.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Ingresos Totales"
                    value={totalRevenue.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                    icon={BarChart3}
                    color="text-green-600 dark:text-green-400"
                />
                <MetricCard
                    title="Órdenes Totales"
                    value={totalOrders.toString()}
                    icon={Package}
                    color="text-blue-600 dark:text-blue-400"
                />
                <MetricCard
                    title="Órdenes Enviadas"
                    value={ordersByStatus.enviado.toString()}
                    icon={Truck}
                    color="text-purple-600 dark:text-purple-400"
                />
                <MetricCard
                    title="Órdenes Pendientes"
                    value={ordersByStatus.pendiente.toString()}
                    icon={Clock}
                    color="text-yellow-600 dark:text-yellow-400"
                />
            </div>

            {/* Productos más vendidos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Productos más vendidos</h3>
                <div className="space-y-3">
                    {topProducts.length > 0 ? (
                        topProducts.map((product, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-900 dark:text-white">{product.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {product.revenue.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {product.quantity} vendido{product.quantity !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles.</p>
                    )}
                </div>
            </div>

            {/* Distribución de órdenes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribución de órdenes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatusCard
                        status="pendiente"
                        count={ordersByStatus.pendiente}
                        icon={Clock}
                        color="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    />
                    <StatusCard
                        status="preparado"
                        count={ordersByStatus.preparado}
                        icon={CheckCircle}
                        color="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    />
                    <StatusCard
                        status="enviado"
                        count={ordersByStatus.enviado}
                        icon={Truck}
                        color="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    />
                </div>
            </div>
        </div>
    );
}

// Componente auxiliar para métricas
function MetricCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                </div>
                <Icon className={`h-8 w-8 ${color}`} />
            </div>
        </div>
    );
}

// Componente auxiliar para estados
function StatusCard({ status, count, icon: Icon, color }: { status: string; count: number; icon: any; color: string }) {
    const statusLabels: Record<string, string> = {
        pendiente: 'Pendientes',
        preparado: 'Preparadas',
        enviado: 'Enviadas',
    };

    return (
        <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400 mb-2" />
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${color} mb-2`}>
                {statusLabels[status]}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
        </div>
    );
}