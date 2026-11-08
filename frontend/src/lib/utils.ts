import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, ' ');
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}

export function getAgeBadgeStyles(ageGroup: string): { bg: string; text: string; border: string } {
  switch (ageGroup) {
    case 'Newborn+':
      return {
        bg: 'bg-[#FFE4D0]',
        text: 'text-[#C46749]',
        border: 'border-[#F6B79B]',
      };
    case 'Ages 1-3':
      return {
        bg: 'bg-[#EBF2E0]',
        text: 'text-[#5E7A46]',
        border: 'border-[#DCE6C6]',
      };
    case 'Ages 3+':
      return {
        bg: 'bg-[#FDF3D6]',
        text: 'text-[#9A7010]',
        border: 'border-[#F6C95E]',
      };
    case 'Ages 6+':
      return {
        bg: 'bg-[#FCE0D4]',
        text: 'text-[#8A4A35]',
        border: 'border-[#EFB6B0]',
      };
    default:
      return {
        bg: 'bg-[#EBF2E0]',
        text: 'text-[#5E7A46]',
        border: 'border-[#DCE6C6]',
      };
  }
}
