import type { Metadata } from 'next';
import { ShopView } from '@/features/catalog/components/ShopView';

export const metadata: Metadata = {
  title: 'Books & Educational Toys Catalog | BabyShalls Malang',
  description:
    'Explore our curated collection of children’s books, wooden educational toys, gift hampers, and preloved items by age and category.',
};

export default function ShopPage() {
  return <ShopView />;
}
