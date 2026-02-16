// src/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',

    toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        localStorage.setItem('ec-shop-theme', newTheme);

        // Actualizar inmediatamente el DOM
        const html = document.documentElement;
        if (newTheme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    },

    initializeTheme: () => {
        if (typeof window === 'undefined') return;

        const storedTheme = localStorage.getItem('ec-shop-theme') as Theme | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const themeToUse = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        set({ theme: themeToUse });
        localStorage.setItem('ec-shop-theme', themeToUse);

        // Aplicar al DOM
        const html = document.documentElement;
        if (themeToUse === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    },
}));