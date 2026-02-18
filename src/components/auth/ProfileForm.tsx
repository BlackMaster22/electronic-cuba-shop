// src/components/auth/ProfileForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '@/lib/validation/user.schema';
import { useUserStore } from '@/store/userStore';
import { Button } from '../ui/Button';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

type ProfileFormData = {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
        street: string;
        number: string;
        between: [string, string];
        neighborhood: string;
        municipality: string;
        province: string;
    };
};

export function ProfileForm() {
    const { user, fetchUser } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const router = useRouter();

    const {
        register,
        handleSubmit, // Lo usaremos manualmente en el botón
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileUpdateSchema),
        mode: 'onChange',
    });

    // Cargar datos del usuario al montar
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
            });
        } else {
            fetchUser();
        }
    }, [user, fetchUser, reset]);

    const onSubmit = async (formData: ProfileFormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await api.put('/users/me', formData);

            if (response.status === 200) {
                useUserStore.getState().setUser(response.data);
                setSubmitStatus('success');
                reset(formData);
            } else {
                throw new Error('Error al actualizar');
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* El formulario ahora solo contiene los inputs */}
            <form id="profile-form" className="space-y-6">
                {/* Nombre y Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre *
                        </label>
                        <input
                            id="firstName"
                            {...register('firstName')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Teléfono */}
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

                {/* Dirección */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dirección de envío</h3>

                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Calle *
                        </label>
                        <input
                            id="street"
                            {...register('address.street')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.address?.street && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Número *
                            </label>
                            <input
                                id="number"
                                {...register('address.number')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                            />
                            {errors.address?.neighborhood && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.neighborhood.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Municipio *
                            </label>
                            <input
                                id="municipality"
                                {...register('address.municipality')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                            />
                            {errors.address?.province && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.province.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="between1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entre calle 1 *
                            </label>
                            <input
                                id="between1"
                                {...register('address.between.0')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                            />
                            {errors.address?.between?.[1] && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.between[1]?.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mensajes de estado (fuera del flow del submit visual pero dentro del form o fuera, aquí lo dejo visible) */}
                {submitStatus === 'success' && (
                    <p className="text-green-600 dark:text-green-400 text-sm">
                        ¡Perfil actualizado correctamente!
                    </p>
                )}
                {submitStatus === 'error' && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                        Error al actualizar. Por favor, inténtalo de nuevo.
                    </p>
                )}
            </form>

            {/* Contenedor de Botones Alineados */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {/* Botón Guardar */}
                <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty || !isValid || isSubmitting}
                    className="flex-1 py-2.5" // flex-1 asegura que ocupen el mismo ancho disponible
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>

                {/* Botón Regresar */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                    className="flex-1 py-2.5" // Mismo alto y ancho relativo
                >
                    ← Regresar
                </Button>
            </div>
        </div>
    );
}