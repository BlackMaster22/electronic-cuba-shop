// src/components/admin/AdminSidebar.tsx
import Link from 'next/link';
import { LogOut, Package, Users, BarChart3, Layers, Settings } from 'lucide-react';
import { UserRole } from '@/types';
import { Button } from '../ui/Button';

interface AdminSidebarProps {
    role: UserRole;
}

const sidebarItems = [
    { id: 'products', name: 'Gestión de Productos', icon: Package, roles: ['admin', 'vendedor'] },
    { id: 'categories', name: 'Gestión de Categorías', icon: Layers, roles: ['admin', 'vendedor'] },
    { id: 'orders', name: 'Historial de Ventas', icon: BarChart3, roles: ['admin', 'vendedor'] },
    { id: 'users', name: 'Gestión de Usuarios', icon: Users, roles: ['admin'] },
    { id: 'financial', name: 'Gestión Económica', icon: Settings, roles: ['admin'] },
];

export function AdminSidebar({ role }: AdminSidebarProps) {
    const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menú</h2>
            </div>

            <nav className="flex-1 p-2 space-y-1">
                {filteredItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={`/admin/${item.id}`}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="mb-6 w-auto text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
                Cerrar sesión <LogOut className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}