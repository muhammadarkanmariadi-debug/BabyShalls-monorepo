import type { Metadata } from 'next';
import { Playfair_Display, Nunito } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { SmoothScrollProvider } from '../context/SmoothScrollProvider';
import { SiteHeaderWrapper } from '../components/layout/SiteHeaderWrapper';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import { Toast } from '../components/ui/Toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
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
  return (
    <html lang="id" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFF8EF] text-[#6B3F2A] font-sans antialiased paper-texture">
        <SmoothScrollProvider>
          <CartProvider>
            <SiteHeaderWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
            <Toast />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
