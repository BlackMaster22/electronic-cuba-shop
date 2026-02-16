// src/components/admin/AdminSidebar.tsx
import Link from 'next/link';
import { Home, Package, Users, BarChart3, Layers, Settings } from 'lucide-react';
import { UserRole } from '@/types';

interface AdminSidebarProps {
    role: UserRole;
}

const sidebarItems = [
    { id: 'dashboard', name: 'Inicio', icon: Home, roles: ['admin', 'vendedor'] },
    { id: 'products', name: 'Gestión de Productos', icon: Package, roles: ['admin', 'vendedor'] },
    { id: 'categories', name: 'Gestión de Categorías', icon: Layers, roles: ['admin', 'vendedor'] },
    { id: 'orders', name: 'Historial de Ventas', icon: BarChart3, roles: ['admin', 'vendedor'] },
    { id: 'users', name: 'Gestión de Usuarios', icon: Users, roles: ['admin'] },
    { id: 'financial', name: 'Gestión Económica', icon: Settings, roles: ['admin'] },
];

export function AdminSidebar({ role }: AdminSidebarProps) {
    const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
        </div>
    );
}