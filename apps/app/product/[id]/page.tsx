import type { Metadata } from 'next';
import { ProductDetailView } from '@/features/catalog/components/ProductDetailView';

export const metadata: Metadata = {
  title: 'Detail Produk | BabyShalls Malang',
  description:
    'Informasi lengkap produk, spesifikasi, galeri foto, dan stok toko BabyShalls Malang.',
};

export default function ProductDetailPage() {
  return <ProductDetailView />;
}
