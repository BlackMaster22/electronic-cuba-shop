// src/components/layout/ThemeProvider.tsx
'use client';

import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, initializeTheme } = useThemeStore();

    useEffect(() => {
        // Solo en el cliente
        if (typeof window === 'undefined') return;

        // Inicializar tema y aplicar al <html>
        initializeTheme();

        // Aplicar/remover clase 'dark' directamente en <html>
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, [theme, initializeTheme]);

    return <>{children}</>;
}