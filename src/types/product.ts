// src/types/product.ts
export interface Product {
    id: string;
    name: string;
    image?: string;       // URL pública (ej: '/images/products/tv-samsung.jpg')
    description: string;
    price: number;       // En CUP (pesos cubanos)
    categoryId: string;  // Relación con Category.id
    stock: number;       // Cantidad disponible
}