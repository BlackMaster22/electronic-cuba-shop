// src/lib/validation/user.schema.ts
import { z } from 'zod';

// Dirección (anidada)
export const addressSchema = z.object({
  street: z.string().min(3, 'La calle debe tener al menos 3 caracteres'),
  number: z.string().min(1, 'El número es obligatorio'),
  between: z.tuple([
    z.string().min(1, 'La primera calle entre calles es obligatoria'),
    z.string().min(1, 'La segunda calle entre calles es obligatoria'),
  ]),
  neighborhood: z.string().min(2, 'El reparto/barrio es obligatorio'),
  municipality: z.string().min(2, 'El municipio es obligatorio'),
  province: z.string().min(2, 'La provincia es obligatoria'),
});

// Esquema de registro
export const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es demasiado largo'),
  lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres').max(80, 'Los apellidos son demasiado largos'),
  ci: z.string().regex(/^\d{11}$/, 'El carnet de identidad debe tener exactamente 11 dígitos'),
  phone: z.string().regex(/^5\d{7}$/, 'El teléfono debe ser un número móvil cubano (5 + 7 dígitos)'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  address: addressSchema,
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Esquema de login
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

// Esquema de actualización de perfil (sin contraseña ni CI)
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(80),
  phone: z.string().regex(/^5\d{7}$/),
  address: addressSchema,
});