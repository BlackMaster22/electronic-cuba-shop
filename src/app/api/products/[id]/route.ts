// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { productUpdateSchema } from '@/lib/validation/product.schema';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        // Verificar si hay órdenes con este producto
        const { data: orders, error: orderCheckError } = await supabase
            .from('orders')
            .select('items')
            .like('items', `%${id}%`);

        if (orderCheckError) {
            return NextResponse.json({ error: 'Error al verificar órdenes' }, { status: 500 });
        }

        if (orders && orders.length > 0) {
            return NextResponse.json({ error: 'No se puede eliminar un producto con órdenes asociadas' }, { status: 400 });
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Producto eliminado' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}