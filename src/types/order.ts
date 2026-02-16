// src/types/order.ts
import { Address } from './address';

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export type OrderStatus = 'pendiente' | 'preparado' | 'enviado';

export interface Order {
    id: string;
    customerId: string;
    customerName: string;      // Nombre completo del cliente
    customerEmail: string;
    shippingAddress: Address;
    items: OrderItem[];
    totalAmount: number;       // Suma de productos
    requiresShipping: boolean;
    shippingCost: number;      // 0 si no aplica
    finalTotal: number;        // totalAmount + shippingCost
    status: OrderStatus;
    createdAt: string;         // ISO 8601 (ej: "2026-02-16T10:30:00Z")
}