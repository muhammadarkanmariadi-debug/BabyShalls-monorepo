'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface PaymentCountdownBadgeProps {
  expiresAt: string | Date;
  variant?: 'banner' | 'pill';
}

function formatRemaining(ms: number): { hours: string; minutes: string; seconds: string } {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

export function PaymentCountdownBadge({ expiresAt, variant = 'banner' }: PaymentCountdownBadgeProps) {
  const targetMs = typeof expiresAt === 'string' ? new Date(expiresAt).getTime() : expiresAt.getTime();
  const [remainingMs, setRemainingMs] = useState<number>(() => Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    setRemainingMs(Math.max(0, targetMs - Date.now()));
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const isExpired = remainingMs <= 0;
  const { hours, minutes, seconds } = formatRemaining(remainingMs);
  const deadlineFormatted = new Date(targetMs).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (variant === 'pill') {
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
          <AlertCircle className="w-3 h-3" />
          Batas bayar habis
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8EF] border border-[#F5B7A1] text-[#D9744A] text-[11px] font-extrabold tabular-nums">
        <Clock className="w-3 h-3" />
        <span>
          Bayar dalam {hours}:{minutes}:{seconds}
        </span>
      </span>
    );
  }

  if (isExpired) {
    return (
      <div className="rounded-2xl p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-2 font-bold">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Batas waktu pembayaran telah berakhir. Silakan buat pesanan baru jika transaksi kedaluwarsa.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 bg-[#FFF8EF] border border-[#F5B7A1] text-left space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D9744A]">
          <Clock className="w-4 h-4" />
          Batas Waktu Pembayaran
        </span>
        <div className="flex items-center gap-1 font-extrabold text-sm tabular-nums">
          <span className="px-2 py-0.5 rounded-md bg-[#D9744A] text-white">{hours}</span>
          <span className="text-[#D9744A]">:</span>
          <span className="px-2 py-0.5 rounded-md bg-[#D9744A] text-white">{minutes}</span>
          <span className="text-[#D9744A]">:</span>
          <span className="px-2 py-0.5 rounded-md bg-[#D9744A] text-white">{seconds}</span>
        </div>
      </div>
      <p className="text-[11px] text-[#6B7280]">
        Selesaikan pembayaran sebelum <strong className="text-[#1A1A1A]">{deadlineFormatted} WIB</strong> agar pesanan tidak dibatalkan otomatis.
      </p>
    </div>
  );
}

