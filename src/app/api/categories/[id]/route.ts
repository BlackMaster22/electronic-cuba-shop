// src/app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockCategories, mockProducts } from '@/lib/mock/products';
import { verifyJwt } from '@/lib/auth';
import { categoryUpdateSchema } from '@/lib/validation/category.schema';

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
            return NextResponse.json({ error: 'Solo administradores pueden editar categorías' }, { status: 403 });
        }

        const { id } = params;
        const body = await request.json();
        const result = categoryUpdateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const index = mockCategories.findIndex(c => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        mockCategories[index] = {
            ...mockCategories[index],
            ...result.data,
        };

        return NextResponse.json(mockCategories[index], { status: 200 });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

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
            return NextResponse.json({ error: 'Solo administradores pueden eliminar categorías' }, { status: 403 });
        }

        const { id } = params;

        // Verificar si hay productos usando esta categoría
        const hasProducts = mockProducts.some(p => p.categoryId === id);
        if (hasProducts) {
            return NextResponse.json(
                { error: 'No se puede eliminar una categoría con productos asociados' },
                { status: 400 }
            );
        }

        const index = mockCategories.findIndex(c => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        mockCategories.splice(index, 1);

        return NextResponse.json({ message: 'Categoría eliminada' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}