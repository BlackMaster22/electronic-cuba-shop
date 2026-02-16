// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { usersInMemory } from '@/lib/mock/data';
import { verifyJwt } from '@/lib/auth';
import { profileUpdateSchema } from '@/lib/validation/user.schema';

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

        const user = usersInMemory.find(u => u.id === payload.id);
        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Devolver solo datos no sensibles
        const { passwordHash, ...safeUser } = user;

        return NextResponse.json(safeUser, { status: 200 });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// ... después de GET

export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const body = await request.json();
        const result = profileUpdateSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const index = usersInMemory.findIndex(u => u.id === payload.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Actualizar solo campos permitidos
        usersInMemory[index] = {
            ...usersInMemory[index],
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            phone: result.data.phone,
            address: result.data.address,
        };

        const { passwordHash, ...safeUser } = usersInMemory[index];
        return NextResponse.json(safeUser, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}