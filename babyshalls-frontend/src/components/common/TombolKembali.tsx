'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface TombolKembaliProps {
  fallbackUrl?: string;
  label?: string;
  className?: string;
}

export function TombolKembali({ fallbackUrl = '/', label = 'Kembali', className = '' }: TombolKembaliProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <div className={`max-w-[1200px] w-full mx-auto px-4 sm:px-8 pt-4 pb-1 ${className}`}>
      <button
        onClick={handleBack}
        type="button"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7A5644] hover:text-[#B05A26] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-[#B05A26]" />
        <span>{label}</span>
      </button>
    </div>
  );
}

