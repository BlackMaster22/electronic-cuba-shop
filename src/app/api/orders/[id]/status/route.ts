// src/app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ordersInMemory } from '@/lib/mock/data';
import { verifyJwt } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const { id } = params;
        const body = await request.json();
        const { status } = body;

        if (!['pendiente', 'preparado', 'enviado'].includes(status)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
        }

        const index = ordersInMemory.findIndex(o => o.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // Actualizar estado
        ordersInMemory[index] = {
            ...ordersInMemory[index],
            status,
        };

        return NextResponse.json(ordersInMemory[index], { status: 200 });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}