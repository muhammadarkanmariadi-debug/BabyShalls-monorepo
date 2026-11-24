import type { Metadata } from 'next';
import { HampersView } from '@/features/hampers/components/HampersView';

export const metadata: Metadata = {
  title: 'Hampers & Baby Gifts | BabyShalls Malang',
  description:
    'Curated ready-to-ship and custom gift hampers for baby showers, birthdays, and special milestones.',
};

export default function HampersPage() {
  return <HampersView />;
}
