// src/components/products/ProductCard.tsx
'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const placeholderImage = '/images/placeholder-product.jpg';
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (quantity > product.stock) return;
        addItem(product, quantity);
    };

    const imageUrl = product.image && product.image.trim() !== ''
        ? product.image
        : placeholderImage;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = placeholderImage;
                    }}
                />
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {product.description}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Disponible: <span className="font-medium">{product.stock} unidades</span>
                </p>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 py-1 text-gray-700 dark:text-gray-300"
                            aria-label="Reducir cantidad"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                setQuantity(Math.min(Math.max(1, val), product.stock));
                            }}
                            className="w-12 text-center bg-transparent outline-none   text-gray-700 dark:text-gray-300"
                        />
                        <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="px-2 py-1 text-gray-700 dark:text-gray-300"
                            aria-label="Aumentar cantidad"
                        >
                            +
                        </button>
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="text-xs py-1 px-3"
                    >
                        {product.stock > 0 ? 'Añadir' : 'Agotado'}
                    </Button>
                </div>

                <div className="mt-2 text-lg font-bold text-primary-600 dark:text-primary-400">
                    {product.price.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                </div>
            </div>
        </div>
    );
}