'use client';

import React from 'react';
import { Check, ShieldCheck, Truck, X } from 'lucide-react';
import { formatIDR, formatWeight } from '../../lib/utils';

export interface CheckoutCourierOption {
  id: string;
  courierCode: string;
  courierName: string;
  service: string;
  etd: string;
  cost: number;
}

interface CourierPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  couriers: CheckoutCourierOption[];
  selectedCourier: CheckoutCourierOption;
  onSelect: (courier: CheckoutCourierOption) => void;
  totalWeightInGrams: number;
  isFetching: boolean;
}

export function CourierPickerModal({
  isOpen,
  onClose,
  couriers,
  selectedCourier,
  onSelect,
  totalWeightInGrams,
  isFetching,
}: CourierPickerModalProps) {
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
          <div>
            <h3 className="text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D9744A]" />
              Pilih Opsi Pengiriman
            </h3>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              Dikirim dari Kota Malang • Berat total {formatWeight(totalWeightInGrams)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pilihan kurir"
            className="p-1.5 rounded-full hover:bg-[#F3F4F6] text-[#6B7280]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 overflow-y-auto">
          {isFetching && (
            <div className="text-xs font-semibold text-[#D9744A] bg-[#FAF4E8] px-3 py-2 rounded-xl">
              Memperbarui tarif ongkir terbaru...
            </div>
          )}

          {couriers.map((courier) => {
            const active = selectedCourier.id === courier.id;
            const isWahana = courier.courierCode === 'wahana';

            return (
              <button
                key={courier.id}
                type="button"
                onClick={() => {
                  onSelect(courier);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${active
                    ? 'bg-[#FFF8EF] border-[#D9744A] ring-1 ring-[#D9744A]/30'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D9744A]/60'
                  }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-[#1A1A1A]">
                      {courier.courierName} ({courier.service})
                    </span>
                    {isWahana && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FDF0B8] text-[#502E1E] text-[10px] font-extrabold">
                        Paling Hemat
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Estimasi tiba: <strong className="text-[#1A1A1A]">{courier.etd}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-extrabold text-[#D9744A]">
                    {formatIDR(courier.cost)}
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${active
                        ? 'bg-[#D9744A] border-[#D9744A] text-white'
                        : 'border-[#D1D5DB] bg-white'
                      }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[#FFF8EF]/60 flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E543B]" />
            Garansi packing aman &amp; rapi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#D9744A] hover:underline"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

