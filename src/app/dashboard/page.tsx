// src/app/dashboard/page.tsx
'use client'
import { DashboardHeader } from '@/components/layout/Header';
import { ProductCard } from '@/components/products/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mock/products';
import { Metadata } from 'next';
import { useState } from 'react';
import { OrderHistory } from '@/components/products/OrderHistory';

export const meta : Metadata = {
    title: 'Mi cuenta | Electronic Cuba Shop',
    description: 'Gestiona tu perfil, carrito y compras en Electronic Cuba Shop.',
    openGraph: {
        title: 'Mi cuenta | Electronic Cuba Shop',
        description: 'Área personal de clientes en nuestra tienda de electrónicos.',
        url: 'https://www.electroniccubashop.cu/dashboard',
        siteName: 'Electronic Cuba Shop',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Filtrar productos
    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Mi cuenta
                </h1>

                {/* Historial de compras */}
                <OrderHistory />

                {/* Separador */}
                <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

                {/* Productos */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Explorar productos
                </h2>

                {/* Barra de búsqueda y filtros */}
                <div className="mb-8 space-y-4">
                    {/* Búsqueda */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Buscar productos
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Ej: iPhone, Nevera..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Filtros por categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categorías
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === ''
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Todas
                            </button>
                            {mockCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category.id
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid de productos */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-12">
                        No se encontraron productos.
                    </p>
                )}
            </main>
        </div>
    );
}