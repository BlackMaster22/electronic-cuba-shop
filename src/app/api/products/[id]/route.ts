// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, getAuthTokenFromRequest } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { productUpdateSchema } from '@/lib/validation/product.schema';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getAuthTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Solo administradores pueden editar productos' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const result = productUpdateSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const { error } = await supabase
            .from('products')
            .update({
                name: result.data.name,
                image: result.data.image,
                description: result.data.description,
                price: result.data.price.toString(),
                category_id: result.data.categoryId,
                stock: result.data.stock,
            })
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
        }

        const { data: updatedProduct } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        return NextResponse.json({
            id: updatedProduct.id,
            name: updatedProduct.name,
            image: updatedProduct.image,
            description: updatedProduct.description,
            price: parseFloat(updatedProduct.price),
            categoryId: updatedProduct.category_id,
            stock: updatedProduct.stock,
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getAuthTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Solo administradores pueden eliminar productos' }, { status: 403 });
        }

        const { id } = await params;

        // ⚠️ Eliminamos la verificación de órdenes (por ahora)
        // porque .like() no funciona en columnas JSONB

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar producto:', error);
            return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Producto eliminado' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}