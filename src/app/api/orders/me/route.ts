// src/app/api/orders/me/route.ts
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
        if (!payload) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', payload.id)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 });
        }

        return NextResponse.json(orders.map(order => ({
            id: order.id,
            customerId: order.customer_id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            shippingAddress: order.shipping_address,
            items: order.items,
            totalAmount: parseFloat(order.total_amount),
            requiresShipping: order.requires_shipping,
            shippingCost: parseFloat(order.shipping_cost),
            finalTotal: parseFloat(order.final_total),
            status: order.status,
            createdAt: order.created_at,
        })), { status: 200 });
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}