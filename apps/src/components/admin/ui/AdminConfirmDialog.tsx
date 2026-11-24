'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  danger?: boolean;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  danger = true,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A2A1C]/50 backdrop-blur-[1px]">
      <div className="bg-white border border-[#E6D2C0] rounded-[6px] w-full max-w-[480px] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E6D2C0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {danger && <AlertTriangle className="w-4 h-4 text-[#C0392B]" />}
            <h3 className="text-base font-semibold text-[#4A2A1C]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#7A5644] hover:bg-[#FFF6EA] cursor-pointer"
            aria-label="Close Dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 text-sm text-[#7A5644] leading-relaxed">{description}</div>

        <div className="px-6 py-4 bg-[#FFFDF9] border-t border-[#E6D2C0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-[4px] border border-[#E6D2C0] bg-white text-xs font-semibold text-[#4A2A1C] hover:bg-[#FFF6EA] cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-[4px] text-xs font-semibold text-white cursor-pointer disabled:opacity-60 ${danger ? 'bg-[#C0392B] hover:bg-[#A93226]' : 'bg-[#B05A26] hover:bg-[#8E431A]'
              }`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

