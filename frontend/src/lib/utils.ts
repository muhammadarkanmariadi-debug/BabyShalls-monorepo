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

/**
 * Format nomor telepon Indonesia saat diketik: 0812-3456-7890 (maks 15 digit).
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) {
    digits = `0${digits.slice(2)}`;
  }
  digits = digits.slice(0, 15);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  if (digits.length > 8) parts.push(digits.slice(8, 12));
  if (digits.length > 12) parts.push(digits.slice(12, 15));
  return parts.join('-');
}

export function normalizePhoneDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function parseChildAge(raw?: string | null): { value: string; unit: 'Tahun' | 'Bulan' } {
  if (!raw) return { value: '', unit: 'Tahun' };
  const trimmed = raw.trim();
  const numMatch = trimmed.match(/(\d+(?:[.,]\d+)?)/);
  const value = numMatch ? numMatch[1].replace(',', '.') : '';
  const unit: 'Tahun' | 'Bulan' = /bulan|bln|month/i.test(trimmed) ? 'Bulan' : 'Tahun';
  return { value, unit };
}

export function formatChildAge(value: string, unit: 'Tahun' | 'Bulan'): string {
  const clean = value.trim();
  if (!clean) return '';
  return `${clean} ${unit}`;
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
