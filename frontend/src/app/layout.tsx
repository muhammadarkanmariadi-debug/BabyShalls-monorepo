import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Script from 'next/script';
import { Plus_Jakarta_Sans, Sacramento } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { SmoothScrollProvider } from '../context/SmoothScrollProvider';
import { QueryProvider } from '../context/QueryProvider';
import { SiteHeaderWrapper } from '../components/layout/SiteHeaderWrapper';
import { StorefrontShell } from '../components/layout/StorefrontShell';
import { Toast } from '../components/ui/Toast';
import { Toaster } from 'react-hot-toast';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const brandScript = Sacramento({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-brand-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BabyShalls — Toko Buku Anak Kurasi & Mainan Kayu Edukasi | Malang",
  description:
    "Butik buku anak kurasi, board books tebal, mainan kayu ramah anak, dan paket kado hampers di Malang, Jawa Timur. Belanja nyaman berdasarkan usia anak (0-6+ tahun).",
  keywords: [
    'toko buku anak malang',
    'mainan kayu edukasi malang',
    'babyshalls',
    'buku kurasi anak',
    'hampers bayi malang',
    'board books bayi',
    'montessori toys'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMidtransProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
  const midtransSnapSrc = isMidtransProd
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';

  return (
    <html lang="id" className={`${jakarta.variable} ${brandScript.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-[#1A1A1A] font-sans antialiased">
        {midtransClientKey && (
          <Script
            src={midtransSnapSrc}
            data-client-key={midtransClientKey}
            strategy="afterInteractive"
          />
        )}
        <QueryProvider>
          <SmoothScrollProvider>
            <CartProvider>
              <WishlistProvider>
                <Suspense fallback={<main className="flex-1">{children}</main>}>
                  <StorefrontShell>{children}</StorefrontShell>
                </Suspense>
                <Toast />
                <Toaster
                  position="top-center"
                  containerStyle={{ zIndex: 99999 }}
                  toastOptions={{
                    duration: 3800,
                    style: {
                      background: '#FFFDF9',
                      color: '#3D2F28',
                      border: '1px solid #EDE0D0',
                      borderRadius: '14px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      boxShadow: '0 10px 30px rgba(61, 47, 40, 0.12)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#4A7C59',
                        secondary: '#FFFDF9',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#C84B31',
                        secondary: '#FFFDF9',
                      },
                    },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
