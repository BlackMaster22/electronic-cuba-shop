// src/components/layout/PublicHeader.tsx
'use client';

import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';

export function PublicHeader() {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-primary-600  dark:text-gray-50">
                    Electronic Cuba Shop
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="flex gap-2">
                        <Link href="/auth/login">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                                Iniciar sesión
                            </button>
                        </Link>
                        <Link href="/auth/register">
                            <button className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700">
                                Registrarse
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}