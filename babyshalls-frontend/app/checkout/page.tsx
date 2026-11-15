'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  Truck,
  Store,
  CreditCard,
  QrCode,
  Gift,
  ShieldCheck,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { useCart } from '@/context/CartContext';
import { formatIDR, mockProducts } from '@/data/mockProducts';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    addToCart,
    subtotal,
    giftWrapping,
    updateGiftWrapping,
    giftWrappingCost,
    grandTotal,
    clearCart,
  } = useCart();

  // Form states
  const [recipientName, setRecipientName] = useState('Dina Permata');
  const [recipientPhone, setRecipientPhone] = useState('0812-3456-7890');
  const [recipientEmail, setRecipientEmail] = useState('dina.permata@gmail.com');
  const [addressLine, setAddressLine] = useState('Jl. Puncak Tidar No. 18, RT 02 / RW 04, Karangbesuki, Sukun');
  const [city, setCity] = useState('Kota Malang');
  const [postalCode, setPostalCode] = useState('65146');

  // Shipping selection
  const [selectedCourier, setSelectedCourier] = useState<string>('jne');

  // Gift options
  const [isGift, setIsGift] = useState<boolean>(true);
  const [giftNote, setGiftNote] = useState<string>(
    'Selamat ulang tahun yang ke-3 adik Kenzo! Semoga tumbuh jadi anak yang sholeh, cerdas, dan gemar membaca. Peluk hangat dari Tante Dina.'
  );
  const [orderNotes, setOrderNotes] = useState<string>('Mohon sertakan pembatas buku BabyShalls.');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'cc'>('qris');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const courierOptions = [
    {
      id: 'jne',
      name: 'JNE Reguler',
      etd: '1–2 hari kerja',
      price: 18000,
      description: 'Pengiriman reguler ke seluruh Malang & Jawa Timur',
    },
    {
      id: 'jnt',
      name: 'J&T Express',
      etd: '1–2 hari kerja',
      price: 20000,
      description: 'Cepat & terpercaya dengan resi otomatis',
    },
    {
      id: 'sicepat',
      name: 'SiCepat REG',
      etd: '1–2 hari kerja',
      price: 19000,
      description: 'Layanan hemat dengan kurir terdekat',
    },
    {
      id: 'gosend',
      name: 'GoSend Instant / Same Day',
      etd: 'Tiba hari ini (maks 3 jam)',
      price: 25000,
      description: 'Khusus alamat tujuan area Malang Raya',
    },
    {
      id: 'pickup',
      name: 'Ambil Sendiri di Toko (Self Pick-up)',
      etd: 'Siap diambil dalam 1 jam',
      price: 0,
      description: 'Butik BabyShalls, Citraland Puncak Tidar Blok HH-26 Malang',
    },
  ];

  const currentCourier = courierOptions.find((c) => c.id === selectedCourier) || courierOptions[0];
  const shippingFee = currentCourier.price;
  const giftFee = isGift ? 0 : 0; // Gratis kado
  const calculatedGrandTotal = subtotal + shippingFee;

  const handlePayOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Keranjang belanjamu masih kosong.');
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim()) {
      setErrorMsg('Mohon lengkapi nama penerima dan nomor WhatsApp.');
      return;
    }

    if (selectedCourier !== 'pickup' && !addressLine.trim()) {
      setErrorMsg('Mohon masukkan alamat lengkap pengiriman.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `BS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrderData = {
      orderId,
      customerName: recipientName,
      customerPhone: recipientPhone,
      customerEmail: recipientEmail,
      deliveryMethod: currentCourier.name,
      deliveryAddress:
        selectedCourier === 'pickup'
          ? 'Butik BabyShalls Citraland Puncak Tidar Blok HH-26 Malang'
          : `${addressLine}, ${city} ${postalCode}`,
      paymentMethod:
        paymentMethod === 'qris'
          ? 'QRIS Instan (BCA / GoPay / ShopeePay)'
          : paymentMethod === 'bca'
          ? 'BCA Virtual Account'
          : paymentMethod === 'mandiri'
          ? 'Mandiri Virtual Account'
          : 'Kartu Kredit / Debit Online',
      status: 'Menunggu Pembayaran',
      shippingTrackingNumber: selectedCourier === 'pickup' ? '-' : `JP${Date.now().toString().slice(-8)}`,
      courier: currentCourier.name,
      items: items.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        coverImage: i.product.coverImage,
      })),
      subtotal,
      shippingFee,
      giftFee,
      totalAmount: calculatedGrandTotal,
      notes: orderNotes,
      giftMessage: isGift ? giftNote : '',
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem('babyshalls_orders');
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.unshift(newOrderData);
        localStorage.setItem('babyshalls_orders', JSON.stringify(parsed));
      } catch {
        // pass
      }
    }

    setTimeout(() => {
      clearCart();
      router.push(`/order-success/${orderId}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">
      {/* Header Checkout (Figma Node #167:4652) */}
      <header className="bg-white border-b border-[#F2E4D6] py-4 px-6 sm:px-12 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-[#B05A26] tracking-tight">
              Baby Shall&apos;s
            </span>
          </Link>

          {/* Steps Stepper */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#2A6E37] font-medium">
              <span className="w-5 h-5 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>Keranjang</span>
            </div>
            <div className="w-10 h-0.5 bg-[#B05A26]"></div>
            <div className="flex items-center gap-1.5 text-[#B05A26] font-semibold">
              <span className="w-5 h-5 rounded-full bg-[#B05A26] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Checkout</span>
            </div>
            <div className="w-10 h-0.5 bg-[#E6D2C0]"></div>
            <div className="flex items-center gap-1.5 text-[#7A5644]">
              <span className="w-5 h-5 rounded-full bg-[#FFF6EA] border border-[#E6D2C0] text-[#7A5644] flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Pembayaran</span>
            </div>
          </div>

          {/* Need help WA link */}
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20BabyShalls,%20saya%20butuh%20bantuan%20proses%20checkout"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B05A26] hover:underline"
          >
            <MessageCircle className="w-4 h-4 text-[#2A6E37]" />
            <span>Butuh bantuan?</span>
          </a>
        </div>
      </header>

      <TombolKembali fallbackUrl="/shop" label="Kembali Berbelanja" />

      {/* Main Content (Figma Node #167:4674) */}
      <main className="py-8 sm:py-12 flex-1">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-[#FEECE8] border border-[#C0392B] rounded-[2px] text-xs text-[#C0392B] font-medium">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            
            {/* Left Column (Forms) */}
            <div className="flex-1 w-full flex flex-col gap-6">
              
              {/* 1. Alamat Pengiriman (Figma #167:4676) */}
              <div className="bg-white p-6 sm:p-7 border border-[#F2E4D6] rounded-[2px]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-medium text-[#4A2A1C] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FFF6EA] text-[#B05A26] text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>Alamat Pengiriman</span>
                  </h2>
                  <span className="text-xs text-[#2A6E37] bg-[#DDF1E5] px-2.5 py-0.5 rounded-[2px] font-medium">
                    Alamat Utama
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[#7A5644] font-medium mb-1">
                      Nama Penerima *
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A5644] font-medium mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-[#7A5644] font-medium mb-1">
                    Alamat Lengkap (Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan) *
                  </label>
                  <textarea
                    rows={2}
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#7A5644] font-medium mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A5644] font-medium mb-1">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Pilih Pengiriman (Figma #167:4690) */}
              <div className="bg-white p-6 sm:p-7 border border-[#F2E4D6] rounded-[2px]">
                <h2 className="text-lg font-medium text-[#4A2A1C] flex items-center gap-2 mb-5">
                  <span className="w-6 h-6 rounded-full bg-[#FFF6EA] text-[#B05A26] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Pilih Opsi Pengiriman</span>
                </h2>

                <div className="flex flex-col gap-3">
                  {courierOptions.map((courier) => {
                    const isSelected = selectedCourier === courier.id;
                    return (
                      <label
                        key={courier.id}
                        className={`p-4 border rounded-[2px] flex items-start justify-between gap-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#B05A26] bg-[#FFFBF7]'
                            : 'border-[#E6D2C0] bg-white hover:border-[#B05A26]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="courier_option"
                            checked={isSelected}
                            onChange={() => setSelectedCourier(courier.id)}
                            className="mt-1 w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#4A2A1C]">
                                {courier.name}
                              </span>
                              <span className="text-[11px] text-[#7A5644] bg-[#FFF6EA] px-2 py-0.5 rounded-[2px]">
                                {courier.etd}
                              </span>
                            </div>
                            <p className="text-xs text-[#7A5644] mt-1">
                              {courier.description}
                            </p>
                          </div>
                        </div>

                        <span className="font-semibold text-sm text-[#4A2A1C] shrink-0">
                          {courier.price === 0 ? 'GRATIS' : formatIDR(courier.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Kado & Catatan (Figma #167:4733) */}
              <div className="bg-white p-6 sm:p-7 border border-[#F2E4D6] rounded-[2px]">
                <h2 className="text-lg font-medium text-[#4A2A1C] flex items-center gap-2 mb-5">
                  <span className="w-6 h-6 rounded-full bg-[#FFF6EA] text-[#B05A26] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Bungkus Kado & Catatan Pesanan</span>
                </h2>

                {/* Gift Wrap Toggle */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F2E4D6] mb-4">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-[#B05A26]" />
                    <div>
                      <p className="text-sm font-semibold text-[#4A2A1C]">
                        Bungkus Kado & Kartu Ucapan Spesial
                      </p>
                      <p className="text-xs text-[#7A5644]">
                        Dibalut kertas kado estetik & pita kain BabyShalls (Gratis Promo)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B05A26]"></div>
                  </label>
                </div>

                {isGift && (
                  <div className="mb-4">
                    <label className="block text-xs text-[#7A5644] font-medium mb-1">
                      Tulis Pesan untuk Kartu Ucapan Kado
                    </label>
                    <textarea
                      rows={3}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Contoh: Selamat ulang tahun ke-3 adik Kenzo! Semoga cerdas dan bahagia selalu."
                      className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-[#7A5644] font-medium mb-1">
                    Catatan Tambahan untuk Penjual (Opsional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Contoh: Tolong kirim sebelum jam 16.00 WIB"
                    className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>
              </div>

              {/* 4. Metode Pembayaran (Figma #167:4747) */}
              <div className="bg-white p-6 sm:p-7 border border-[#F2E4D6] rounded-[2px]">
                <h2 className="text-lg font-medium text-[#4A2A1C] flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF6EA] text-[#B05A26] text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <span>Metode Pembayaran</span>
                </h2>

                <p className="text-xs text-[#7A5644] mb-4">
                  Pembayaran diproses secara instan & aman dengan konfirmasi otomatis via <strong>Midtrans Payment Gateway</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* QRIS */}
                  <label
                    className={`p-3 border rounded-[2px] flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-[#B05A26] bg-[#FFFBF7]'
                        : 'border-[#E6D2C0] hover:border-[#B05A26]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#4A2A1C] block">
                        QRIS Instan
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        BCA, GoPay, ShopeePay, OVO
                      </span>
                    </div>
                  </label>

                  {/* BCA VA */}
                  <label
                    className={`p-3 border rounded-[2px] flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'bca'
                        ? 'border-[#B05A26] bg-[#FFFBF7]'
                        : 'border-[#E6D2C0] hover:border-[#B05A26]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'bca'}
                      onChange={() => setPaymentMethod('bca')}
                      className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#4A2A1C] block">
                        BCA Virtual Account
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        Verifikasi otomatis 24 jam
                      </span>
                    </div>
                  </label>

                  {/* Mandiri VA */}
                  <label
                    className={`p-3 border rounded-[2px] flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'mandiri'
                        ? 'border-[#B05A26] bg-[#FFFBF7]'
                        : 'border-[#E6D2C0] hover:border-[#B05A26]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'mandiri'}
                      onChange={() => setPaymentMethod('mandiri')}
                      className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#4A2A1C] block">
                        Mandiri Virtual Account
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        Konfirmasi instan
                      </span>
                    </div>
                  </label>

                  {/* Kartu Kredit */}
                  <label
                    className={`p-3 border rounded-[2px] flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'cc'
                        ? 'border-[#B05A26] bg-[#FFFBF7]'
                        : 'border-[#E6D2C0] hover:border-[#B05A26]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'cc'}
                      onChange={() => setPaymentMethod('cc')}
                      className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#4A2A1C] block">
                        Kartu Kredit / Debit
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        Visa, Mastercard, JCB
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#2A6E37] bg-[#DDF1E5] p-3 rounded-[2px]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Transaksi dienkripsi 256-bit SSL dan diproses langsung oleh payment gateway terverifikasi Bank Indonesia.</span>
                </div>
              </div>

            </div>

            {/* Right Column: Ringkasan Pesanan (Figma #167:4763, 400px width) */}
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
                        onClick={() => {
                          addToCart(mockProducts[0], 1);
                          addToCart(mockProducts[1], 1);
                        }}
                        className="w-full py-2 bg-[#FFF6EA] hover:bg-[#FBE6D8] border border-[#B05A26] text-[#B05A26] text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                      >
                        + Muat 2 Buku Demo untuk Coba Checkout
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-[#F2E4D6] pt-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#7A5644]">
                    <span>Subtotal Produk</span>
                    <span className="font-medium text-[#4A2A1C]">{formatIDR(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#7A5644]">
                    <span>Biaya Pengiriman ({currentCourier.name})</span>
                    <span className="font-medium text-[#4A2A1C]">
                      {shippingFee === 0 ? 'GRATIS' : formatIDR(shippingFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#7A5644]">
                    <span>Bungkus Kado & Kartu</span>
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
                  onClick={handlePayOrder}
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
                  Dengan mengklik &quot;Bayar Sekarang&quot;, kamu menyetujui Ketentuan Layanan & Kebijakan Privasi Toko BabyShalls Malang.
                </p>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}
