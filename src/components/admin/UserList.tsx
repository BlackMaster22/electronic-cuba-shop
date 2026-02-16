// src/components/admin/UserList.tsx
'use client';

import { User, UserRole } from '@/types';
import { Button } from '../ui/Button';
import { BadgeCheck, Shield, User as UserIcon } from 'lucide-react';
import React from 'react';

interface UserListProps {
    users: User[];
    onUpdateRole: (userId: string, role: UserRole) => void;
}

const roleLabels: Record<UserRole, string> = {
    cliente: 'Cliente',
    vendedor: 'Vendedor',
    admin: 'Administrador',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
    cliente: <UserIcon className="h-4 w-4" />,
    vendedor: <BadgeCheck className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
};

const roleColors: Record<UserRole, string> = {
    cliente: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    vendedor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export function UserList({ users, onUpdateRole }: UserListProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CI</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rol</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {user.ci}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                    {roleIcons[user.role]}
                                    {roleLabels[user.role]}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                {user.role !== 'cliente' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateRole(user.id, 'cliente')}
                                        className="mr-2"
                                    >
                                        Convertir a cliente
                                    </Button>
                                )}
                                {user.role !== 'vendedor' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateRole(user.id, 'vendedor')}
                                        className="mr-2"
                                    >
                                        Convertir a vendedor
                                    </Button>
                                )}
                                {user.role !== 'admin' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateRole(user.id, 'admin')}
                                    >
                                        Hacer admin
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {users.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay usuarios registrados.
                </div>
            )}
        </div>
    );
}