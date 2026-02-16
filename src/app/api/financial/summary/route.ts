// src/app/api/financial/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'all';

        let dateFilter = '';
        if (period === 'week') {
            dateFilter = 'created_at >= now() - interval \'7 days\'';
        } else if (period === 'month') {
            dateFilter = 'created_at >= now() - interval \'1 month\'';
        }

        // Total revenue y órdenes
        let query = supabase.from('orders').select('final_total, status, items');
        if (dateFilter) {
            query = query.filter('created_at', 'gte', new Date(Date.now() - (period === 'week' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString());
        }

        const { data: orders, error } = await query;

        if (error) {
            return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 });
        }

        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.final_total), 0);
        const totalOrders = orders.length;

        const ordersByStatus = {
            pendiente: orders.filter(o => o.status === 'pendiente').length,
            preparado: orders.filter(o => o.status === 'preparado').length,
            enviado: orders.filter(o => o.status === 'enviado').length,
        };

        // Productos más vendidos
        const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
        orders.forEach(order => {
            order.items.forEach((item: any) => {
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

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            ordersByStatus,
            topProducts,
            growth: 0,
            period,
        }, { status: 200 });
    } catch (error) {
        console.error('Error al obtener resumen financiero:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}