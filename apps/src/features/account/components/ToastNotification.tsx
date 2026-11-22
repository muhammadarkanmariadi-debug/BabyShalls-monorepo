'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastNotificationProps {
  toast: ToastState | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 right-5 sm:right-8 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-200">
      <div
        className={`p-4 rounded-[2px] shadow-lg border flex items-start gap-3 text-xs ${
          isSuccess
            ? 'bg-[#F2FAF4] border-[#A7DBB8] text-[#1E562B]'
            : isError
            ? 'bg-[#FDF0ED] border-[#F5C2B8] text-[#C0392B]'
            : 'bg-[#FFF8EF] border-[#EBDCCB] text-[#502E1E]'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-[#2A6E37] shrink-0 mt-0.5" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
        ) : (
          <Info className="w-4 h-4 text-[#B05A26] shrink-0 mt-0.5" />
        )}

        <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 -mr-1 -mt-1 text-[#7A5644] hover:text-[#4A2A1C] transition-colors cursor-pointer"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
