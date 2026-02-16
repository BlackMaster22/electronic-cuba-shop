// src/components/homepage/FeaturedProducts.tsx
'use client';

import { mockProducts } from '@/lib/mock/products';
import Image from 'next/image';
import Link from 'next/link';

export function FeaturedProducts() {
    // Seleccionar primeros 6 productos como destacados
    const featured = mockProducts.slice(0, 6);

    const placeholderImage = '/images/placeholder-product.jpg';

    return (
        <div className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                    Productos Destacados
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {featured.map(product => {
                        // Asegurar que image siempre sea un string
                        const imageUrl = product.image && product.image.trim() !== ''
                            ? product.image
                            : placeholderImage;

                        return (
                            <Link
                                key={product.id}
                                href="/auth/login"
                                className="group block"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.03]">
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={imageUrl} // ✅ Ahora siempre es string
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = placeholderImage;
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="font-bold text-primary-600 dark:text-primary-400 text-sm">
                                            {product.price.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-600 dark:text-gray-400">
                        ¿Quieres ver todos nuestros productos?{' '}
                        <Link href="/auth/login" className="text-primary-600 hover:underline dark:text-primary-400">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}