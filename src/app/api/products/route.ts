// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, getAuthTokenFromRequest } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { productSchema } from '@/lib/validation/product.schema';

export async function GET(request: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !['admin', 'vendedor', 'cliente'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        const { data: products, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
        }

        return NextResponse.json(products.map(p => ({
            id: p.id,
            name: p.name,
            image: p.image,
            description: p.description,
            price: parseFloat(p.price),
            categoryId: p.category_id,
            stock: p.stock,
        })), { status: 200 });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(request);
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
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const newProduct = {
            id: `prod-${Date.now()}`,
            ...result.data,
        };

        const { error } = await supabase
            .from('products')
            .insert([{
                id: newProduct.id,
                name: newProduct.name,
                image: newProduct.image,
                description: newProduct.description,
                price: newProduct.price.toString(),
                category_id: newProduct.categoryId,
                stock: newProduct.stock,
            }]);

        if (error) {
            return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
        }

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error al crear producto:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}