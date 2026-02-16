// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crear cuenta | Electronic Cuba Shop',
    description: 'Regístrate en Electronic Cuba Shop para acceder a tu perfil, carrito y historial de compras.',
    openGraph: {
        title: 'Crear cuenta | Electronic Cuba Shop',
        description: 'Regístrate en nuestra tienda de electrónicos en Cuba.',
        url: 'https://www.electroniccubashop.cu/auth/register',
        siteName: 'Electronic Cuba Shop',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
            {/* Imagen informativa (oculta en móvil) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        ¡Bienvenido a Electronic Cuba Shop!
                    </h1>
                    <p className="text-primary-100 text-lg">
                        Regístrate para disfrutar de una experiencia de compra personalizada,
                        seguimiento de pedidos y ofertas exclusivas.
                    </p>
                    <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                        <p className="text-white italic">
                            "La mejor tecnología al alcance de tu hogar"
                        </p>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div className="w-2/3 flex items-center justify-center p-6">
                <RegisterForm />
            </div>
        </div>
    );
}