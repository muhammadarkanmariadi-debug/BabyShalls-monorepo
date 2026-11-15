import type { Metadata } from 'next';
import { Poppins, Quicksand } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { QueryProvider } from '@/context/QueryProvider';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BabyShalls — Curated Children’s Books & Educational Toys | Malang',
  description:
    'Boutique toko buku anak dan mainan edukasi kayu di Citraland Malang. Board books, picture books klasik impor, hampers, dan kelas sensori anak.',
  keywords: [
    'BabyShalls',
    'Toko Buku Anak Malang',
    'Mainan Kayu Montessori',
    'Curated Picture Books',
    'Citraland Malang',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} ${quicksand.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FFF6EA] text-[#4A2A1C] font-sans antialiased selection:bg-[#FBE6D8] selection:text-[#B05A26]">
        <QueryProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#FFFDF9',
                  color: '#4A2A1C',
                  border: '1px solid #E6D2C0',
                  borderRadius: '2px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-poppins)',
                },
                success: {
                  iconTheme: {
                    primary: '#2A6E37',
                    secondary: '#FFFDF9',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#C0392B',
                    secondary: '#FFFDF9',
                  },
                },
              }}
            />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
