'use client';

import React from 'react';
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { AccountAddress } from '@/hooks/useAccount';

interface DeleteAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: AccountAddress | null;
  onConfirm: () => Promise<void> | void;
  isDeleting: boolean;
}

export const DeleteAddressModal: React.FC<DeleteAddressModalProps> = ({
  isOpen,
  onClose,
  address,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !address) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 max-w-md w-full shadow-2xl relative text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A5644] hover:text-[#4A2A1C] p-1 cursor-pointer transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#FDF0ED] border border-[#F5C2B8] flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-[#C0392B]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#4A2A1C]">
              Hapus Alamat Pengiriman?
            </h3>
            <span className="text-[11px] text-[#7A5644]">
              Label: <strong>{address.label}</strong>
            </span>
          </div>
        </div>

        <p className="text-xs text-[#7A5644] mb-4 leading-relaxed">
          Apakah Anda yakin ingin menghapus alamat untuk penerima <strong>{address.receiverName}</strong> di <em>{address.city}</em>? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="p-3 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] text-[11px] text-[#4A2A1C] mb-5">
          <div className="font-semibold">{address.receiverName} ({address.receiverPhone})</div>
          <div className="text-[#7A5644] mt-0.5">{address.streetAddress}, {address.subdistrict}, {address.city} {address.postalCode}</div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] text-xs font-medium rounded-[2px] cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Alamat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
