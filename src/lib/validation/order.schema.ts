// src/lib/validation/order.schema.ts
import { z } from 'zod';
import { addressSchema } from './user.schema';

const orderItemSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, 'El pedido debe contener al menos un producto'),
    totalAmount: z.number().positive(),
    requiresShipping: z.boolean(),
    shippingCost: z.number().nonnegative(),
    finalTotal: z.number().positive(),
    shippingAddress: addressSchema,
});