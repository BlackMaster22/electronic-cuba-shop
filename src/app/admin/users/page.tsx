// src/app/admin/users/page.tsx
'use client';

import { UserRole } from '@/types';
import { useUsers, useUpdateUserRole } from '@/hooks/useUsers';
import { UserList } from '@/components/admin/UserList';

export default function UsersPage() {
    const { data: users = [], isLoading, error } = useUsers();
    const { mutate: updateUserRole } = useUpdateUserRole();

    const handleUpdateRole = (userId: string, role: UserRole) => {
            updateUserRole({ userId, role });
    };

    if (isLoading) {
        return <div>Cargando usuarios...</div>;
    }

    if (error) {
        return <div>Error al cargar usuarios.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
                Aquí puedes gestionar los roles de los usuarios. Solo los administradores tienen acceso a esta sección.
            </p>

            <UserList users={users} onUpdateRole={handleUpdateRole} />
        </div>
    );
}