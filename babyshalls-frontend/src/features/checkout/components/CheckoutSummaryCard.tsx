'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem, Product } from '@/types';
import { formatIDR } from '@/lib/utils';

interface CheckoutSummaryCardProps {
  items: CartItem[];
  onLoadDemoItems: (products: Product[]) => void;
  demoProducts: Product[];
  couponInput: string;
  onCouponInputChange: (val: string) => void;
  onApplyCoupon: () => void;
  isCouponPending: boolean;
  couponStatusMsg: string;
  couponErrorMsg: string;
  subtotal: number;
  courierName: string;
  shippingFee: number;
  discountAmount: number;
  appliedCouponCode: string | null;
  isGift: boolean;
  calculatedGrandTotal: number;
  isSubmitting: boolean;
  onPayOrder: (e: React.FormEvent) => void;
}

export const CheckoutSummaryCard: React.FC<CheckoutSummaryCardProps> = ({
  items,
  onLoadDemoItems,
  demoProducts,
  couponInput,
  onCouponInputChange,
  onApplyCoupon,
  isCouponPending,
  couponStatusMsg,
  couponErrorMsg,
  subtotal,
  courierName,
  shippingFee,
  discountAmount,
  appliedCouponCode,
  isGift,
  calculatedGrandTotal,
  isSubmitting,
  onPayOrder,
}) => {
  return (
    <aside className="w-full lg:w-[400px] shrink-0 sticky top-24">
      <div className="bg-white p-6 sm:p-7 border border-[#F2E4D6] rounded-[2px] flex flex-col gap-5">
        <h3 className="text-lg font-medium text-[#4A2A1C]">
          Ringkasan Pesanan
        </h3>

        {/* Items Mini-list */}
        <div className="flex flex-col gap-3.5 max-h-72 overflow-y-auto pr-1">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="relative w-14 h-14 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0">
                  <Image
                    src={item.product.coverImage || item.product.images?.[0] || '/images/prod-boardbook.jpg'}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-[#4A2A1C] truncate">
                    {item.product.title}
                  </h4>
                  <span className="text-[11px] text-[#7A5644] block">
                    {item.quantity} × {formatIDR(item.product.price)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#4A2A1C] shrink-0">
                  {formatIDR(item.product.price * item.quantity)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center space-y-2.5 bg-[#FFFBF7] rounded-[2px] p-3 border border-[#F2E4D6]">
              <p className="text-xs text-[#7A5644]">Keranjang belanja masih kosong.</p>
              <button
                type="button"
                onClick={() => onLoadDemoItems(demoProducts)}
                className="w-full py-2 bg-[#FFF6EA] hover:bg-[#FBE6D8] border border-[#B05A26] text-[#B05A26] text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                + Muat 2 Buku Demo untuk Coba Checkout
              </button>
            </div>
          )}
        </div>

        {/* Coupon Code Input */}
        <div className="border-t border-[#F2E4D6] pt-4">
          <label className="block text-xs font-semibold text-[#4A2A1C] mb-1.5">
            Kode Kupon / Voucher
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
              placeholder="Contoh: HEMAT10"
              className="flex-1 text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] uppercase focus:outline-none focus:border-[#B05A26]"
            />
            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={isCouponPending}
              className="px-3.5 py-2 bg-[#FFF6EA] border border-[#B05A26] text-[#B05A26] hover:bg-[#B05A26] hover:text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCouponPending ? '...' : 'Terapkan'}
            </button>
          </div>
          {couponStatusMsg && (
            <p className="text-[11px] text-[#2A6E37] mt-1">{couponStatusMsg}</p>
          )}
          {couponErrorMsg && (
            <p className="text-[11px] text-[#C0392B] mt-1">{couponErrorMsg}</p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-[#F2E4D6] pt-4 flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between text-[#7A5644]">
            <span>Subtotal Produk</span>
            <span className="font-medium text-[#4A2A1C]">{formatIDR(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-[#7A5644]">
            <span>Biaya Pengiriman ({courierName})</span>
            <span className="font-medium text-[#4A2A1C]">
              {shippingFee === 0 ? 'GRATIS' : formatIDR(shippingFee)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-[#2A6E37]">
              <span>Diskon Kupon ({appliedCouponCode})</span>
              <span className="font-semibold">-{formatIDR(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[#7A5644]">
            <span>Bungkus Kado &amp; Kartu</span>
            <span className="font-medium text-[#2A6E37]">
              {isGift ? 'GRATIS (Promo)' : '-'}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-[#F2E4D6] pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#4A2A1C]">Total Tagihan</span>
          <span className="text-xl font-bold text-[#B05A26]">
            {formatIDR(calculatedGrandTotal)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onPayOrder}
          disabled={isSubmitting || items.length === 0}
          className="w-full py-3.5 bg-[#B05A26] hover:bg-[#964B1F] disabled:bg-gray-300 text-white font-semibold text-sm rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <span>Memproses Pesanan...</span>
          ) : (
            <span>Bayar Sekarang ({formatIDR(calculatedGrandTotal)})</span>
          )}
        </button>

        <p className="text-[11px] text-[#7A5644] text-center leading-relaxed">
          Dengan mengklik &quot;Bayar Sekarang&quot;, kamu menyetujui Ketentuan Layanan &amp; Kebijakan Privasi Toko BabyShalls Malang.
        </p>
      </div>
    </aside>
  );
};

