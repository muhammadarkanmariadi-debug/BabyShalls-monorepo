'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: 'md' | 'lg';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const WIDTH_CLASS: Record<'md' | 'lg', string> = {
  md: 'max-w-[560px]',
  lg: 'max-w-[640px]',
};

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  width = 'lg',
  footer,
  children,
}: AdminDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#4A2A1C]/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        className={`relative z-10 w-full ${WIDTH_CLASS[width]} bg-white h-full border-l border-[#E6D2C0] shadow-2xl flex flex-col`}
      >
        <div className="px-6 py-4 border-b border-[#E6D2C0] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#4A2A1C] truncate">{title}</h2>
            {subtitle && <p className="text-xs text-[#7A5644] mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] cursor-pointer"
            aria-label="Tutup Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-[#E6D2C0] bg-[#FFFDF9] flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}

