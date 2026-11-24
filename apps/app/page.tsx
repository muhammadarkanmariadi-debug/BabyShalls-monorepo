import type { Metadata } from 'next';
import { HomeView } from '@/features/home/components/HomeView';

export const metadata: Metadata = {
  title: 'BabyShalls — Curated Children’s Books & Wooden Toys | Malang',
  description:
    'Curated children’s book boutique & educational wooden toys at Citraland Malang. Featuring board books, picture books, gift hampers, UV-sterilized preloved, and kids workshops.',
};

export default function HomePage() {
  return <HomeView />;
}
