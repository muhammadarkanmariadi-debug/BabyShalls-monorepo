import type { Metadata } from 'next';
import { HampersView } from '@/features/hampers/components/HampersView';

export const metadata: Metadata = {
  title: 'Hampers & Kado Anak | BabyShalls Malang',
  description:
    'Pilihan paket hampers siap kirim dan custom gift hamper box untuk kado kelahiran, ulang tahun, dan momen spesial si kecil.',
};

export default function HampersPage() {
  return <HampersView />;
}
