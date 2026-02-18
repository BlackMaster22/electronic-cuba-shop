// src/lib/auth.ts
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';

// 🔑 Secretos desde variables de entorno
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-for-dev-only'
);
const CSRF_SECRET = process.env.CSRF_SECRET || 'fallback-csrf-secret';

const TOKEN_DURATION = '7d';

// 🪪 Generar JWT
export async function generateJwt(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_DURATION)
        .sign(JWT_SECRET);
}

// 🔍 Verificar JWT
export async function verifyJwt(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

// 🔒 Hashear contraseña
export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

// ✅ Verificar contraseña
export async function verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
}

// 🍪 Nombre fijo de la cookie (sin __Secure-)
const AUTH_COOKIE_NAME = 'auth-token';

// 🧾 Establecer cookies de autenticación
export function setAuthCookies(
    response: NextResponse,
    jwtToken: string,
    csrfToken: string
): NextResponse {
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction; // true en Vercel (HTTPS obligatorio)

    // ⚠️ No usar `domain` en Vercel a menos que tengas un dominio personalizado
    const jwtCookie = serialize(AUTH_COOKIE_NAME, jwtToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        // domain: undefined → se hereda del host actual (vercel.app o localhost)
    });

    const csrfCookie = serialize('csrf-token', csrfToken, {
        httpOnly: false,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    response.headers.append('Set-Cookie', jwtCookie);
    response.headers.append('Set-Cookie', csrfCookie);
    return response;
}

// 🧹 Limpiar cookies
export function clearAuthCookies(response: NextResponse): NextResponse {
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction;

    const jwtCookie = serialize(AUTH_COOKIE_NAME, '', {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    const csrfCookie = serialize('csrf-token', '', {
        httpOnly: false,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    response.headers.append('Set-Cookie', jwtCookie);
    response.headers.append('Set-Cookie', csrfCookie);
    return response;
}

// 🎲 Generar token CSRF
export function generateCsrfToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// 🔐 Verificar token CSRF
export function verifyCsrfToken(request: NextRequest): boolean {
    const csrfCookie = request.cookies.get('csrf-token')?.value;
    const csrfHeader = request.headers.get('X-CSRF-Token');
    return !!csrfCookie && !!csrfHeader && csrfCookie === csrfHeader;
}

// 📥 Obtener token de autenticación desde la cookie correcta
export function getAuthTokenFromRequest(request: NextRequest): string | undefined {
    return request.cookies.get(AUTH_COOKIE_NAME)?.value;
}