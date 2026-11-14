'use client';

import React from 'react';
import { Check, Tag, Ticket, X } from 'lucide-react';
import { CouponDto } from '../../hooks/useCoupons';
import { formatIDR } from '../../lib/utils';

interface VoucherPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponInput: string;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: (code?: string) => Promise<void>;
  onRemoveCoupon: () => void;
  appliedCoupon: CouponDto | null;
  discountAmount: number;
  couponError: string;
  isValidating: boolean;
  availableVouchers: CouponDto[];
}

export function VoucherPickerModal({
  isOpen,
  onClose,
  couponInput,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  discountAmount,
  couponError,
  isValidating,
  availableVouchers,
}: VoucherPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
          <h3 className="text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#D9744A]" />
            Pilih Voucher BabyShalls
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal voucher"
            className="p-1.5 rounded-full hover:bg-[#F3F4F6] text-[#6B7280]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value)}
              placeholder="Masukkan kode voucher (mis. BABYNEW)"
              className="flex-1 h-[42px] px-4 text-xs font-semibold uppercase bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
            <button
              type="button"
              disabled={isValidating}
              onClick={async () => {
                await onApplyCoupon();
              }}
              className="min-h-[42px] px-5 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white text-xs font-bold transition-colors"
            >
              {isValidating ? 'Cek...' : 'Pakai'}
            </button>
          </div>

          {couponError && <p className="text-xs text-red-600 font-semibold">{couponError}</p>}

          {appliedCoupon && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#E9F3E4] text-[#1E543B] text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                {appliedCoupon.code} aktif (Hemat {formatIDR(discountAmount)})
              </span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-red-600 hover:underline text-[11px]"
              >
                Lepas
              </button>
            </div>
          )}

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-[#6B7280]">Voucher Tersedia</p>
            {availableVouchers.map((voucher) => {
              const isApplied = appliedCoupon?.code === voucher.code;
              return (
                <div
                  key={voucher.code}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border ${isApplied ? 'bg-[#FFF8EF] border-[#D9744A]' : 'bg-white border-[#E5E7EB]'
                    }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FDF0B8] text-[#502E1E] flex items-center justify-center flex-shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#1A1A1A]">{voucher.code}</div>
                      <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-0.5">
                        {voucher.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isValidating}
                    onClick={async () => {
                      if (isApplied) {
                        onRemoveCoupon();
                      } else {
                        await onApplyCoupon(voucher.code);
                        onClose();
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-colors ${isApplied
                        ? 'bg-[#E9F3E4] text-[#1E543B]'
                        : 'bg-[#D9744A] text-white hover:bg-[#c5633b]'
                      }`}
                  >
                    {isApplied ? 'Dipakai' : 'Pakai'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#F3F4F6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

