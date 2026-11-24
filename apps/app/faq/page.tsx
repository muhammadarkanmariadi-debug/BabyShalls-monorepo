import type { Metadata } from 'next';
import { FaqView } from '@/features/faq/components/FaqView';

export const metadata: Metadata = {
  title: 'Help Center (FAQ) | BabyShalls Malang',
  description:
    'Frequently asked questions about ordering, nationwide shipping from Malang, UV-sterilized preloved standards, and kids workshops.',
};

export default function FaqPage() {
  return <FaqView />;
}
