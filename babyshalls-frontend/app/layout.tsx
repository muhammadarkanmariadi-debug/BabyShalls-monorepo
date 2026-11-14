import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../src/context/CartContext';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'BabyShalls — Curated Children’s Books & Educational Toys | Malang',
  description:
    'A warm, editorial children’s bookstore and educational wooden toys boutique in Malang. Thoughtfully curated board books, picture books, and Montessori toys.',
  keywords: [
    'BabyShalls',
    'Children Bookstore Malang',
    'Montessori Wooden Toys',
    'Curated Picture Books',
    'Citraland Malang'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FFFFFF] text-[#2B2B2B] font-sans antialiased selection:bg-[#D9744A]/15 selection:text-[#D9744A]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
