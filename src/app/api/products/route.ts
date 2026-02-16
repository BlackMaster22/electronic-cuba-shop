// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock/products';
import { verifyJwt } from '@/lib/auth';
import { productSchema } from '@/lib/validation/product.schema';

export async function GET(request: NextRequest) {
    try {
        // Verificar autenticación (solo admin/vendedor)
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !['admin', 'vendedor'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        // Devolver productos mock
        return NextResponse.json(mockProducts, { status: 200 });
    } catch (error) {
        console.error('Error al obtener productos:', error);
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
            return NextResponse.json({ error: 'Solo administradores pueden crear productos' }, { status: 403 });
        }

        const body = await request.json();
        const result = productSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const newProduct = {
            id: `prod-${Date.now()}`,
            ...result.data,
        };

        // En producción, guardarías en base de datos
        // Por ahora, actualizamos el mock (solo para desarrollo)
        mockProducts.push(newProduct);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error al crear producto:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}