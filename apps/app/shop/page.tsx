import type { Metadata } from 'next';
import { ShopView } from '@/features/catalog/components/ShopView';

export const metadata: Metadata = {
  title: 'Katalog Buku & Mainan Edukasi | BabyShalls Malang',
  description:
    'Jelajahi koleksi lengkap buku anak, mainan kayu edukasi, hampers, dan preloved kurasi berdasarkan usia dan sub-kategori.',
};

export default function ShopPage() {
  return <ShopView />;
}
