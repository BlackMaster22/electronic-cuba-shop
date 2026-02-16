// src/components/ui/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from './Button';

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
        </Button>
    );
}