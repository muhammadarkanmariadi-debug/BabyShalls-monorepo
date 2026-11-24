import type { Metadata } from 'next';
import { ProductDetailView } from '@/features/catalog/components/ProductDetailView';

export const metadata: Metadata = {
  title: 'Product Details | BabyShalls Malang',
  description:
    'Complete product information, specifications, photo gallery, and stock status at BabyShalls Malang.',
};

export default function ProductDetailPage() {
  return <ProductDetailView />;
}
