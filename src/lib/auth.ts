// src/lib/auth.ts
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-for-dev-only'
);

const CSRF_SECRET = process.env.CSRF_SECRET || 'fallback-csrf-secret';
const TOKEN_DURATION = '7d';

export async function generateJwt(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_DURATION)
        .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
}

// 🔑 Nueva función: obtener nombre de cookie según entorno
function getAuthCookieName(): string {
    return process.env.NODE_ENV === 'production' ? '__Secure-auth-token' : 'auth-token';
}

export function setAuthCookies(
    response: NextResponse,
    jwtToken: string,
    csrfToken: string
): NextResponse {
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction;
    const domain = isProduction ? '.electroniccubashop.cu' : undefined;
    const authCookieName = getAuthCookieName();

    const jwtCookie = serialize(authCookieName, jwtToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        domain,
    });

    const csrfCookie = serialize('csrf-token', csrfToken, {
        httpOnly: false,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    // 👇 Corrección: usar append en lugar de set para múltiples cookies
    response.headers.append('Set-Cookie', jwtCookie);
    response.headers.append('Set-Cookie', csrfCookie);
    return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction;
    const authCookieName = getAuthCookieName();

    const jwtCookie = serialize(authCookieName, '', {
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

export function generateCsrfToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function verifyCsrfToken(request: NextRequest): boolean {
    const csrfCookie = request.cookies.get('csrf-token')?.value;
    const csrfHeader = request.headers.get('X-CSRF-Token');
    return !!csrfCookie && !!csrfHeader && csrfCookie === csrfHeader;
}

// 🔑 Nueva función: leer token de la cookie correcta
export function getAuthTokenFromRequest(request: NextRequest): string | undefined {
    const cookieName = getAuthCookieName();
    return request.cookies.get(cookieName)?.value;
}