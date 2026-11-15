'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<'md' | 'lg' | 'xl', string> = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'lg',
  children,
}: AdminModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${SIZE_CLASSES[size]} bg-white border border-[#EBDCCB] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        <div className="px-6 py-4 bg-[#FCF6EC] border-b border-[#EBDCCB] flex items-start justify-between gap-4 shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-[#502E1E]">{title}</h3>
            {subtitle && <p className="text-xs text-[#6B3F2A] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-full bg-white border border-[#EBDCCB] flex items-center justify-center text-[#502E1E] hover:bg-[#FDECE6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 min-h-0" data-lenis-prevent>
          {children}
        </div>
      </div>
    </div>
  );
}

