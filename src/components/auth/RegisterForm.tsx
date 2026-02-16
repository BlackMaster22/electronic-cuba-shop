// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validation/user.schema';
import { Button } from '../ui/Button';
import Link from 'next/link';

type RegisterFormData = {
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: {
        street: string;
        number: string;
        between: [string, string];
        neighborhood: string;
        municipality: string;
        province: string;
    };
    termsAccepted: boolean;
};

export function RegisterForm() {
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data : RegisterFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                const role = result.user.role;

                // Redirigir según rol (registro siempre crea cliente)
                window.location.href = '/dashboard';
            } else {
                const error = await response.json();
                console.error('Error de registro:', error);
                alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
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
                Crear cuenta
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre y Apellidos */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre *
                        </label>
                        <input
                            id="firstName"
                            {...register('firstName')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="José"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Apellidos *
                        </label>
                        <input
                            id="lastName"
                            {...register('lastName')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Pérez González"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* CI y Teléfono */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ci" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Carnet de Identidad *
                        </label>
                        <input
                            id="ci"
                            {...register('ci')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="12345678901"
                        />
                        {errors.ci && <p className="mt-1 text-sm text-red-600">{errors.ci.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Teléfono *
                        </label>
                        <input
                            id="phone"
                            {...register('phone')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="51234567"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                    </div>
                </div>

                {/* Email y Contraseña */}
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
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
                        placeholder="Mínimo 8 caracteres"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmar contraseña *
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Dirección */}
                <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dirección</h3>

                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Calle *
                        </label>
                        <input
                            id="street"
                            {...register('address.street')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Calle 10"
                        />
                        {errors.address?.street && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Número *
                            </label>
                            <input
                                id="number"
                                {...register('address.number')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="123"
                            />
                            {errors.address?.number && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.number.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reparto/Barrio *
                            </label>
                            <input
                                id="neighborhood"
                                {...register('address.neighborhood')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Vedado"
                            />
                            {errors.address?.neighborhood && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.neighborhood.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="between1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entre calle 1 *
                            </label>
                            <input
                                id="between1"
                                {...register('address.between.0')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Calle 8"
                            />
                            {errors.address?.between?.[0] && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.between[0]?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="between2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entre calle 2 *
                            </label>
                            <input
                                id="between2"
                                {...register('address.between.1')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Calle 12"
                            />
                            {errors.address?.between?.[1] && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.between[1]?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Municipio *
                            </label>
                            <input
                                id="municipality"
                                {...register('address.municipality')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Plaza"
                            />
                            {errors.address?.municipality && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.municipality.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Provincia *
                            </label>
                            <input
                                id="province"
                                {...register('address.province')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="La Habana"
                            />
                            {errors.address?.province && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.province.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start">
                    <input
                        id="termsAccepted"
                        type="checkbox"
                        {...register('termsAccepted')}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Acepto los{' '}
                        <button
                            type="button"
                            onClick={() => setIsTermsModalOpen(true)}
                            className="text-primary-600 hover:underline"
                        >
                            términos y condiciones
                        </button>
                        *
                    </label>
                </div>
                {errors.termsAccepted && (
                    <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
                )}

                {/* Botón de submit */}
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full py-2"
                >
                    {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/auth/login" className="text-primary-600 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </form>

            {/* Modal de términos (simplificado) */}
            {isTermsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Términos y Condiciones
                        </h3>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <p>
                                Al registrarte en Electronic Cuba Shop, aceptas nuestros términos de uso, política de privacidad y
                                políticas de envío y devolución.
                            </p>
                            <p>
                                Nos comprometemos a proteger tus datos personales y a utilizarlos únicamente para fines relacionados
                                con la prestación de nuestros servicios.
                            </p>
                            <p>
                                Puedes actualizar tus datos en cualquier momento desde tu perfil.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsTermsModalOpen(false)}
                            className="mt-6 w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}