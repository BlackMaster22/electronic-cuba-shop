// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/user.schema';
import { generateJwt, generateCsrfToken, setAuthCookies } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const {
            firstName,
            lastName,
            ci,
            phone,
            email,
            password,
            address,
        } = result.data;

        // Verificar si email o CI ya existen (consulta a Supabase)
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .or(`email.eq.${email},ci.eq.${ci}`);

        if (checkError) {
            console.error('Error checking existing user:', checkError);
            return NextResponse.json(
                { error: 'Error al verificar usuario' },
                { status: 500 }
            );
        }

        if (existingUsers && existingUsers.length > 0) {
            return NextResponse.json(
                { error: 'El correo electrónico o carnet de identidad ya están registrados' },
                { status: 409 }
            );
        }

        const hashedPassword = password;
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Insertar en Supabase
        const { error: insertError } = await supabase
            .from('users')
            .insert([{
                id: userId,
                first_name: firstName,
                last_name: lastName,
                ci,
                phone,
                email,
                password_hash: hashedPassword,
                address_street: address.street,
                address_number: address.number,
                address_between1: address.between[0],
                address_between2: address.between[1],
                address_neighborhood: address.neighborhood,
                address_municipality: address.municipality,
                address_province: address.province,
                role: 'cliente',
            }]);

        if (insertError) {
            console.error('Error inserting user:', insertError);
            return NextResponse.json(
                { error: 'Error al crear usuario' },
                { status: 500 }
            );
        }

        // Generar tokens
        const jwtToken = await generateJwt({ id: userId, role: 'cliente' });
        const csrfToken = generateCsrfToken();

        const response = NextResponse.json(
            {
                message: 'Registro exitoso',
                user: {
                    id: userId,
                    firstName,
                    lastName,
                    ci,
                    phone,
                    email,
                    address,
                    role: 'cliente',
                }
            },
            { status: 201 }
        );

        return setAuthCookies(response, jwtToken, csrfToken);
    } catch (error) {
        console.error('Error en registro:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}