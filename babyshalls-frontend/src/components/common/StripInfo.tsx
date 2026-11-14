'use client';

import React from 'react';

interface StripInfoProps {
  text?: string;
  className?: string;
}

export const StripInfo: React.FC<StripInfoProps> = ({
  text = 'Gratis bungkus kado untuk semua hampers  ·  Gabung grup WA untuk katalog terbaru',
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-[#FBE8DF] py-2 px-4 sm:px-8 lg:px-20 text-center transition-colors ${className}`}
    >
      <p className="text-[12px] sm:text-[13px] font-medium text-[#D9744A] tracking-normal leading-tight">
        {text}
      </p>
    </div>
  );
};

