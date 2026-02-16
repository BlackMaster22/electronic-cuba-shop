// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOrderSchema } from '@/lib/validation/order.schema';
import { ordersInMemory } from '@/lib/mock/data';
import { verifyJwt } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // 1. Verificar autenticación
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        // 2. Parsear cuerpo
        const body = await request.json();

        // 3. Validar con Zod
        const result = createOrderSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos de orden inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { items, totalAmount, requiresShipping, shippingCost, finalTotal, shippingAddress } = result.data;

        // 4. Crear nueva orden
        const newOrder = {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            customerId: payload.id as string,
            customerName: 'Nombre temporal', // En producción, se obtiene del usuario
            customerEmail: 'email@temporal.cu',
            items,
            totalAmount,
            requiresShipping,
            shippingCost,
            finalTotal,
            status: 'pendiente' as const,
            shippingAddress,
            createdAt: new Date().toISOString(),
        };

        // 5. Guardar en "base de datos"
        ordersInMemory.push(newOrder);

        // 6. Responder
        return NextResponse.json(
            { message: 'Orden creada exitosamente', orderId: newOrder.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al crear orden:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !['admin', 'vendedor'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        // Devolver todas las órdenes (ordenadas por fecha descendente)
        const allOrders = [...ordersInMemory].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(allOrders, { status: 200 });
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}