// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockCategories } from '@/lib/mock/products';
import { verifyJwt } from '@/lib/auth';
import { categorySchema } from '@/lib/validation/category.schema';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !['admin', 'vendedor'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        return NextResponse.json(mockCategories, { status: 200 });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Solo administradores pueden crear categorías' }, { status: 403 });
        }

        const body = await request.json();
        const result = categorySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const newCategory = {
            id: `cat-${Date.now()}`,
            ...result.data,
        };

        mockCategories.push(newCategory);

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}