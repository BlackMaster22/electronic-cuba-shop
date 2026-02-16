// src/app/api/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { usersInMemory } from '@/lib/mock/data';
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
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Acceso denegado. Solo administradores.' }, { status: 403 });
        }

        // Evitar que un admin se quite su propio rol
        if (params.id === payload.id) {
            return NextResponse.json({ error: 'No puedes modificar tu propio rol' }, { status: 400 });
        }

        const body = await request.json();
        const { role } = body;

        if (!['cliente', 'vendedor', 'admin'].includes(role)) {
            return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
        }

        const index = usersInMemory.findIndex(u => u.id === params.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Actualizar rol
        usersInMemory[index] = {
            ...usersInMemory[index],
            role,
        };

        const { passwordHash, ...safeUser } = usersInMemory[index];
        return NextResponse.json(safeUser, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}