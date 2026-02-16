// src/components/admin/CategoryList.tsx
'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { Button } from '../ui/Button';
import { Search, Plus, Edit3, Trash2 } from 'lucide-react';

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
}

export function CategoryList({ categories, onEdit, onDelete, onCreate }: CategoryListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <Button onClick={onCreate} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva categoría
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCategories.map(category => (
                            <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(category)}
                                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                                        aria-label="Editar categoría"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(category.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        aria-label="Eliminar categoría"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCategories.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No se encontraron categorías.
                    </div>
                )}
            </div>
        </div>
    );
}