'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStorefrontProducts } from '../../hooks/useProducts';
import { useActiveCoupons, useClaimedVouchers } from '../../hooks/useCoupons';
import { formatIDR } from '../../lib/utils';

const VOUCHER_BG_PALETTE = ['bg-[#FAF4E8]', 'bg-[#FDECE6]', 'bg-[#E9F3E4]'];

const HOME_VOUCHERS = [
  { code: 'BABYNEW', title: 'Diskon 15% Bunda Baru', subtitle: 'Maks. Rp 50.000', bg: 'bg-[#FAF4E8]' },
  { code: 'MALANGCOZY', title: 'Potongan Rp 20.000', subtitle: 'Semua buku & mainan', bg: 'bg-[#FDECE6]' },
  { code: 'ONGKIRHEMAT', title: 'Subsidi Ongkir Rp 10rb', subtitle: 'Kurir KiriminAja', bg: 'bg-[#E9F3E4]' },
];

export const VoucherPromoSection: React.FC = () => {
  const { claimVoucher, isClaimed: checkClaimed } = useClaimedVouchers();
  const [secondsLeft, setSecondsLeft] = useState(8078); // ~02:14:38
  const { products } = useStorefrontProducts();
  const { data: apiCoupons } = useActiveCoupons();

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 8078));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const displayVouchers =
    apiCoupons && apiCoupons.length > 0
      ? apiCoupons.slice(0, 3).map((c, idx) => ({
          code: c.code,
          title:
            c.discountType === 'PERCENTAGE'
              ? `Diskon ${c.discountValue}%${c.maxDiscount ? ` (Maks. ${formatIDR(c.maxDiscount)})` : ''}`
              : c.discountType === 'SHIPPING_SUBSIDY'
              ? `Subsidi Ongkir ${formatIDR(c.discountValue)}`
              : `Potongan ${formatIDR(c.discountValue)}`,
          subtitle: c.description || 'Berlaku di Checkout',
          bg: VOUCHER_BG_PALETTE[idx % VOUCHER_BG_PALETTE.length],
        }))
      : HOME_VOUCHERS;

  const handleClaim = (code: string) => {
    if (checkClaimed(code)) return;
    claimVoucher(code);
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(code).catch(() => {});
    }
    toast.success(`Voucher ${code} diklaim & disalin ke clipboard!`);
  };

  const promoProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  return (
    <section className="w-full bg-white py-8 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Klaim Voucher Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {displayVouchers.map((v) => {
            const isClaimed = checkClaimed(v.code);
            return (
              <div
                key={v.code}
                className={`${v.bg} rounded-xl p-4 border border-[#E5E7EB] flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1E543B] shrink-0">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#1A1A1A] truncate">{v.title}</div>
                    <div className="text-[11px] text-[#6B7280] truncate">{v.subtitle} • <strong>{v.code}</strong></div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isClaimed}
                  onClick={() => handleClaim(v.code)}
                  className={`min-h-[38px] px-3.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                    isClaimed
                      ? 'bg-white text-[#1E543B] border border-[#1E543B] cursor-default'
                      : 'bg-[#1A1A1A] hover:bg-[#333333] text-white'
                  }`}
                >
                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Diklaim
                    </span>
                  ) : (
                    'Klaim'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 2. Flash Sale / Promo Minggu Ini */}
        <div className="rounded-2xl bg-[#FAF4E8] border border-[#E5E7EB] p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-lg font-extrabold text-[#1A1A1A]">
                <Zap className="w-5 h-5 fill-[#FCE694] text-[#1A1A1A]" />
                <span>Flash Sale BabyShalls</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-extrabold">
                <span className="px-2 py-1 rounded bg-[#1A1A1A] text-white font-mono">{hours}</span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-[#1A1A1A] text-white font-mono">{mins}</span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-[#1A1A1A] text-white font-mono">{secs}</span>
              </div>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-bold text-[#1E543B] hover:underline"
            >
              Lihat Semua Promo →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {promoProducts.map((p) => {
              const disc = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 0;
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="bg-white rounded-xl p-3 border border-[#E5E7EB] hover:border-[#1A1A1A] transition-colors flex flex-col justify-between space-y-2.5"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F7F7F5]">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    {disc > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#F5B7A1] text-[#1A1A1A] text-[10px] font-extrabold">
                        -{disc}%
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A] line-clamp-1">{p.title}</h3>
                    <div className="text-sm font-extrabold text-[#1A1A1A] mt-0.5">
                      {formatIDR(p.price)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-[#FDECE6] overflow-hidden">
                      <div
                        className="h-full bg-[#F5B7A1] rounded-full"
                        style={{ width: `${Math.min(90, Math.max(25, 100 - p.stock * 4))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#6B7280] block">
                      Tersisa {p.stock} unit
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

