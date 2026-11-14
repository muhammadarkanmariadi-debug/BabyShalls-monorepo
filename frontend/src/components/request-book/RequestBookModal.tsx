'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { RequestBookForm } from './RequestBookForm';

interface RequestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestBookModal: React.FC<RequestBookModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-book-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E5E7EB] w-full max-w-xl p-6 sm:p-8 space-y-5 shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F3F4F6] pb-4">
          <div className="space-y-1">
            <h2
              id="request-book-modal-title"
              className="text-xl font-extrabold text-[#1A1A1A] tracking-tight"
            >
              Request a Book
            </h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Mencari buku anak tertentu yang belum ada di katalog? Kirim judul atau ISBN dan tim kami akan menghubungi Anda maksimal 1x24 jam.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal Request a Book"
            className="min-w-[40px] min-h-[40px] rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F8FAFC] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <RequestBookForm />
      </div>
    </div>
  );
};

