// src/app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { categoryUpdateSchema } from '@/lib/validation/category.schema';

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
            return NextResponse.json({ error: 'Solo administradores pueden editar categorías' }, { status: 403 });
        }

        const { id } =  await params;
        const body = await request.json();
        const result = categoryUpdateSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const { error } = await supabase
            .from('categories')
            .update({
                name: result.data.name,
            })
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        const { data:updatedCategory } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        return NextResponse.json({
            id: updatedCategory.id,
            name: updatedCategory.name,
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
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
            return NextResponse.json({ error: 'Solo administradores pueden eliminar categorías' }, { status: 403 });
        }

        const { id } = params;

        // Verificar si hay productos usando esta categoría
        const { data: products, error: productCheckError } = await supabase
            .from('products')
            .select('id')
            .eq('category_id', id);

        if (productCheckError) {
            return NextResponse.json({ error: 'Error al verificar productos' }, { status: 500 });
        }

        if (products && products.length > 0) {
            return NextResponse.json({ error: 'No se puede eliminar una categoría con productos asociados' }, { status: 400 });
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Categoría eliminada' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}