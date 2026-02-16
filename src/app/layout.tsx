// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Providers } from '@/components/layout/Providers';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Electronic Cuba Shop',
    default: 'Electronic Cuba Shop - Tienda de electrónicos en Cuba',
  },
  description:
    'Compra los mejores electrodomésticos y equipos electrónicos en Cuba. Precios competitivos, envío a domicilio y atención personalizada.',
  keywords: [
    'electrónica',
    'Cuba',
    'tienda online',
    'electrodomésticos',
    'equipos electrónicos',
  ],
  authors: [{ name: 'Electronic Cuba Shop' }],
  creator: 'Electronic Cuba Shop',
  publisher: 'Electronic Cuba Shop',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.electroniccubashop.cu',
    title: 'Electronic Cuba Shop',
    description: 'Tienda virtual de electrónicos en Cuba',
    siteName: 'Electronic Cuba Shop',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Electronic Cuba Shop - Electrodomésticos y electrónicos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electronic Cuba Shop',
    description: 'Tienda virtual de electrónicos en Cuba',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.electroniccubashop.cu',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
} 