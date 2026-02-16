// src/app/api/orders/me/route.ts
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
        if (!payload) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        // Filtrar órdenes del usuario actual
        const userOrders = ordersInMemory
            .filter(order => order.customerId === payload.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(userOrders, { status: 200 });
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}