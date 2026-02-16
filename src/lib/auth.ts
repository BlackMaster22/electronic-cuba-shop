// src/lib/auth.ts
import { serialize, parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';

// Clave secreta para JWT (¡debe estar en variables de entorno!)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-for-dev-only'
);

const CSRF_SECRET = process.env.CSRF_SECRET || 'fallback-csrf-secret';

// Duración del token (7 días)
const TOKEN_DURATION = '7d';

/**
 * Genera un token JWT firmado
 */
export async function generateJwt(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_DURATION)
        .sign(JWT_SECRET);
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifyJwt(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

/**
 * Hashea una contraseña
 */
export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12); // 12 rounds
}

/**
 * Compara una contraseña con su hash
 */
export async function verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
}

/**
 * Establece cookies de autenticación seguras
 */
export function setAuthCookies(
    response: NextResponse,
    jwtToken: string,
    csrfToken: string
): NextResponse {
    // Cookie HTTP-only para el JWT (inaccesible desde JS)
    const jwtCookie = serialize('__Secure-auth-token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        domain: process.env.NODE_ENV === 'production' ? '.electroniccubashop.cu' : undefined,
    });

    // Cookie accesible desde JS para el CSRF token
    const csrfCookie = serialize('csrf-token', csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    response.headers.set('Set-Cookie', `${jwtCookie}, ${csrfCookie}`);
    return response;
}

/**
 * Limpia las cookies de autenticación
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
    const jwtCookie = serialize('__Secure-auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    const csrfCookie = serialize('csrf-token', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    response.headers.set('Set-Cookie', `${jwtCookie}, ${csrfCookie}`);
    return response;
}

/**
 * Genera un token CSRF aleatorio
 */
export function generateCsrfToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Verifica el token CSRF en una solicitud
 */
export function verifyCsrfToken(request: NextRequest): boolean {
    const csrfCookie = request.cookies.get('csrf-token')?.value;
    const csrfHeader = request.headers.get('X-CSRF-Token');

    return !!csrfCookie && !!csrfHeader && csrfCookie === csrfHeader;
}