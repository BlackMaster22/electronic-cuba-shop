// src/components/admin/CategoryForm.tsx
'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { Button } from '../ui/Button';

interface CategoryFormProps {
    category?: Category | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {category ? 'Editar categoría' : 'Crear nueva categoría'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                    </label>
                    <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ej: Televisores"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                        {category ? 'Actualizar' : 'Crear categoría'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}