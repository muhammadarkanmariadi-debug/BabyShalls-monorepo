'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ArrowRight
} from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { useCart } from '../../src/context/CartContext';
import { formatIDR } from '../../src/data/mockProducts';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    giftWrapping,
    updateGiftWrapping,
    giftWrappingCost,
    grandTotal,
    clearCart
  } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'ekspedisi' | 'instant'>('pickup');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Malang');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri'>('qris');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping calculation
  const shippingFee = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'ekspedisi' ? 25000 : 35000;
  const finalTotal = grandTotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Keranjang belanja Anda masih kosong.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Mohon lengkapi nama dan nomor WhatsApp Anda.');
      return;
    }

    if (deliveryMethod !== 'pickup' && !address.trim()) {
      setErrorMsg('Mohon masukkan alamat lengkap pengiriman.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `BS-${Date.now().toString().slice(-6)}`;

    const deliveryMethodLabel =
      deliveryMethod === 'pickup'
        ? 'Ambil Sendiri di Toko Citraland Puncak Tidar, Malang'
        : deliveryMethod === 'ekspedisi'
        ? 'Ekspedisi Reguler (JNE / SiCepat)'
        : 'Kurir Instant Malang (GoSend / Grab)';

    const paymentMethodLabel =
      paymentMethod === 'qris'
        ? 'QRIS Instan (BCA / GoPay / OVO)'
        : paymentMethod === 'bca'
        ? 'Transfer Bank BCA (No. Rek 816-123-9999)'
        : 'Transfer Bank Mandiri (No. Rek 144-00-8888-222)';

    const newOrder = {
      orderId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@example.com',
      deliveryMethod: deliveryMethodLabel,
      deliveryAddress: deliveryMethod === 'pickup' ? 'Butik BabyShalls Citraland Puncak Tidar Blok HH-26 Malang' : `${address}, ${city} ${postalCode}`.trim(),
      paymentMethod: paymentMethodLabel,
      status: 'Menunggu Pembayaran',
      shippingTrackingNumber: '',
      courier: deliveryMethod === 'pickup' ? 'Ambil di Toko' : deliveryMethod === 'ekspedisi' ? 'JNE Reguler' : 'GoSend Instant',
      items: items.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        coverImage: i.product.coverImage,
        quantity: i.quantity,
        price: i.product.price
      })),
      giftWrapping,
      subtotal,
      shippingFee,
      giftWrappingCost,
      total: finalTotal,
      orderNotes,
      date: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('babyshalls_orders', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-success/${orderId}`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full">
      <Header />

      <main className="flex-grow w-full py-8 sm:py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-[#68625D] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#E07A5F] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#E07A5F] transition-colors">
              Toko
            </Link>
            <span>/</span>
            <span className="text-[#2C2725] font-semibold">Checkout Pesanan</span>
          </nav>

          <div className="mb-8 pb-4 border-b border-[#EDE8E1]">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
              Formulir Checkout &amp; Pembayaran
            </h1>
            <p className="text-xs sm:text-sm text-[#68625D] mt-1">
              Selesaikan detail pengiriman dan pembayaran buku &amp; mainan si kecil dengan aman.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="py-16 bg-white border border-[#EDE8E1] rounded-lg text-center max-w-lg mx-auto p-8 shadow-xs space-y-4">
              <ShoppingBag size={36} className="mx-auto text-[#E07A5F]" />
              <h2 className="text-xl font-bold text-[#2C2725]">Keranjang Belanja Masih Kosong</h2>
              <p className="text-xs text-[#68625D]">
                Anda belum memilih buku atau mainan. Silakan pilih judul buku favorit sebelum melanjutkan ke checkout.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold rounded-md transition-colors"
              >
                Mulai Belanja di Toko
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Checkout Inputs (8 cols) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. Informasi Kontak Pembeli */}
                <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                    <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-bold text-[#2C2725]">Data Pembeli &amp; Kontak</h2>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                        Nama Lengkap Orang Tua / Pemesan <span className="text-[#E07A5F]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Sarah Nurhaliza"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                          Nomor WhatsApp (Aktif) <span className="text-[#E07A5F]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Contoh: 081234567890"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                          Email (Untuk Kirim Invoice)
                        </label>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Metode Pengiriman */}
                <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                    <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-[#2C2725]">Metode Pengiriman</h2>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Pickup Option */}
                    <label
                      className={`flex items-start gap-3 p-3.5 border rounded-md cursor-pointer transition-colors ${
                        deliveryMethod === 'pickup'
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="mt-1 accent-[#E07A5F]"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#2C2725]">
                          <span className="flex items-center gap-1.5">
                            <Store size={15} className="text-[#E07A5F]" />
                            Ambil Sendiri di Butik Citraland Malang
                          </span>
                          <span className="text-emerald-700 font-bold uppercase text-[11px]">GRATIS</span>
                        </div>
                        <p className="text-[#68625D] mt-0.5">
                          Citraland Puncak Tidar Blok HH-26, Malang (Buka Selasa–Minggu, 10.00–19.00 WIB)
                        </p>
                      </div>
                    </label>

                    {/* Ekspedisi Option */}
                    <label
                      className={`flex items-start gap-3 p-3.5 border rounded-md cursor-pointer transition-colors ${
                        deliveryMethod === 'ekspedisi'
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'ekspedisi'}
                        onChange={() => setDeliveryMethod('ekspedisi')}
                        className="mt-1 accent-[#E07A5F]"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#2C2725]">
                          <span className="flex items-center gap-1.5">
                            <Truck size={15} className="text-[#E07A5F]" />
                            Kurir Ekspedisi Reguler (JNE / SiCepat)
                          </span>
                          <span>Rp 25.000</span>
                        </div>
                        <p className="text-[#68625D] mt-0.5">
                          Estimasi 2–4 hari kerja ke seluruh Indonesia dengan bubble wrap tebal &amp; kardus aman.
                        </p>
                      </div>
                    </label>

                    {/* Instant Malang Option */}
                    <label
                      className={`flex items-start gap-3 p-3.5 border rounded-md cursor-pointer transition-colors ${
                        deliveryMethod === 'instant'
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'instant'}
                        onChange={() => setDeliveryMethod('instant')}
                        className="mt-1 accent-[#E07A5F]"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#2C2725]">
                          <span className="flex items-center gap-1.5">
                            <Truck size={15} className="text-[#E07A5F]" />
                            Kurir Instant Malang (GoSend / GrabExpress)
                          </span>
                          <span>Rp 35.000</span>
                        </div>
                        <p className="text-[#68625D] mt-0.5">
                          Tiba di hari yang sama untuk wilayah Malang Kota &amp; Kabupaten (radius 15km).
                        </p>
                      </div>
                    </label>

                    {/* Address Fields if not pickup */}
                    {deliveryMethod !== 'pickup' && (
                      <div className="pt-3 space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                            Alamat Lengkap Penerima <span className="text-[#E07A5F]">*</span>
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                              Kota / Kabupaten
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                              Kode Pos
                            </label>
                            <input
                              type="text"
                              placeholder="65146"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Pilihan Gift Packaging & Kartu Ucapan */}
                <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                    <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base font-bold text-[#2C2725]">Opsi Bingkisan / Kado</h2>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-center gap-3 text-xs font-semibold text-[#2C2725] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrapping.signatureBox}
                        onChange={(e) => updateGiftWrapping({ signatureBox: e.target.checked, customRibbon: e.target.checked })}
                        className="rounded border-[#EDE8E1] text-[#E07A5F] focus:ring-0 accent-[#E07A5F] cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <Gift size={15} className="text-[#E07A5F]" />
                        Bungkus Kado Estetik &amp; Pita Linen (+Rp 25.000)
                      </span>
                    </label>

                    {giftWrapping.signatureBox && (
                      <div className="space-y-3 pt-2 pl-6 animate-in fade-in duration-150">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#68625D] mb-1">
                            Pesan untuk Kartu Ucapan (Ditulis Tangan)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Tuliskan ucapan selamat ulang tahun atau selamat atas kelahiran..."
                            value={giftWrapping.cardMessage}
                            onChange={(e) => updateGiftWrapping({ cardMessage: e.target.value, birthdayCard: !!e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Metode Pembayaran */}
                <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                    <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-base font-bold text-[#2C2725]">Metode Pembayaran</h2>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <label
                      className={`flex items-center justify-between p-3.5 border rounded-md cursor-pointer transition-colors ${
                        paymentMethod === 'qris'
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-[#2C2725]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'qris'}
                          onChange={() => setPaymentMethod('qris')}
                          className="accent-[#E07A5F]"
                        />
                        <QrCode size={16} className="text-[#E07A5F]" />
                        <span>QRIS Instan (BCA, GoPay, OVO, ShopeePay)</span>
                      </div>
                      <span className="text-[10px] bg-[#E2ECE0] text-[#3A5C37] px-2 py-0.5 rounded-xs font-bold">
                        Otomatis
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 border rounded-md cursor-pointer transition-colors ${
                        paymentMethod === 'bca'
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-[#2C2725]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'bca'}
                          onChange={() => setPaymentMethod('bca')}
                          className="accent-[#E07A5F]"
                        />
                        <CreditCard size={16} className="text-[#E07A5F]" />
                        <span>Transfer Bank BCA (Manual Verifikasi)</span>
                      </div>
                      <span className="text-xs text-[#68625D]">816-123-9999</span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 border rounded-md cursor-pointer transition-colors ${
                        paymentMethod === 'mandiri'
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-[#2C2725]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'mandiri'}
                          onChange={() => setPaymentMethod('mandiri')}
                          className="accent-[#E07A5F]"
                        />
                        <CreditCard size={16} className="text-[#E07A5F]" />
                        <span>Transfer Bank Mandiri (Manual Verifikasi)</span>
                      </div>
                      <span className="text-xs text-[#68625D]">144-00-8888-222</span>
                    </label>
                  </div>
                </div>

                {/* Catatan Tambahan */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                    Catatan Khusus untuk Butik BabyShalls (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Tolong titipkan ke security perumahan jika rumah sedang kosong..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>

              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-5">
                  <h2 className="text-base font-bold text-[#2C2725] pb-3 border-b border-[#EDE8E1]">
                    Ringkasan Pesanan ({items.length} Judul)
                  </h2>

                  {/* Items list */}
                  <div className="divide-y divide-[#EDE8E1] max-h-72 overflow-y-auto pr-1">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="py-3 flex gap-3 items-center">
                        <img
                          src={product.coverImage}
                          alt={product.title}
                          className="w-12 h-16 object-cover rounded-sm border border-[#EDE8E1] shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-xs font-semibold text-[#2C2725] truncate">
                            {product.title}
                          </h4>
                          <p className="text-[11px] text-[#68625D]">
                            {quantity} × {formatIDR(product.price)}
                          </p>
                        </div>
                        <div className="text-xs font-bold text-[#2C2725]">
                          {formatIDR(product.price * quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 pt-3 border-t border-[#EDE8E1] text-xs text-[#68625D]">
                    <div className="flex justify-between">
                      <span>Subtotal Buku &amp; Mainan</span>
                      <span className="font-semibold text-[#2C2725]">{formatIDR(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Biaya Pengiriman ({deliveryMethod === 'pickup' ? 'Ambil di Toko' : 'Ekspedisi'})</span>
                      <span className="font-semibold text-[#2C2725]">
                        {shippingFee === 0 ? 'GRATIS' : formatIDR(shippingFee)}
                      </span>
                    </div>

                    {giftWrappingCost > 0 && (
                      <div className="flex justify-between">
                        <span>Gift Packaging</span>
                        <span className="font-semibold text-[#E07A5F]">+{formatIDR(giftWrappingCost)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-bold text-[#2C2725] pt-3 border-t border-[#EDE8E1]">
                      <span>Total Pembayaran</span>
                      <span className="text-[#E07A5F]">{formatIDR(finalTotal)}</span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Buat Pesanan'}</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#68625D] pt-1">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>Transaksi aman &amp; terdaftar di butik resmi BabyShalls</span>
                  </div>
                </div>
              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
