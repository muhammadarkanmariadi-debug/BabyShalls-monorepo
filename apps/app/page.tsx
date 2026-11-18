import type { Metadata } from 'next';
import { HomeView } from '@/features/home/components/HomeView';

export const metadata: Metadata = {
  title: 'BabyShalls — Butik Buku Anak Kurasi & Mainan Kayu | Malang',
  description:
    'Butik toko buku anak kurasi & mainan kayu edukasi di Citraland Malang. Tersedia board books, picture books, hampers, preloved steril UV, dan workshop anak.',
};

export default function HomePage() {
  return <HomeView />;
}
