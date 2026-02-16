// src/app/page.tsx
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedProducts } from '@/components/homepage/FeaturedProducts';
import { Footer } from '@/components/layout/Footer';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Metadata } from 'next';

export const meta : Metadata = {
  title: 'Electronic Cuba Shop - Tienda de electrónicos en Cuba',
  description: 'Compra los mejores electrodomésticos y equipos electrónicos en Cuba. Precios competitivos, envío a domicilio y atención personalizada.',
  keywords: ['electrónica', 'Cuba', 'tienda online', 'electrodomésticos', 'equipos electrónicos', 'celulares', 'computadoras'],
  openGraph: {
    title: 'Electronic Cuba Shop - Tienda de electrónicos en Cuba',
    description: 'La mejor tecnología al alcance de tu hogar en Cuba.',
    url: 'https://www.electroniccubashop.cu',
    siteName: 'Electronic Cuba Shop',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/og-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Electronic Cuba Shop - Electrodomésticos y electrónicos',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary-600 to-primary-200 dark:bg-gray-900">
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        {/*<FeaturedProducts />*/}
      </main>
      <Footer />
    </div>
  );
}