'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Gift,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Check,
  X,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatIDR, formatWeight } from '../../lib/utils';

interface CourierOption {
  id: string;
  courierName: string;
  service: string;
  etd: string;
  cost: number;
}

const SAMPLE_COURIERS: CourierOption[] = [
  { id: 'kiriminaja-jnt', courierName: 'J&T Express', service: 'EZ (Reguler)', etd: '1-2 Hari', cost: 18000 },
  { id: 'kiriminaja-sicepat', courierName: 'SiCepat', service: 'SIUNTUNG', etd: '1-2 Hari', cost: 17000 },
  { id: 'kiriminaja-jne', courierName: 'JNE', service: 'REG (Reguler)', etd: '2-3 Hari', cost: 19000 },
  { id: 'kiriminaja-pos', courierName: 'Pos Indonesia', service: 'Kilat Khusus', etd: '2-3 Hari', cost: 16000 },
];

interface CouponData {
  code: string;
  title: string;
  description: string;
  type: 'percent' | 'nominal';
  value: number; // percent value (e.g. 15) or nominal (e.g. 20000)
  maxDiscount?: number;
}

const AVAILABLE_VOUCHERS: CouponData[] = [
  {
    code: 'BABYNEW',
    title: 'Diskon 15% Bunda Baru',
    description: 'Potongan 15% (Maks. Rp 50.000) tanpa minimal belanja',
    type: 'percent',
    value: 15,
    maxDiscount: 50000,
  },
  {
    code: 'MALANGCOZY',
    title: 'Potongan Rp 20.000',
    description: 'Voucher spesial Butik Malang potongan Rp 20.000',
    type: 'nominal',
    value: 20000,
  },
  {
    code: 'ONGKIRHEMAT',
    title: 'Hemat Ongkir Rp 10.000',
    description: 'Potongan subsidi kurir KiriminAja Rp 10.000',
    type: 'nominal',
    value: 10000,
  },
];

export default function CheckoutPage() {
  const { items, totalItems, subtotal, totalWeightInGrams, clearCart } = useCart();

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Shipping & Gift
  const [selectedCourier, setSelectedCourier] = useState<CourierOption>(SAMPLE_COURIERS[0]);
  const [isGiftWrapping, setIsGiftWrapping] = useState(true);
  const [giftNote, setGiftNote] = useState('');

  // Discount Voucher State
  const [couponInput, setCouponInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<CouponData | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const shippingCost = items.length > 0 ? selectedCourier.cost : 0;

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === 'percent') {
      const discount = Math.round((subtotal * appliedVoucher.value) / 100);
      return appliedVoucher.maxDiscount ? Math.min(discount, appliedVoucher.maxDiscount) : discount;
    }
    return Math.min(appliedVoucher.value, subtotal);
  };

  const discountAmount = calculateDiscount();
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (codeToApply?: string) => {
    const rawCode = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!rawCode) {
      setCouponError('Silakan masukkan kode voucher diskon.');
      return;
    }

    const matched = AVAILABLE_VOUCHERS.find((v) => v.code === rawCode);
    if (!matched) {
      setCouponError(`Kode "${rawCode}" tidak ditemukan atau sudah kadaluarsa.`);
      return;
    }

    setAppliedVoucher(matched);
    setCouponInput(matched.code);
    setCouponSuccess(`Voucher ${matched.code} berhasil dipasang!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedVoucher(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  const handlePayMidtrans = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !address) {
      alert('Mohon lengkapi nama penerima, nomor WhatsApp, dan alamat pengiriman.');
      return;
    }

    setIsProcessing(true);
    // Simulate Midtrans Snap generation and payment flow
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1800);
  };

  if (isSuccess) {
    return (
      <div className="py-20 bg-[#FFF8EF]">
        <div className="max-w-md mx-auto px-6 text-center bg-[#FFF9F0] border border-[#EEDBC9] rounded-[28px] p-8 shadow-card space-y-5">
          <div className="w-20 h-20 rounded-full bg-[#EBF2E0] text-[#709154] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#502E1E]">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="text-sm text-[#6B3F2A] leading-relaxed">
            Terima kasih Bunda/Ayah. Konfirmasi pembayaran dan rincian pesanan telah dikirim ke nomor WhatsApp <strong>{phone}</strong>.
          </p>
          <div className="p-4 bg-[#FCF6EC] rounded-2xl border border-[#EEDBC9] text-xs text-left space-y-1.5 text-[#6B3F2A]">
            <div>Pengiriman: <strong>{selectedCourier.courierName} ({selectedCourier.service})</strong></div>
            <div>Origin: <strong>Toko BabyShalls Malang, Jawa Timur</strong></div>
            {discountAmount > 0 && (
              <div className="text-[#709154] font-bold">
                Hemat Voucher ({appliedVoucher?.code}): -{formatIDR(discountAmount)}
              </div>
            )}
            <div className="pt-1 border-t border-[#EEDBC9]">
              Total Dibayar: <strong className="text-[#DA7A5B] font-bold text-sm">{formatIDR(grandTotal)}</strong>
            </div>
          </div>
          <Link
            href="/account"
            className="block w-full py-3 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-subtle transition-all"
          >
            Lacak di Halaman Pesanan Saya
          </Link>
          <Link
            href="/"
            className="block w-full text-xs font-bold text-[#8FA87E] hover:text-[#502E1E] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-6">
        <h2 className="font-serif text-2xl font-bold text-[#502E1E]">Keranjang Belanja Kosong</h2>
        <p className="text-sm text-[#8FA87E] mt-2 mb-6">Silakan pilih produk buku atau mainan edukasi sebelum checkout.</p>
        <Link href="/catalog" className="px-6 py-2.5 rounded-full bg-[#DA7A5B] text-white font-bold text-sm">
          Jelajahi Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16 bg-[#FFF8EF]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8FA87E] hover:text-[#DA7A5B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Belanja</span>
          </Link>
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#502E1E] mb-8">
          Checkout & Pengiriman
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Forms (7 cols) */}
          <form onSubmit={handlePayMidtrans} className="lg:col-span-7 space-y-6">
            
            {/* 1. Recipient Details */}
            <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#502E1E] border-b border-[#EEDBC9] pb-2">
                1. Alamat Pengiriman
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Bunda Amanda Rahma"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Nomor WhatsApp Penerima *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Alamat Lengkap (Jalan, RT/RW, No Rumah, Kelurahan, Kecamatan) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Merbabu No. 15, RT 02 / RW 05, Klojen, Kota Malang"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kota Malang / Surabaya / Jakarta"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="65111"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Courier Selection (Origin Malang) */}
            <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EEDBC9] pb-2">
                <h2 className="font-serif text-lg font-bold text-[#502E1E]">
                  2. Pilihan Kurir (KiriminAja Malang)
                </h2>
                <span className="text-[11px] font-bold text-[#DA7A5B] bg-[#FFE4D0] px-2.5 py-0.5 rounded-full">
                  Total Berat: {formatWeight(totalWeightInGrams)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_COURIERS.map((courier) => (
                  <label
                    key={courier.id}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedCourier.id === courier.id
                        ? 'border-[#DA7A5B] bg-[#FFF2EA] shadow-xs'
                        : 'border-[#EEDBC9] bg-white hover:border-[#F6B79B]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="courier"
                        checked={selectedCourier.id === courier.id}
                        onChange={() => setSelectedCourier(courier)}
                        className="mt-1 text-[#DA7A5B] focus:ring-[#DA7A5B]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#502E1E] block">
                          {courier.courierName}
                        </span>
                        <span className="text-[11px] text-[#8FA87E]">
                          {courier.service} • Est: {courier.etd}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#DA7A5B]">
                      {formatIDR(courier.cost)}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-[#8FA87E]">
                📍 Dikirim langsung dari Butik BabyShalls (Jl. Cempaka No. 12, Klojen, Kota Malang).
              </p>
            </div>

            {/* 3. Free Gift Wrapping Feature */}
            <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#502E1E] border-b border-[#EEDBC9] pb-2">
                3. Layanan Hadiah & Bungkus Kado
              </h2>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#502E1E]">
                <input
                  type="checkbox"
                  checked={isGiftWrapping}
                  onChange={(e) => setIsGiftWrapping(e.target.checked)}
                  className="rounded text-[#DA7A5B] focus:ring-[#DA7A5B]"
                />
                <Gift className="w-4 h-4 text-[#DA7A5B]" />
                <span>Bungkus sebagai kado dengan kertas & pita cantik BabyShalls (Gratis)</span>
              </label>

              {isGiftWrapping && (
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Pesan Kartu Ucapan (Ditulis Tangan oleh Tim BabyShalls):
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Contoh: Selamat ulang tahun ke-2 untuk Arka sayang! Dari Tante Sarah..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
              )}
            </div>

            {/* Submit Button (Mobile view trigger) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full lg:hidden py-4 px-6 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-card flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Menghubungkan Midtrans...' : `Bayar via Midtrans (${formatIDR(grandTotal)})`}</span>
            </button>
          </form>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFF9F0] border-2 border-[#EEDBC9] rounded-[28px] p-6 shadow-card space-y-5 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-[#502E1E] pb-3 border-b border-[#EEDBC9]">
              Ringkasan Pesanan ({totalItems} item)
            </h3>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center text-xs">
                  <div className="flex-1 pr-2">
                    <span className="font-bold text-[#502E1E] block truncate">{product.title}</span>
                    <span className="text-[#8FA87E]">{quantity} x {formatIDR(product.price)}</span>
                  </div>
                  <span className="font-bold text-[#DA7A5B]">
                    {formatIDR(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Voucher / Kode Diskon Section */}
            <div className="pt-3 border-t border-[#EEDBC9] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#502E1E] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#DA7A5B]" />
                  <span>Voucher & Kode Diskon</span>
                </span>
                {appliedVoucher && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-[#C46749] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <X className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {/* Input & Apply Button */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Masukkan kode voucher..."
                    className="w-full px-3 py-2 text-xs uppercase bg-white border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B] font-mono font-bold tracking-wider"
                  />
                  {appliedVoucher && (
                    <span className="absolute right-2.5 top-2.5 text-[#709154]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  Terapkan
                </button>
              </div>

              {/* Feedback messages */}
              {couponError && (
                <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-[#709154] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{couponSuccess}</span>
                </p>
              )}

              {/* Clickable Quick Voucher Recommendations */}
              {!appliedVoucher && (
                <div className="pt-1 space-y-1">
                  <span className="text-[10px] text-[#8FA87E] block font-bold uppercase tracking-wider">
                    Voucher Rekomendasi Hari Ini:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_VOUCHERS.map((v) => (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleApplyCoupon(v.code)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FCF6EC] hover:bg-[#FFE4D0] border border-[#EEDBC9] text-[10px] font-bold text-[#DA7A5B] transition-colors"
                      >
                        <Ticket className="w-3 h-3" />
                        <span>{v.code} ({v.title})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Breakdown costs */}
            <div className="pt-3 border-t border-[#EEDBC9] space-y-2 text-xs text-[#6B3F2A]">
              <div className="flex justify-between">
                <span>Subtotal Produk:</span>
                <span className="font-bold">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir KiriminAja ({selectedCourier.courierName}):</span>
                <span className="font-bold">{formatIDR(shippingCost)}</span>
              </div>
              {appliedVoucher && discountAmount > 0 && (
                <div className="flex justify-between text-[#709154] font-bold">
                  <span>Diskon Voucher ({appliedVoucher.code}):</span>
                  <span>-{formatIDR(discountAmount)}</span>
                </div>
              )}
              {isGiftWrapping && (
                <div className="flex justify-between text-[#709154]">
                  <span>Gift Wrapping & Kartu Ucapan:</span>
                  <span className="font-bold">GRATIS</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#EEDBC9] flex justify-between text-base font-extrabold text-[#502E1E]">
                <span>Total Pembayaran:</span>
                <span className="text-[#DA7A5B] font-serif text-xl">{formatIDR(grandTotal)}</span>
              </div>
            </div>

            {/* Desktop Pay Button */}
            <button
              onClick={handlePayMidtrans}
              disabled={isProcessing}
              className="hidden lg:flex w-full py-4 px-6 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-subtle hover:shadow-card items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Menghubungkan Midtrans...' : `Bayar via Midtrans Snap (${formatIDR(grandTotal)})`}</span>
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8FA87E]">
              <ShieldCheck className="w-4 h-4 text-[#709154]" />
              <span>Transaksi Aman Terenkripsi via Midtrans (QRIS, Kartu Kredit, Debit)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
