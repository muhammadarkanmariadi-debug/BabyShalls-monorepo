'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast, openCart } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-bounce-in">
      <div className="bg-[#502E1E] text-white p-4 rounded-2xl shadow-card border border-[#DA7A5B] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#8FA87E] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold leading-tight text-[#FFF8EF]">
            {toastMessage}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={openCart}
            className="text-xs font-bold text-[#F6C95E] hover:underline"
          >
            Lihat Keranjang
          </button>
          <button
            onClick={dismissToast}
            className="p-1 rounded-full text-white/70 hover:text-white"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

