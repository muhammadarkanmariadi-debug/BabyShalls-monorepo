import type { Metadata } from 'next';
import { FaqView } from '@/features/faq/components/FaqView';

export const metadata: Metadata = {
  title: 'Pusat Bantuan (FAQ) | BabyShalls Malang',
  description:
    'Pertanyaan yang sering diajukan seputar pemesanan, pengiriman kurir dari Kota Malang, standar preloved steril UV, dan workshop anak.',
};

export default function FaqPage() {
  return <FaqView />;
}
