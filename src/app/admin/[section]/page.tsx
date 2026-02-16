// src/app/admin/[section]/page.tsx
'use client';
import { useParams } from 'next/navigation';

export default function AdminSectionPage() {
    const params = useParams();
    const section = params.section as string;

    const sectionTitles: Record<string, string> = {
        dashboard: 'Inicio',
        products: 'Gestión de Productos',
        categories: 'Gestión de Categorías',
        orders: 'Historial de Ventas',
        users: 'Gestión de Usuarios',
        financial: 'Gestión Económica',
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {sectionTitles[section] || 'Sección desconocida'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                Contenido de la sección: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{section}</code>
            </p>
        </div>
    );
}