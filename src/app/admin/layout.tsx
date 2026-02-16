// src/app/admin/layout.tsx
'use client';

import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/Button';
import { Menu } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, fetchUser } = useUserStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    // Solo usuarios con rol admin o vendedor pueden acceder (middleware ya lo protege)
    if (!user || (user.role !== 'admin' && user.role !== 'vendedor')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">Acceso denegado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar (oculto en móvil si no está abierto) */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <AdminSidebar role={user.role} />
            </div>

            {/* Overlay para móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden"
                                aria-label="Toggle sidebar"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Módulo Administrativo – Electronic Cuba Shop
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 dark:text-gray-300 hidden sm:block">
                                {user.firstName}
                            </span>
                            {/* Logout o ThemeToggle aquí si se desea */}
                        </div>
                    </div>
                </header>

                {/* Área de contenido */}
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}