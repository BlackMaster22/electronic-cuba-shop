// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock/products';
import { verifyJwt } from '@/lib/auth';
import { productUpdateSchema } from '@/lib/validation/product.schema';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Solo administradores pueden eliminar productos' }, { status: 403 });
        }

        const { id } = params;
        const index = mockProducts.findIndex(p => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        mockProducts.splice(index, 1);

        return NextResponse.json({ message: 'Producto eliminado' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('__Secure-auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Solo administradores pueden editar productos' }, { status: 403 });
        }

        const { id } = params;
        const body = await request.json();
        const result = productUpdateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        // Actualizar producto
        mockProducts[index] = {
            ...mockProducts[index],
            ...result.data,
        };

        return NextResponse.json(mockProducts[index], { status: 200 });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}