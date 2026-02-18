// src/app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, getAuthTokenFromRequest } from '@/lib/auth';

const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/register',
];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 👇 Usa la función segura
    const token = getAuthTokenFromRequest(request);
    const isAuthenticated = !!token;
    let userRole = null;

    if (isAuthenticated) {
        const payload = await verifyJwt(token);
        if (payload) {
            userRole = payload.role as string;
        }
    }

    // Redirección desde la raíz según rol
    if (path === '/') {
        if (isAuthenticated && userRole) {
            if (userRole === 'cliente') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }
        // Si no está autenticado, permitir acceso a la página de inicio
        return NextResponse.next();
    }

    // Proteger rutas públicas de autenticación
    if (PUBLIC_ROUTES.some(route =>
        path === route || path.startsWith(`${route}/`)
    )) {
        if (isAuthenticated) {
            // Redirigir desde login/register si ya está autenticado
            if (userRole === 'cliente') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }
        return NextResponse.next();
    }

    // Proteger rutas protegidas
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verificar roles para rutas administrativas
    if (path.startsWith('/admin')) {
        if (userRole !== 'admin' && userRole !== 'vendedor') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Dashboard solo para clientes
    if (path.startsWith('/dashboard')) {
        if (userRole !== 'cliente') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};