// src/lib/validation/product.schema.ts
import { z } from 'zod';

const baseProductSchema = z.object({
    name: z.string().min(3, 'El nombre del producto es obligatorio'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    price: z.number().positive('El precio debe ser mayor que 0'),
    categoryId: z.string().min(1, 'La categoría es obligatoria'),
    stock: z.number().int().nonnegative('El stock no puede ser negativo'),
    image: z.string().url('URL de imagen inválida').optional(),
});

// Para creación (sin ID)
export const productSchema = baseProductSchema;

// Para actualización (también sin ID)
export const productUpdateSchema = baseProductSchema;