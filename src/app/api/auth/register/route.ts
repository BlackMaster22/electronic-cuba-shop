// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/user.schema';
import { hashPassword } from '@/lib/auth';
import { generateJwt, generateCsrfToken, setAuthCookies } from '@/lib/auth';
import { UserWithPasswordHash } from '@/types';
import { usersInMemory } from '@/lib/mock/data';

function isEmailOrCiTaken(email: string, ci: string): boolean {
    return usersInMemory.some(user => user.email === email || user.ci === ci);
}

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

        if (isEmailOrCiTaken(email, ci)) {
            return NextResponse.json(
                { error: 'El correo electrónico o carnet de identidad ya están registrados' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const newUser: UserWithPasswordHash = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            firstName,
            lastName,
            ci,
            phone,
            email,
            address,
            role: 'cliente',
            passwordHash: hashedPassword,
        };

        usersInMemory.push(newUser);

        const jwtToken = await generateJwt({ id: newUser.id, role: newUser.role });
        const csrfToken = generateCsrfToken();

        const response = NextResponse.json(
            {
                message: 'Registro exitoso',
                user: {
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    ci: newUser.ci,
                    phone: newUser.phone,
                    email: newUser.email,
                    address: newUser.address,
                    role: newUser.role,
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