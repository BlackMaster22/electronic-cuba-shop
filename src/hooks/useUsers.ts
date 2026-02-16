// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get<User[]>('/users');
            return response.data;
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const response = await api.put(`/users/${userId}/role`, { role });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}