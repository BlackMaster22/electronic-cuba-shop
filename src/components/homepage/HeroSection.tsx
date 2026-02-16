// src/components/homepage/HeroSection.tsx
'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';

export function HeroSection() {
    return (
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-200 text-white py-20 px-4">
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[url('/images/electronics-bg.jpg')] bg-cover bg-center"></div>
            </div>

            <div className="relative max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <p>Bienvenido a</p>
                    <p>Electronic Cuba Shop</p>
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                    La mejor tecnología al alcance de tu hogar.
                    Electrodomésticos, celulares, computadoras y más.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/login">
                        <Button variant="default" className="px-8 py-3 text-lg">
                            Iniciar sesión
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary-600">
                            Registrarse
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}