// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/user.schema';
import { comparePasswords } from '@/lib/auth';
import { generateJwt, generateCsrfToken, setAuthCookies } from '@/lib/auth';
import { User, UserWithPasswordHash } from '@/types';
import { usersInMemory } from '@/lib/mock/data';

function findUserByEmail(email: string): UserWithPasswordHash | undefined {
    return usersInMemory.find(user => user.email === email);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const { email, password } = result.data;

        const user = findUserByEmail(email);
        if (!user) {
            await comparePasswords(password, '$2a$12$dummyhash');
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePasswords(password, user.passwordHash);
        if (!isPasswordValid) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const jwtToken = await generateJwt({ id: user.id, role: user.role });
        const csrfToken = generateCsrfToken();

        const response = NextResponse.json(
            {
                message: 'Inicio de sesión exitoso',
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    ci: user.ci,
                    phone: user.phone,
                    email: user.email,
                    address: user.address,
                    role: user.role,
                }
            },
            { status: 200 }
        );

        return setAuthCookies(response, jwtToken, csrfToken);
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}