'use client';

import React from 'react';

interface StripInfoProps {
  text?: string;
  className?: string;
}

export const StripInfo: React.FC<StripInfoProps> = ({
  text = 'Complimentary gift wrapping for all hampers  ·  Join our WhatsApp group for new arrivals',
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-[#FBE6D8] py-2 px-4 sm:px-8 lg:px-20 text-center transition-colors ${className}`}
    >
      <p className="text-[12px] sm:text-[13px] font-medium text-[#B05A26] tracking-normal leading-tight">
        {text}
      </p>
    </div>
  );
};
