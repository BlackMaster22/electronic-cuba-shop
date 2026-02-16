// src/lib/mock/products.ts
import { Product, Category } from '@/types';

export const mockCategories: Category[] = [
    { id: 'cat-1', name: 'Televisores' },
    { id: 'cat-2', name: 'Celulares' },
    { id: 'cat-3', name: 'Electrodomésticos' },
    { id: 'cat-4', name: 'Audio' },
    { id: 'cat-5', name: 'Computación' },
];

export const mockProducts: Product[] = [
    {
        id: 'prod-1',
        name: 'Smart TV Samsung 55" 4K UHD',
        image: '/images/products/tv-samsung.jpg',
        description: 'Televisor inteligente con resolución 4K, HDR y acceso a aplicaciones como Netflix y YouTube.',
        price: 125000,
        categoryId: 'cat-1',
        stock: 8,
    },
    {
        id: 'prod-2',
        name: 'iPhone 15 Pro 256GB',
        image: '/images/products/iphone15.jpg',
        description: 'El último iPhone con chip A17 Pro, cámara profesional y diseño en titanio.',
        price: 280000,
        categoryId: 'cat-2',
        stock: 5,
    },
    {
        id: 'prod-3',
        name: 'Nevera Mabe 330L',
        image: '/images/products/mabe-fridge.jpg',
        description: 'Refrigerador con tecnología inverter, bajo consumo y gran capacidad.',
        price: 98000,
        categoryId: 'cat-3',
        stock: 3,
    },
    {
        id: 'prod-4',
        name: 'Bocina Bluetooth JBL Flip 6',
        image: '/images/products/jbl-flip6.jpg',
        description: 'Bocina portátil resistente al agua con sonido potente y batería de larga duración.',
        price: 18500,
        categoryId: 'cat-4',
        stock: 12,
    },
    {
        id: 'prod-5',
        name: 'Laptop Lenovo IdeaPad 3',
        image: '/images/products/lenovo-ideapad.jpg',
        description: 'Laptop con procesador Intel Core i5, 8GB RAM y SSD de 512GB.',
        price: 145000,
        categoryId: 'cat-5',
        stock: 6,
    },
    {
        id: 'prod-6',
        name: 'Aire Acondicionado Split 12000 BTU',
        image: '/images/products/ac-split.jpg',
        description: 'Aire acondicionado inverter con modo frío/calor y control remoto inteligente.',
        price: 110000,
        categoryId: 'cat-3',
        stock: 4,
    },
];