// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            fetchUser: async () => {
                try {
                    const res = await fetch('/api/users/me', {
                        credentials: 'include', // 👈 Asegura que se envíen las cookies
                    });
                    if (res.ok) {
                        const user = await res.json();
                        set({ user });
                    }
                    // ❌ NO borramos el usuario si falla
                    // El middleware ya protege las rutas; no necesitamos "logout" aquí
                } catch (error) {
                    console.error('Error fetching user:', error);
                    // No limpiamos el estado → evita redirección innecesaria
                }
            },
        }),
        {
            name: 'ec-shop-user-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);