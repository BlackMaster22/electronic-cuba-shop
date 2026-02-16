// src/lib/validation/category.schema.ts
import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es demasiado largo'),
});

export const categoryUpdateSchema = categorySchema.extend({
    id: z.string().min(1, 'ID de categoría requerido'),
});