// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
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

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', payload.id)
            .single();

        if (error || !user) {
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
        console.error('Error al obtener perfil:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

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
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const { firstName, lastName, phone, address } = result.data;

        const { error } = await supabase
            .from('users')
            .update({
                first_name: firstName,
                last_name: lastName,
                phone,
                address_street: address.street,
                address_number: address.number,
                address_between1: address.between[0],
                address_between2: address.between[1],
                address_neighborhood: address.neighborhood,
                address_municipality: address.municipality,
                address_province: address.province,
            })
            .eq('id', payload.id);

        if (error) {
            return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
        }

        const { data: updatedUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', payload.id)
            .single();

        return NextResponse.json({
            id: updatedUser.id,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            ci: updatedUser.ci,
            phone: updatedUser.phone,
            email: updatedUser.email,
            address: {
                street: updatedUser.address_street,
                number: updatedUser.address_number,
                between: [updatedUser.address_between1, updatedUser.address_between2],
                neighborhood: updatedUser.address_neighborhood,
                municipality: updatedUser.address_municipality,
                province: updatedUser.address_province,
            },
            role: updatedUser.role,
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}