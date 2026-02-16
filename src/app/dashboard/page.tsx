// src/app/dashboard/page.tsx
'use client';

import { DashboardHeader } from '@/components/layout/Header';
import { OrderHistory } from '@/components/products/OrderHistory';
import { Metadata } from 'next';

export const meta: Metadata = {
    title: 'Mi cuenta | Electronic Cuba Shop',
    description: 'Gestiona tu perfil, carrito y compras en Electronic Cuba Shop.',
    openGraph: {
        title: 'Mi cuenta | Electronic Cuba Shop',
        description: 'Área personal de clientes en nuestra tienda de electrónicos.',
        url: 'https://www.electroniccubashop.cu/dashboard',
        siteName: 'Electronic Cuba Shop',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function DashboardPage() {
    // Nota: La sección de "Explorar productos" se mantendrá vacía hasta que implementes
    // una llamada real a la API de productos (con React Query o fetch)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Mi cuenta
                </h1>

                {/* Historial de compras */}
                <OrderHistory />

                {/* Separador */}
                <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

                {/* Mensaje informativo (productos se gestionan desde admin) */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                        Explorar productos
                    </h2>
                    <p className="text-blue-700 dark:text-blue-300">
                        Los productos disponibles se muestran en tiempo real desde nuestro catálogo.
                        Si no ves productos aquí, contacta con soporte o visita más tarde.
                    </p>
                </div>
            </main>
        </div>
    );
}