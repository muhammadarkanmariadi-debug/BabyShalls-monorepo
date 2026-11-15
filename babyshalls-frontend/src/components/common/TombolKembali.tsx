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
    <div className={`w-full bg-[#FFFBF7] border-b border-[#F2E4D6] py-2 px-6 sm:px-12 flex items-center justify-center ${className}`}>
      <div className="max-w-[1200px] w-full flex items-center">
        <button
          onClick={handleBack}
          type="button"
          className="inline-flex items-center gap-2 text-[#4A2A1C] hover:text-[#B05A26] text-sm font-medium transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{label}</span>
        </button>
      </div>
    </div>
  );
}

