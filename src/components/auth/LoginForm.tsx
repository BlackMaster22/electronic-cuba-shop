// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validation/user.schema';
import { Button } from '../ui/Button';
import Link from 'next/link';

type LoginFormData = {
    email: string;
    password: string;
};

export function LoginForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                const role = result.user.role;

                // Redirigir según rol
                if (role === 'cliente') {
                    window.location.href = '/dashboard';
                } else {
                    window.location.href = '/admin';
                }
            } else {
                const error = await response.json();
                console.error('Error de login:', error);
                alert('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de conexión. Por favor, verifica tu internet.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Iniciar sesión
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Correo electrónico *
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="tu@email.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contraseña *
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Tu contraseña"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full py-2"
                >
                    {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    ¿No tienes cuenta?{' '}
                    <Link href="/auth/register" className="text-primary-600 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
}