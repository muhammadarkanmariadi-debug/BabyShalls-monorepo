'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CreditCard, Gift, ArrowLeft, CheckCircle2 } from 'lucide-react';
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

  // Payment State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const shippingCost = items.length > 0 ? selectedCourier.cost : 0;
  const grandTotal = subtotal + shippingCost;

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
            <div>Total Dibayar: <strong className="text-[#DA7A5B]">{formatIDR(grandTotal)}</strong></div>
          </div>
          <Link
            href="/"
            className="block w-full py-3 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-subtle transition-all"
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
          
          {/* Left Column: Form Info (7 cols) */}
          <form onSubmit={handlePayMidtrans} className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Alamat Penerima */}
            <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#502E1E] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE4D0] text-[#DA7A5B] text-xs font-black flex items-center justify-center">1</span>
                <span>Alamat Pengiriman Penerima</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">Nama Penerima *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Amanda Rahma"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#502E1E] mb-1">Alamat Lengkap (Jalan, No Rumah, RT/RW, Kecamatan) *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Merbabu No. 15, Oro-oro Dowo, Klojen..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">Kota / Kabupaten *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kota Malang"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">Kode Pos</label>
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

            {/* Section 2: Pilihan Kurir KiriminAja */}
            <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#502E1E] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFE4D0] text-[#DA7A5B] text-xs font-black flex items-center justify-center">2</span>
                  <span>Opsi Kurir KiriminAja (Origin: Kota Malang)</span>
                </h2>
                <span className="text-xs font-bold text-[#8FA87E]">
                  Total: {formatWeight(totalWeightInGrams)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_COURIERS.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourier(c)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCourier.id === c.id
                        ? 'border-[#DA7A5B] bg-[#FFE4D0]/40 shadow-xs'
                        : 'border-[#EEDBC9] bg-white hover:bg-[#FCF6EC]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-xs text-[#502E1E]">{c.courierName}</div>
                        <div className="text-[11px] text-[#8FA87E]">{c.service} • {c.etd}</div>
                      </div>
                      <div className="font-bold text-xs text-[#DA7A5B]">{formatIDR(c.cost)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Gift Wrapping & Kartu Ucapan */}
            <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#502E1E] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE4D0] text-[#DA7A5B] text-xs font-black flex items-center justify-center">3</span>
                <span>Kemasan Kado & Kartu Ucapan (Gratis)</span>
              </h2>

              <label className="flex items-center gap-2 text-xs font-bold text-[#502E1E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGiftWrapping}
                  onChange={(e) => setIsGiftWrapping(e.target.checked)}
                  className="rounded text-[#DA7A5B] focus:ring-[#DA7A5B]"
                />
                <Gift className="w-4 h-4 text-[#DA7A5B]" />
                <span>Bungkus sebagai kado dengan kertas & pita cantik BabyShalls</span>
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
              <span>{isProcessing ? 'Menghubungkan Midtrans...' : 'Bayar via Midtrans Snap'}</span>
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

