// src/app/dashboard/profile/page.tsx
import { ProfileForm } from '@/components/auth/ProfileForm';
import { Metadata } from 'next';

export const meta : Metadata = {
    title: 'Mi perfil | Electronic Cuba Shop',
    description: 'Gestiona tu información personal y de contacto.',
    openGraph: {
        title: 'Mi perfil | Electronic Cuba Shop',
        description: 'Actualiza tus datos personales y dirección de envío.',
        url: 'https://www.electroniccubashop.cu/dashboard/profile',
        siteName: 'Electronic Cuba Shop',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Mi perfil
                </h1>
                <div className="max-w-2xl mx-auto">
                    <ProfileForm />
                </div>
            </main>
        </div>
    );
}