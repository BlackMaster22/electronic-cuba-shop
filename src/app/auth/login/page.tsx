// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar sesión | Electronic Cuba Shop',
    description: 'Accede a tu cuenta en Electronic Cuba Shop para gestionar tu perfil, carrito y compras.',
    openGraph: {
        title: 'Iniciar sesión | Electronic Cuba Shop',
        description: 'Inicia sesión en nuestra tienda de electrónicos en Cuba.',
        url: 'https://www.electroniccubashop.cu/auth/login',
        siteName: 'Electronic Cuba Shop',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
            {/* Imagen informativa (oculta en móvil) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        ¡Bienvenido de nuevo!
                    </h1>
                    <p className="text-primary-100 text-lg">
                        Inicia sesión para acceder a tu perfil, ver tu historial de compras
                        y continuar con tus pedidos pendientes.
                    </p>
                    <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                        <p className="text-white italic">
                            "Tu tecnología favorita, siempre a un clic"
                        </p>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 ">
                <LoginForm />
            </div>
        </div>
    );
}