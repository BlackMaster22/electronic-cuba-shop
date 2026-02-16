// src/components/products/ProductCard.tsx
'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Button } from '../ui/Button';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem(product, 1);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-[1.03]">
            <div className="relative h-48 w-full">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-product.jpg';
                    }}
                />
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {product.price.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                    </span>

                    <Button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="text-xs py-1 px-3"
                    >
                        {product.stock > 0 ? 'Añadir' : 'Agotado'}
                    </Button>
                </div>
            </div>
        </div>
    );
}