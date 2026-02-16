// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { usersInMemory } from '@/lib/mock/data';
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

        // Devolver usuarios sin hash de contraseña
        const safeUsers = usersInMemory.map(({ passwordHash, ...user }) => user);

        return NextResponse.json(safeUsers, { status: 200 });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}