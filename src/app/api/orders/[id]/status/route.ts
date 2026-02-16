// src/app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !['admin', 'vendedor'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!['pendiente', 'preparado', 'enviado'].includes(status)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
        }

        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 });
        }

        const { data: updatedOrder } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        return NextResponse.json({
            id: updatedOrder.id,
            customerId: updatedOrder.customer_id,
            customerName: updatedOrder.customer_name,
            customerEmail: updatedOrder.customer_email,
            shippingAddress: updatedOrder.shipping_address,
            items: updatedOrder.items,
            totalAmount: parseFloat(updatedOrder.total_amount),
            requiresShipping: updatedOrder.requires_shipping,
            shippingCost: parseFloat(updatedOrder.shipping_cost),
            finalTotal: parseFloat(updatedOrder.final_total),
            status: updatedOrder.status,
            createdAt: updatedOrder.created_at,
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}