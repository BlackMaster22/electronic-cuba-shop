// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/user.schema';
import { verifyPassword } from '@/lib/auth';
import { generateJwt, generateCsrfToken, setAuthCookies } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Buscar usuario en Supabase
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !users) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, users.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        const jwtToken = await generateJwt({ id: users.id, role: users.role });
        const csrfToken = generateCsrfToken();

        const response = NextResponse.json(
            {
                message: 'Inicio de sesión exitoso',
                user: {
                    id: users.id,
                    firstName: users.first_name,
                    lastName: users.last_name,
                    ci: users.ci,
                    phone: users.phone,
                    email: users.email,
                    address: {
                        street: users.address_street,
                        number: users.address_number,
                        between: [users.address_between1, users.address_between2],
                        neighborhood: users.address_neighborhood,
                        municipality: users.address_municipality,
                        province: users.address_province,
                    },
                    role: users.role,
                }
            },
            { status: 200 }
        );

        return setAuthCookies(response, jwtToken, csrfToken);
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}