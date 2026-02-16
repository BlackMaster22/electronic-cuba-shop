// src/components/homepage/FeaturedProducts.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

const placeholderImage = '/images/placeholder-product.jpg';

// Productos temporales (hasta implementar API)
const TEMP_FEATURED_PRODUCTS = [
    {
        id: 'temp-1',
        name: 'Smart TV Samsung 55" 4K',
        image: '/images/products/tv-samsung.jpg',
        price: 125000,
    },
    {
        id: 'temp-2',
        name: 'iPhone 15 Pro 256GB',
        image: '/images/products/iphone15.jpg',
        price: 280000,
    },
    {
        id: 'temp-3',
        name: 'Nevera Mabe 330L',
        image: '/images/products/mabe-fridge.jpg',
        price: 98000,
    },
    {
        id: 'temp-4',
        name: 'Bocina JBL Flip 6',
        image: '/images/products/jbl-flip6.jpg',
        price: 18500,
    },
    {
        id: 'temp-5',
        name: 'Laptop Lenovo IdeaPad 3',
        image: '/images/products/lenovo-ideapad.jpg',
        price: 145000,
    },
    {
        id: 'temp-6',
        name: 'Aire Acondicionado Split',
        image: '/images/products/ac-split.jpg',
        price: 110000,
    },
];

export function FeaturedProducts() {
    return (
        <div className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                    Productos Destacados
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {TEMP_FEATURED_PRODUCTS.map(product => {
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
                                            src={imageUrl}
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