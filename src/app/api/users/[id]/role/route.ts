// src/app/api/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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

        // Actualizar rol en Supabase
        const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Obtener usuario actualizado
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', params.id)
            .single();

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({
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
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}