'use client';

import React from 'react';
import { X, LogOut } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 max-w-sm w-full shadow-2xl relative text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A5644] hover:text-[#4A2A1C] p-1 cursor-pointer transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF6EA] border border-[#E6D2C0] flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5 text-[#B05A26]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#4A2A1C]">
              Keluar dari Akun?
            </h3>
            <span className="text-[11px] text-[#7A5644]">
              BabyShalls Boutique
            </span>
          </div>
        </div>

        <p className="text-xs text-[#7A5644] mb-5 leading-relaxed">
          Apakah Anda yakin ingin keluar? Anda dapat masuk kembali kapan saja untuk mengakses riwayat pesanan dan alamat pengiriman Anda.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] text-xs font-medium rounded-[2px] cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
