// src/app/dashboard/page.tsx
'use client';

import { DashboardHeader } from '@/components/layout/Header';
import { OrderHistory } from '@/components/products/OrderHistory';
import { ProductExplorer } from '@/components/products/ProductExplorer';
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

                <ProductExplorer />
            </main>
        </div>
    );
}