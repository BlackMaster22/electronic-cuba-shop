// src/app/admin/products/page.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { ProductList } from '@/components/admin/ProductList';
import { ProductForm } from '@/components/admin/ProductForm';

export default function ProductsPage() {
    const { data: products = [], isLoading, error } = useProducts(); // ✅ Usa .data
    const { mutate: createProduct } = useCreateProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // ✅ Tipado explícito del parámetro
    const handleCreate = (formData: any) => {
        createProduct(formData); // ✅ formData es el parámetro
        setIsFormOpen(false);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleUpdate = (formData: any) => {
        if (editingProduct) {
            // ✅ Pasar el ID y los datos correctamente
            updateProduct({ id: editingProduct.id, data: formData });
            setIsFormOpen(false);
            setEditingProduct(null);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
            deleteProduct(id);
        }
    };

    if (isLoading) {
        return <div className="p-6">Cargando productos...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error al cargar productos.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
            </div>

            {isFormOpen ? (
                <ProductForm
                    product={editingProduct}
                    onSubmit={editingProduct ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingProduct(null);
                    }}
                />
            ) : (
                <ProductList
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={() => setIsFormOpen(true)}
                />
            )}
        </div>
    );
}