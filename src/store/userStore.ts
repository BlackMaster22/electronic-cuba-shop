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
                    const res = await fetch('/api/users/me');
                    if (res.ok) {
                        const user = await res.json();
                        set({ user });
                    } else {
                        set({ user: null });
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    set({ user: null });
                }
            },
        }),
        {
            name: 'ec-shop-user-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);