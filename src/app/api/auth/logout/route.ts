// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Crear una respuesta vacía
        const response = NextResponse.json(
            { message: 'Sesión cerrada correctamente' },
            { status: 200 }
        );

        // Limpiar cookies de autenticación
        return clearAuthCookies(response);
    } catch (error) {
        console.error('Error en logout:', error);
        return NextResponse.json(
            { error: 'Error al cerrar sesión' },
            { status: 500 }
        );
    }
}