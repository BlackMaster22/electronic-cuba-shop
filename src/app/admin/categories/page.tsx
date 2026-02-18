// src/app/admin/categories/page.tsx
'use client';

import { useState } from 'react';
import { Category } from '@/types';
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory
} from '@/hooks/useCategories';
import { CategoryList } from '@/components/admin/CategoryList';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function CategoriesPage() {
    // ✅ CORRECTO: useQuery devuelve { data, isLoading, error }
    const { data: categories = [], isLoading, error } = useCategories();

    const { mutate: createCategory } = useCreateCategory();
    const { mutate: updateCategory } = useUpdateCategory();
    const { mutate: deleteCategory } = useDeleteCategory();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // ✅ CORRECTO: tipar el parámetro
    const handleCreate = (data: { name: string }) => {
        createCategory(data);
        setIsFormOpen(false);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleUpdate = (data: { name: string }) => {
        if (editingCategory) {
            // ✅ CORRECTO: pasar id y data separados
            updateCategory({ id: editingCategory.id, data });
            setIsFormOpen(false);
            setEditingCategory(null);
        }
    };

    const handleDelete = (id: string) => {
        deleteCategory(id);
    };

    if (isLoading) {
        return <div className="p-6">Cargando categorías...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error al cargar categorías.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h1>
            </div>

            {isFormOpen ? (
                <CategoryForm
                    category={editingCategory}
                    onSubmit={editingCategory ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingCategory(null);
                    }}
                />
            ) : (
                <CategoryList
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={() => setIsFormOpen(true)}
                />
            )}
        </div>
    );
}