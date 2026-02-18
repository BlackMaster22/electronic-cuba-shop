// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, getAuthTokenFromRequest } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Acceso denegado. Solo administradores.' }, { status: 403 });
        }

        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
        }

        return NextResponse.json(users.map(user => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            ci: user.ci,
            phone: user.phone,
            email: user.email,
            address: {
                street: user.address_street,
                number: user.address_number,
                between: [user.address_between1, user.address_between2],
                neighborhood: user.address_neighborhood,
                municipality: user.address_municipality,
                province: user.address_province,
            },
            role: user.role,
        })), { status: 200 });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}