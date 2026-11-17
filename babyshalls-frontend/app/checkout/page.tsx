'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/data/mockProducts';
import { formatIDR } from '@/lib/utils';
import { CheckoutSummaryCard } from '@/features/checkout/components/CheckoutSummaryCard';
import { RegionOption, useSearchRegions, useShippingRates } from '@/hooks/useShipping';
import { useCreateOrder } from '@/hooks/useOrders';
import { useValidateCoupon } from '@/hooks/useCoupons';
import { useAccountProfile } from '@/hooks/useAccount';
import { openMidtransSnap } from '@/lib/midtrans-snap';
import { USER_TOKEN_STORAGE_KEY } from '@/lib/axios';

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

  const [hasUserToken, setHasUserToken] = useState(false);
  useEffect(() => {
    try {
      setHasUserToken(Boolean(window.localStorage.getItem(USER_TOKEN_STORAGE_KEY)));
    } catch {
      setHasUserToken(false);
    }
  }, []);

  const { data: accountProfile } = useAccountProfile(hasUserToken);
  const createOrderMutation = useCreateOrder();
  const validateCouponMutation = useValidateCoupon();

  // Form states (prefilled from real account when logged in)
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Kota Malang');
  const [postalCode, setPostalCode] = useState('65146');

  useEffect(() => {
    if (accountProfile) {
      setRecipientName((prev) => prev || accountProfile.name || '');
      setRecipientPhone((prev) => prev || accountProfile.phone || '');
      setRecipientEmail((prev) => prev || accountProfile.email || '');
    }
  }, [accountProfile]);

  // Shipping region & live rates (Malang Origin)
  const [regionQuery, setRegionQuery] = useState<string>('Malang');
  const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState<boolean>(false);
  const [selectedCourier, setSelectedCourier] = useState<string>('pickup');

  const { data: regionOptions = [], isLoading: isRegionsLoading } = useSearchRegions(regionQuery);

  useEffect(() => {
    if (!selectedRegion && regionOptions.length > 0) {
      const defaultRegion =
        regionOptions.find((r) => r.searchLabel.toLowerCase().includes('malang')) || regionOptions[0];
      setSelectedRegion(defaultRegion);
      setRegionQuery(defaultRegion.searchLabel);
      setCity(defaultRegion.cityName);
      if (defaultRegion.postalCode) setPostalCode(defaultRegion.postalCode);
    }
  }, [regionOptions, selectedRegion]);

  const totalWeightGrams = useMemo(() => {
    const sum = items.reduce(
      (acc, item) => acc + (item.product.weightInGrams || 300) * item.quantity,
      0
    );
    return sum > 0 ? sum : 300;
  }, [items]);

  const {
    data: shippingRatesData,
    isLoading: isRatesLoading,
    isError: isRatesError,
    refetch: refetchRates,
  } = useShippingRates(
    selectedRegion?.rajaongkirId || '',
    totalWeightGrams,
    Boolean(selectedRegion?.rajaongkirId)
  );

  // Gift options
  const [isGift, setIsGift] = useState<boolean>(true);
  const [giftNote, setGiftNote] = useState<string>(
    'Selamat ulang tahun yang ke-3 adik Kenzo! Semoga tumbuh jadi anak yang sholeh, cerdas, dan gemar membaca. Peluk hangat dari Tante Dina.'
  );
  const [orderNotes, setOrderNotes] = useState<string>('Mohon sertakan pembatas buku BabyShalls.');

  // Coupon & Payment states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponStatusMsg, setCouponStatusMsg] = useState<string>('');
  const [couponErrorMsg, setCouponErrorMsg] = useState<string>('');

  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'cc'>('qris');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const courierOptions = useMemo(() => {
    const apiRates = (shippingRatesData?.rates || []).map((r) => ({
      id: `${r.courierCode}-${r.service}`.toLowerCase().replace(/\s+/g, '-'),
      courierCode: r.courierCode,
      courierService: r.service,
      name: `${r.courierName} (${r.service})`,
      etd: r.etd || '1–3 hari kerja',
      price: r.cost,
      description:
        r.description || `Dikirim dari ${shippingRatesData?.origin || 'Kota Malang'}`,
    }));

    return [
      ...apiRates,
      {
        id: 'pickup',
        courierCode: 'pickup',
        courierService: 'SELF_PICKUP',
        name: 'Ambil Sendiri di Toko (Self Pick-up)',
        etd: 'Siap diambil dalam 1 jam',
        price: 0,
        description: 'Butik BabyShalls, Citraland Puncak Tidar Blok HH-26 Malang',
      },
    ];
  }, [shippingRatesData]);

  useEffect(() => {
    if (courierOptions.length > 0 && !courierOptions.some((c) => c.id === selectedCourier)) {
      setSelectedCourier(courierOptions[0].id);
    }
  }, [courierOptions, selectedCourier]);

  const currentCourier = courierOptions.find((c) => c.id === selectedCourier) || courierOptions[0];
  const shippingFee = currentCourier ? currentCourier.price : 0;
  const giftFee = isGift ? 0 : 0; // Gratis kado
  const calculatedGrandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async () => {
    setCouponErrorMsg('');
    setCouponStatusMsg('');
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponErrorMsg('Masukkan kode kupon terlebih dahulu.');
      return;
    }
    try {
      const res = await validateCouponMutation.mutateAsync({
        code,
        subtotal,
        shippingCost: shippingFee,
      });
      setAppliedCouponCode(res.coupon.code);
      setDiscountAmount(res.discountAmount);
      setCouponStatusMsg(`Kupon ${res.coupon.code} diterapkan (-${formatIDR(res.discountAmount)}).`);
    } catch (err: unknown) {
      const anyErr = err as { response?: { data?: { error?: string } } };
      setAppliedCouponCode(null);
      setDiscountAmount(0);
      setCouponErrorMsg(anyErr?.response?.data?.error || 'Kode kupon tidak valid.');
    }
  };

  const handlePayOrder = async (e: React.FormEvent) => {
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

    if (selectedCourier !== 'pickup' && addressLine.trim().length < 5) {
      setErrorMsg('Mohon masukkan alamat lengkap pengiriman (minimal 5 karakter).');
      return;
    }

    setIsSubmitting(true);
    try {
      const deliveryAddress =
        selectedCourier === 'pickup'
          ? 'Butik BabyShalls Citraland Puncak Tidar Blok HH-26 Malang'
          : `${addressLine.trim()}, ${city.trim()} ${postalCode.trim()}`.trim();

      const idempotencyKey =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? `order-${crypto.randomUUID()}`
          : `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const created = await createOrderMutation.mutateAsync({
        items: items.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
        })),
        shippingAddress: {
          recipientName: recipientName.trim(),
          phone: recipientPhone.trim(),
          email: recipientEmail.trim() || undefined,
          address: deliveryAddress,
          city: city.trim() || 'Kota Malang',
          postalCode: postalCode.trim() || undefined,
        },
        courierCode: currentCourier.courierCode,
        courierService: currentCourier.courierService,
        shippingCost: shippingFee,
        couponCode: appliedCouponCode,
        idempotencyKey,
      });

      const snapshotOrder = {
        orderId: created.orderNumber,
        customerName: recipientName.trim(),
        customerPhone: recipientPhone.trim(),
        customerEmail: recipientEmail.trim(),
        deliveryMethod: currentCourier.name,
        deliveryAddress,
        paymentMethod: 'Midtrans Snap',
        status: 'PENDING',
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
        discountAmount,
        totalAmount: created.grandTotal,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        try {
          const existing = localStorage.getItem('babyshalls_orders');
          const parsed = existing ? JSON.parse(existing) : [];
          parsed.unshift(snapshotOrder);
          localStorage.setItem('babyshalls_orders', JSON.stringify(parsed));
        } catch {
          // pass
        }
      }

      clearCart();

      const snapMode = openMidtransSnap(created.snapToken, created.redirectUrl, {
        onSuccess: () => {
          router.push(`/order-success/${encodeURIComponent(created.orderNumber)}?status=paid`);
        },
        onPending: () => {
          router.push(`/order-success/${encodeURIComponent(created.orderNumber)}?status=pending`);
        },
        onClose: () => {
          router.push(`/order-success/${encodeURIComponent(created.orderNumber)}?status=pending`);
        },
        onError: () => {
          setErrorMsg('Pembayaran Midtrans gagal diproses. Pesanan tersimpan dengan status PENDING di Riwayat Pesanan.');
        },
      });

      if (snapMode === 'dev' || snapMode === 'redirect' || snapMode === 'unavailable') {
        router.push(`/order-success/${encodeURIComponent(created.orderNumber)}?status=pending`);
      }
    } catch (err: unknown) {
      const anyErr = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setErrorMsg(
        anyErr?.response?.data?.error ||
          anyErr?.response?.data?.message ||
          anyErr?.message ||
          'Gagal membuat pesanan. Silakan periksa kembali data Anda.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">
      {/* Header Checkout (Figma Node #167:4652) */}
      <header className="bg-white border-b border-[#F2E4D6] py-4 px-6 sm:px-12 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          {/* Brand Logo (Consistent with Navbar) */}
          <Link href="/" className="inline-block relative py-0.5" aria-label="BabyShalls Home">
            <div className="relative w-[105px] sm:w-[125px] h-[38px] sm:h-[44px]">
              <Image
                src="/BabyShallsLogo 1.PNG"
                alt="Baby Shall's"
                fill
                sizes="(max-width: 640px) 105px, 125px"
                priority
                className="object-contain object-left"
              />
            </div>
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

                <div className="mb-4">
                  <label className="block text-xs text-[#7A5644] font-medium mb-1">
                    Email (Opsional, untuk notifikasi resi &amp; struk)
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="email@anda.com"
                    className="w-full text-xs px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div className="mb-4 relative">
                  <label className="block text-xs text-[#7A5644] font-medium mb-1">
                    Cari Kecamatan / Kota Tujuan (Untuk Cek Ongkir dari Kota Malang) *
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#7A5644] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regionQuery}
                      onFocus={() => setIsRegionDropdownOpen(true)}
                      onChange={(e) => {
                        setRegionQuery(e.target.value);
                        setIsRegionDropdownOpen(true);
                      }}
                      placeholder="Ketik kecamatan atau kota (misal: Sukun, Surabaya, Jakarta)..."
                      className="w-full text-xs pl-8 pr-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                  {isRegionDropdownOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-[#E6D2C0] rounded-[2px] shadow-md">
                      {isRegionsLoading ? (
                        <div className="p-3 text-xs text-[#7A5644] flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mencari wilayah pengiriman...</span>
                        </div>
                      ) : regionOptions.length === 0 ? (
                        <div className="p-3 text-xs text-[#7A5644]">
                          Wilayah tidak ditemukan. Coba kata kunci kecamatan/kota lain.
                        </div>
                      ) : (
                        regionOptions.map((reg) => (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => {
                              setSelectedRegion(reg);
                              setRegionQuery(reg.searchLabel);
                              setCity(reg.cityName);
                              if (reg.postalCode) setPostalCode(reg.postalCode);
                              setIsRegionDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-[#4A2A1C] hover:bg-[#FFF6EA] border-b border-[#F9EAE1] last:border-b-0 cursor-pointer"
                          >
                            <span className="font-medium">{reg.districtName}, {reg.cityName}</span>
                            <span className="text-[#7A5644]"> · {reg.provinceName}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
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

              {/* 2. Pilih Pengiriman (Malang Origin Multi-Courier) */}
              <div className="bg-white p-6 sm:p-7 border border-[#F2E4D6] rounded-[2px]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <h2 className="text-lg font-medium text-[#4A2A1C] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FFF6EA] text-[#B05A26] text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>Pilih Opsi Pengiriman</span>
                  </h2>
                  <span className="text-[11px] text-[#7A5644] bg-[#FFF6EA] border border-[#E6D2C0] px-2.5 py-1 rounded-[2px]">
                    Asal: <strong>{shippingRatesData?.origin || 'Kota Malang'}</strong> · Berat: <strong>{totalWeightGrams}g</strong>
                  </span>
                </div>

                {isRatesLoading && (
                  <div className="mb-3 p-3 bg-[#FFFBF7] border border-[#E6D2C0] rounded-[2px] text-xs text-[#7A5644] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#B05A26]" />
                    <span>Menghitung tarif ongkir dari Kota Malang...</span>
                  </div>
                )}

                {isRatesError && (
                  <div className="mb-3 p-3 bg-[#FEECE8] border border-[#F5C2B8] rounded-[2px] text-xs text-[#C0392B] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Gagal memuat tarif kurir otomatis. Anda tetap bisa memilih Self Pick-up atau coba hitung ulang.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => refetchRates()}
                      className="px-2.5 py-1 bg-white border border-[#C0392B] text-[#C0392B] font-semibold rounded-[2px] hover:bg-[#C0392B] hover:text-white transition-colors shrink-0 cursor-pointer"
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}

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

            {/* Right Column: Ringkasan Pesanan */}
            <CheckoutSummaryCard
              items={items}
              demoProducts={mockProducts.slice(0, 2)}
              onLoadDemoItems={(prods) => {
                prods.forEach((p) => addToCart(p, 1));
              }}
              couponInput={couponInput}
              onCouponInputChange={setCouponInput}
              onApplyCoupon={handleApplyCoupon}
              isCouponPending={validateCouponMutation.isPending}
              couponStatusMsg={couponStatusMsg}
              couponErrorMsg={couponErrorMsg}
              subtotal={subtotal}
              courierName={currentCourier.name}
              shippingFee={shippingFee}
              discountAmount={discountAmount}
              appliedCouponCode={appliedCouponCode}
              isGift={isGift}
              calculatedGrandTotal={calculatedGrandTotal}
              isSubmitting={isSubmitting}
              onPayOrder={handlePayOrder}
            />

          </div>
        </div>
      </main>
    </div>
  );
}
