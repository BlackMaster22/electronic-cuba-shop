// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { CartModal } from '../products/CartModal';
import { useUserStore } from '@/store/userStore';

export function DashboardHeader() {
    const { user, fetchUser } = useUserStore();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const userName = user?.firstName || 'Usuario';
    const totalItems = useCartStore((state) => state.getTotalItems());

    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <>
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        Electronic Cuba Shop
                    </Link>

                    <div className="hidden md:block text-gray-700 dark:text-gray-300">
                        ¡Hola, {userName}!
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                            aria-label={`Ver carrito, ${totalItems} productos`}
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <ThemeToggle />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                        >
                            Cerrar sesión
                        </Button>
                        <Link href="/dashboard/profile" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 text-sm">
                            Mi perfil
                        </Link>
                    </div>
                </div>
            </header>

            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}