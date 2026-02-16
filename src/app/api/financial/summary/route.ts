// src/app/api/financial/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ordersInMemory } from '@/lib/mock/data';
import { verifyJwt } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Acceso denegado. Solo administradores.' }, { status: 403 });
        }

        // Obtener parámetros de query (opcional)
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'all'; // all, week, month

        // Filtrar órdenes por período (simplificado)
        let filteredOrders = [...ordersInMemory];
        if (period === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filteredOrders = ordersInMemory.filter(order =>
                new Date(order.createdAt) >= oneWeekAgo
            );
        } else if (period === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filteredOrders = ordersInMemory.filter(order =>
                new Date(order.createdAt) >= oneMonthAgo
            );
        }

        // Calcular métricas
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.finalTotal, 0);
        const totalOrders = filteredOrders.length;

        // Órdenes por estado
        const ordersByStatus = {
            pendiente: filteredOrders.filter(o => o.status === 'pendiente').length,
            preparado: filteredOrders.filter(o => o.status === 'preparado').length,
            enviado: filteredOrders.filter(o => o.status === 'enviado').length,
        };

        // Productos más vendidos (simplificado)
        const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                if (productSales.has(item.productId)) {
                    const existing = productSales.get(item.productId)!;
                    productSales.set(item.productId, {
                        name: item.productName,
                        quantity: existing.quantity + item.quantity,
                        revenue: existing.revenue + item.totalPrice,
                    });
                } else {
                    productSales.set(item.productId, {
                        name: item.productName,
                        quantity: item.quantity,
                        revenue: item.totalPrice,
                    });
                }
            });
        });

        const topProducts = Array.from(productSales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Crecimiento (comparación con período anterior - simplificado)
        const growth = 0; // En implementación real, calcularías esto

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            ordersByStatus,
            topProducts,
            growth,
            period,
        }, { status: 200 });
    } catch (error) {
        console.error('Error al obtener resumen financiero:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}