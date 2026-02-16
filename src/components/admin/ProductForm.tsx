// src/components/admin/ProductForm.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '../ui/Button';

interface ProductFormProps {
    product?: Product | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

// Categorías temporales (hasta implementar hook useCategories)
const TEMP_CATEGORIES = [
    { id: 'cat-1', name: 'Televisores' },
    { id: 'cat-2', name: 'Celulares' },
    { id: 'cat-3', name: 'Electrodomésticos' },
    { id: 'cat-4', name: 'Audio' },
    { id: 'cat-5', name: 'Computación' },
];

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        categoryId: product?.categoryId || TEMP_CATEGORIES[0]?.id || '',
        stock: product?.stock?.toString() || '',
        image: product?.image || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
        };

        onSubmit(data);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {product ? 'Editar producto' : 'Crear nuevo producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Precio (CUP) *
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stock *
                        </label>
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Categoría *
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                        {TEMP_CATEGORIES.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL de imagen
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="url"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="/images/products/ejemplo.jpg"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                        {product ? 'Actualizar' : 'Crear producto'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}