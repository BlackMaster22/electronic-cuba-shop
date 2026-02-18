// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, getAuthTokenFromRequest } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { createOrderSchema } from '@/lib/validation/order.schema';

export async function POST(request: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const body = await request.json();
        const result = createOrderSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Datos de orden inválidos' }, { status: 400 });
        }

        const { items, totalAmount, requiresShipping, shippingCost, finalTotal, shippingAddress } = result.data;

        // 🔒 Verificar stock disponible para todos los productos
        for (const item of items) {
            const { data: product } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.productId)
                .single();

            if (!product || product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Stock insuficiente para "${item.productName}"` },
                    { status: 400 }
                );
            }
        }

        // 👤 Obtener datos del usuario
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('first_name, last_name, email')
            .eq('id', payload.id)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // 📦 Crear la orden
        const newOrder = {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            customer_id: payload.id,
            customer_name: `${user.first_name} ${user.last_name}`,
            customer_email: user.email,
            shipping_address: shippingAddress,
            items,
            total_amount: totalAmount,
            requires_shipping: requiresShipping,
            shipping_cost: shippingCost,
            final_total: finalTotal,
            status: 'pendiente',
        };

        const { error: orderError } = await supabase
            .from('orders')
            .insert([newOrder]);

        if (orderError) {
            return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 });
        }

        // ✅ Reducir stock de cada producto
        for (const item of items) {
            const { data: product } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.productId)
                .single();

            if (product && product.stock >= item.quantity) {
                await supabase
                    .from('products')
                    .update({ stock: product.stock - item.quantity })
                    .eq('id', item.productId);
            }
        }

        return NextResponse.json({ message: 'Orden creada exitosamente', orderId: newOrder.id }, { status: 201 });
    } catch (error) {
        console.error('Error al crear orden:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !['admin', 'vendedor'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 });
        }

        return NextResponse.json(orders.map(o => ({
            id: o.id,
            customerId: o.customer_id,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            shippingAddress: o.shipping_address,
            items: o.items,
            totalAmount: parseFloat(o.total_amount),
            requiresShipping: o.requires_shipping,
            shippingCost: parseFloat(o.shipping_cost),
            finalTotal: parseFloat(o.final_total),
            status: o.status,
            createdAt: o.created_at,
        })), { status: 200 });
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}