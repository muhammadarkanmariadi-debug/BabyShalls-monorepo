'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Gift,
  ArrowLeft,
  CheckCircle2,
  Ticket,
  Truck,
  MapPin,
  Store,
  ChevronRight,
  Edit3,
  MessageSquareText,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatIDR, formatPhoneInput, formatWeight } from '../../lib/utils';
import { useActiveCoupons, useValidateCoupon, CouponDto } from '../../hooks/useCoupons';
import { useCreateOrder } from '../../hooks/useOrders';
import { useShippingRates, useSearchRegions, RegionOption } from '../../hooks/useShipping';
import { openMidtransSnap } from '../../lib/midtrans-snap';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY, extractApiError } from '../../lib/axios';
import { AutoFillProfileButton } from '../../components/account/AutoFillProfileButton';
import { AccountAuthGate } from '../../components/account/AccountAuthGate';
import {
  CheckoutCourierOption,
  CourierPickerModal,
} from '../../components/checkout/CourierPickerModal';
import { VoucherPickerModal } from '../../components/checkout/VoucherPickerModal';
import { PaymentCountdownBadge } from '../../components/checkout/PaymentCountdownBadge';
import axios from 'axios';
import toast from 'react-hot-toast';

const SAMPLE_COURIERS: CheckoutCourierOption[] = [
  { id: 'wahana-normal', courierCode: 'wahana', courierName: 'Wahana Express', service: 'Normal', etd: '2-4 Hari', cost: 9000 },
  { id: 'jnt-ez', courierCode: 'jnt', courierName: 'J&T Express', service: 'EZ (Reguler)', etd: '1-2 Hari', cost: 18000 },
  { id: 'sicepat-reg', courierCode: 'sicepat', courierName: 'SiCepat', service: 'REG', etd: '1-2 Hari', cost: 17000 },
  { id: 'jne-reg', courierCode: 'jne', courierName: 'JNE', service: 'REG (Reguler)', etd: '2-3 Hari', cost: 19000 },
  { id: 'pos-reg', courierCode: 'pos', courierName: 'POS Indonesia', service: 'Kilat Khusus', etd: '2-3 Hari', cost: 16000 },
];

const FALLBACK_VOUCHERS: CouponDto[] = [
  {
    id: 'fallback-babynew',
    code: 'BABYNEW',
    description: 'Potongan 15% (Maks. Rp 50.000) tanpa minimal belanja',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    maxDiscount: 50000,
    minOrder: 0,
    maxUsage: null,
    usedCount: 0,
    expiresAt: null,
    isActive: true,
  },
  {
    id: 'fallback-malangcozy',
    code: 'MALANGCOZY',
    description: 'Voucher spesial Butik Malang potongan Rp 20.000',
    discountType: 'FIXED_AMOUNT',
    discountValue: 20000,
    maxDiscount: null,
    minOrder: 0,
    maxUsage: null,
    usedCount: 0,
    expiresAt: null,
    isActive: true,
  },
  {
    id: 'fallback-ongkirhemat',
    code: 'ONGKIRHEMAT',
    description: 'Potongan subsidi kurir KiriminAja Rp 10.000',
    discountType: 'SHIPPING_SUBSIDY',
    discountValue: 10000,
    maxDiscount: null,
    minOrder: 0,
    maxUsage: null,
    usedCount: 0,
    expiresAt: null,
    isActive: true,
  },
];

export default function CheckoutPage() {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    setIsAuthenticated(Boolean(token));
    setCheckedAuth(true);
  }, []);

  const { items, totalItems, subtotal, totalWeightInGrams, clearCart } = useCart();
  const { data: apiVouchers } = useActiveCoupons();
  const validateCouponMutation = useValidateCoupon();
  const createOrderMutation = useCreateOrder();
  const availableVouchers = apiVouchers && apiVouchers.length > 0 ? apiVouchers : FALLBACK_VOUCHERS;

  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lowokwaru, Kota Malang, Jawa Timur');
  const [postalCode, setPostalCode] = useState('65141');
  const [isEditingAddress, setIsEditingAddress] = useState(true);

  const [regionQuery, setRegionQuery] = useState('');
  const [debouncedRegionQuery, setDebouncedRegionQuery] = useState('');
  const [showRegionList, setShowRegionList] = useState(false);
  const [destinationId, setDestinationId] = useState('46757');

  const { data: regionOptions = [] } = useSearchRegions(debouncedRegionQuery);
  const { data: shippingRatesData, isFetching: isFetchingShipping } = useShippingRates(
    destinationId,
    totalWeightInGrams,
    isAuthenticated && items.length > 0
  );

  const [courierOptions, setCourierOptions] = useState<CheckoutCourierOption[]>(SAMPLE_COURIERS);
  const [selectedCourier, setSelectedCourier] = useState<CheckoutCourierOption>(SAMPLE_COURIERS[0]);
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const [isGiftWrapping, setIsGiftWrapping] = useState(true);
  const [giftNote, setGiftNote] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRegionQuery(regionQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [regionQuery]);

  useEffect(() => {
    if (!shippingRatesData?.rates || shippingRatesData.rates.length === 0) return;
    const mapped: CheckoutCourierOption[] = shippingRatesData.rates.map((r, idx) => ({
      id: `${r.courierCode}-${r.service}-${idx}`,
      courierCode: r.courierCode,
      courierName: r.courierName,
      service: r.service,
      etd: r.etd,
      cost: r.cost,
    }));
    setCourierOptions(mapped);
    setSelectedCourier(mapped[0]);
  }, [shippingRatesData]);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDto | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('BS-882419');
  const [paymentSnapToken, setPaymentSnapToken] = useState<string | null>(null);
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string | null>(null);
  const [paymentExpiresAt, setPaymentExpiresAt] = useState<string | null>(null);
  const [paymentStatusNote, setPaymentStatusNote] = useState<'PENDING' | 'PAID'>('PENDING');
  const [checkoutIdempotencyKey, setCheckoutIdempotencyKey] = useState<string>('');

  // Rotate Idempotency-Key whenever checkout payload inputs change so a new payload never hits 409 IDEMPOTENCY_KEY_REUSED
  useEffect(() => {
    const nextKey =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `ck-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setCheckoutIdempotencyKey(nextKey);
  }, [
    items,
    recipientName,
    phone,
    address,
    city,
    postalCode,
    selectedCourier.courierCode,
    selectedCourier.courierName,
    selectedCourier.service,
    selectedCourier.cost,
    appliedCoupon?.code,
  ]);

  if (!checkedAuth) {
    return <div className="min-h-[75vh] bg-white" />;
  }

  if (!isAuthenticated) {
    return <AccountAuthGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply ?? couponInput).trim().toUpperCase();
    setCouponError('');
    if (!code) {
      const msg = 'Masukkan kode kupon terlebih dahulu.';
      setCouponError(msg);
      toast.error(msg);
      return;
    }

    try {
      const result = await validateCouponMutation.mutateAsync({
        code,
        subtotal,
        shippingCost: selectedCourier.cost,
      });
      setAppliedCoupon(result.coupon);
      setDiscountAmount(result.discountAmount);
      setCouponInput(result.coupon.code);
      toast.success(`Kupon ${result.coupon.code} berhasil diterapkan!`);
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        const fallback = FALLBACK_VOUCHERS.find((v) => v.code === code);
        if (fallback) {
          let calc = 0;
          if (fallback.discountType === 'PERCENTAGE') {
            const raw = Math.round((subtotal * fallback.discountValue) / 100);
            calc = fallback.maxDiscount ? Math.min(raw, fallback.maxDiscount) : raw;
          } else if (fallback.discountType === 'SHIPPING_SUBSIDY') {
            calc = Math.min(fallback.discountValue, selectedCourier.cost);
          } else {
            calc = Math.min(fallback.discountValue, subtotal);
          }
          setAppliedCoupon(fallback);
          setDiscountAmount(calc);
          setCouponInput(fallback.code);
          toast.success(`Kupon ${fallback.code} berhasil diterapkan!`);
          return;
        }
      }
      setAppliedCoupon(null);
      setDiscountAmount(0);
      const errMsg = extractApiError(err, 'Kode kupon tidak valid atau sudah kedaluwarsa.');
      setCouponError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput('');
    setCouponError('');
  };

  const grandTotal = Math.max(0, subtotal + selectedCourier.cost - discountAmount);
  const hasCompleteAddress =
    recipientName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    address.trim().length >= 5 &&
    city.trim().length >= 2;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = recipientName.trim();
    const cleanPhone = phone.replace(/[\s\-().]/g, '');
    const cleanAddress = address.trim();
    const cleanCity = city.trim();
    const cleanPostal = postalCode.trim();

    if (items.length === 0) {
      toast.error('Keranjang belanja Anda masih kosong.');
      return;
    }
    if (cleanName.length < 2) {
      setIsEditingAddress(true);
      toast.error('Nama penerima minimal 2 karakter.');
      return;
    }
    if (!/^(\+62|62|0)[2-9]\d{7,12}$/.test(cleanPhone)) {
      setIsEditingAddress(true);
      toast.error('Nomor telepon/WhatsApp tidak valid (contoh: 081234567890).');
      return;
    }
    if (cleanAddress.length < 5) {
      setIsEditingAddress(true);
      toast.error('Alamat pengiriman minimal 5 karakter.');
      return;
    }
    if (cleanCity.length < 2) {
      setIsEditingAddress(true);
      toast.error('Kota/Kabupaten tujuan wajib diisi.');
      return;
    }
    if (cleanPostal && !/^\d{5}$/.test(cleanPostal)) {
      setIsEditingAddress(true);
      toast.error('Kode pos harus terdiri dari 5 digit angka.');
      return;
    }

    try {
      const created = await createOrderMutation.mutateAsync({
        items: items.map(({ product, quantity }) => ({
          productId: product.slug || product.id,
          title: product.title,
          price: product.price,
          quantity,
        })),
        shippingAddress: {
          recipientName: cleanName,
          phone: cleanPhone,
          address: cleanAddress,
          city: cleanCity,
          postalCode: cleanPostal,
        },
        courierCode: selectedCourier.courierCode || selectedCourier.courierName,
        courierService: selectedCourier.service,
        shippingCost: selectedCourier.cost,
        couponCode: appliedCoupon?.code ?? null,
        idempotencyKey: checkoutIdempotencyKey || crypto.randomUUID(),
      });

      setOrderNumber(created.orderNumber);
      setPaymentSnapToken(created.snapToken || null);
      setPaymentRedirectUrl(created.redirectUrl || null);
      setPaymentExpiresAt(
        created.paymentExpiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      );
      setPaymentStatusNote('PENDING');
      setOrderCompleted(true);
      clearCart();
      toast.success(`Pesanan ${created.orderNumber} berhasil dibuat!`);

      if (created.snapToken || created.redirectUrl) {
        openMidtransSnap(created.snapToken, created.redirectUrl, {
          onSuccess: () => {
            setPaymentStatusNote('PAID');
            toast.success('Pembayaran berhasil diterima!');
          },
          onPending: () => {
            toast('Menunggu pembayaran Anda. Anda dapat melanjutkan pembayaran kapan saja di Akun Saya.');
          },
          onError: () => {
            toast.error('Pembayaran gagal. Silakan coba lagi melalui tombol Bayar Sekarang atau di Akun Saya.');
          },
          onClose: () => {
            toast('Popup pembayaran ditutup. Klik "Bayar Sekarang via Midtrans" untuk melanjutkan.');
          },
        });
      }
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memproses pesanan. Periksa kembali data Anda.'));
    }
  };

  if (orderCompleted) {
    return (
      <div className="py-16 lg:py-24 bg-white min-h-screen">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E9F3E4] text-[#1E543B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E543B]">
                Pesanan Berhasil Dibuat
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
                Terima Kasih, {recipientName || 'Bunda'}!
              </h1>
              <p className="text-sm text-[#4A4A4A] mt-2">
                Nomor Pesanan: <strong className="text-[#1A1A1A]">{orderNumber}</strong>
              </p>
            </div>
            <div className="bg-[#FFF8EF] rounded-2xl p-4 text-left text-xs space-y-1.5 border border-[#F3E5D4]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Kurir Pengiriman:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {selectedCourier.courierName} ({selectedCourier.service})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Pembayaran:</span>
                <span className="font-bold text-[#1E543B]">Midtrans Snap (QRIS / VA)</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#E5E7EB]">
                <span className="text-[#6B7280]">Total Tagihan:</span>
                <span className="font-extrabold text-[#D9744A]">{formatIDR(grandTotal)}</span>
              </div>
            </div>
            {paymentStatusNote !== 'PAID' && paymentExpiresAt && (
              <PaymentCountdownBadge expiresAt={paymentExpiresAt} variant="banner" />
            )}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {paymentStatusNote !== 'PAID' && (paymentSnapToken || paymentRedirectUrl) && (
                <button
                  type="button"
                  onClick={() =>
                    openMidtransSnap(paymentSnapToken, paymentRedirectUrl, {
                      onSuccess: () => {
                        setPaymentStatusNote('PAID');
                        toast.success('Pembayaran berhasil diterima!');
                      },
                      onPending: () => toast('Menunggu pembayaran Anda.'),
                      onError: () => toast.error('Pembayaran gagal, silakan coba lagi.'),
                    })
                  }
                  className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#D9744A] text-white font-bold text-sm hover:bg-[#c5633b] transition-colors"
                >
                  Bayar Sekarang via Midtrans
                </button>
              )}
              <Link
                href="/account"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#1A1A1A] text-white font-bold text-sm"
              >
                Lacak di Akun Saya
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-white border border-[#E5E7EB] text-[#1A1A1A] font-bold text-sm"
              >
                Belanja Lagi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-28 lg:pb-16">
      {/* Shopee-style Top Checkout Bar */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#D9744A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
            <span className="h-4 w-px bg-[#E5E7EB]" />
            <h1 className="text-lg sm:text-xl font-extrabold text-[#1A1A1A] tracking-tight">
              Checkout
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E543B]">
            <ShieldCheck className="w-4 h-4" />
            <span>Transaksi Aman Midtrans</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
        {items.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center space-y-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Keranjang belanja masih kosong</h2>
            <p className="text-sm text-[#6B7280]">
              Pilih buku atau mainan kayu favorit si kecil terlebih dahulu sebelum melanjutkan checkout.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center min-h-[44px] px-7 rounded-full bg-[#D9744A] text-white font-bold text-sm hover:bg-[#c5633b] transition-colors"
            >
              Jelajahi Katalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            {/* 1. SHOPEE-STYLE ADDRESS CARD WITH ENVELOPE STRIPE */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
              <div
                className="h-1 w-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #D9744A 0 14px, transparent 14px 22px, #1E543B 22px 36px, transparent 36px 44px)',
                }}
              />
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#D9744A]">
                    <MapPin className="w-5 h-5" />
                    <h2 className="text-base font-extrabold text-[#1A1A1A]">Alamat Pengiriman</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <AutoFillProfileButton
                      onAutoFill={(user) => {
                        if (user.parentName || user.name) setRecipientName(user.parentName || user.name);
                        if (user.phone) setPhone(formatPhoneInput(user.phone));
                      }}
                    />
                    {hasCompleteAddress && (
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#D9744A] hover:underline"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditingAddress ? 'Tutup Form' : 'Ubah'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isEditingAddress && hasCompleteAddress ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm bg-[#FFF8EF]/60 border border-[#F3E5D4] rounded-xl p-4">
                    <div className="space-y-1">
                      <div className="font-extrabold text-[#1A1A1A]">
                        {recipientName}{' '}
                        <span className="font-semibold text-[#6B7280] ml-1">({phone})</span>
                      </div>
                      <p className="text-xs text-[#4A4A4A]">
                        {address}, {city} {postalCode}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E9F3E4] text-[#1E543B] text-[11px] font-bold self-start sm:self-center">
                      Utama
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientName('Bunda Rania Putri');
                          setPhone('0812-3456-7890');
                          setAddress('Jl. Soekarno Hatta Indah No. 8, Lowokwaru');
                          setCity('Lowokwaru, Kota Malang, Jawa Timur');
                          setDestinationId('46757');
                          setPostalCode('65141');
                          setIsEditingAddress(false);
                        }}
                        className="px-3 py-1 rounded-full bg-[#E9F3E4] text-[#1E543B] text-[11px] font-bold hover:opacity-90"
                      >
                        Pakai: Rumah Utama (Malang)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientName('Ibu Dewi Santoso');
                          setPhone('0813-9876-5432');
                          setAddress('Jl. Dharmawangsa No. 45, Gubeng');
                          setCity('Gubeng, Kota Surabaya, Jawa Timur');
                          setPostalCode('60286');
                        }}
                        className="px-3 py-1 rounded-full bg-[#FAF4E8] text-[#1A1A1A] text-[11px] font-bold hover:opacity-90"
                      >
                        Pakai: Rumah Orang Tua (Surabaya)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                          Nama Penerima *
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Contoh: Bunda Rania"
                          className="w-full h-[42px] px-3.5 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                          placeholder="0812-3456-7890"
                          maxLength={18}
                          className="w-full h-[42px] px-3.5 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
                        className="w-full p-3 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="relative">
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                          Kecamatan / Kota Tujuan *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onFocus={() => setShowRegionList(true)}
                          onBlur={() => setTimeout(() => setShowRegionList(false), 180)}
                          onChange={(e) => {
                            setCity(e.target.value);
                            setRegionQuery(e.target.value);
                            setShowRegionList(true);
                          }}
                          placeholder="Ketik kecamatan atau kota tujuan..."
                          className="w-full h-[42px] px-3.5 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                        {showRegionList && regionOptions.length > 0 && (
                          <div className="absolute z-20 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-[#E5E7EB] rounded-xl shadow-lg">
                            {regionOptions.map((reg: RegionOption) => (
                              <button
                                key={reg.id}
                                type="button"
                                onMouseDown={() => {
                                  setCity(reg.searchLabel);
                                  setDestinationId(reg.rajaongkirId);
                                  if (reg.postalCode) setPostalCode(reg.postalCode);
                                  setShowRegionList(false);
                                }}
                                className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-[#FAF4E8] border-b border-[#F3F4F6] last:border-b-0"
                              >
                                <div className="font-bold text-[#1A1A1A]">{reg.searchLabel}</div>
                                {reg.postalCode && (
                                  <div className="text-[11px] text-[#6B7280]">
                                    Kode Pos: {reg.postalCode}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                          Kode Pos *
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="65141"
                          className="w-full h-[42px] px-3.5 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 2. SHOPEE-STYLE PRODUCT TABLE + MESSAGE + SHIPPING OPTION */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
              {/* Store Header */}
              <div className="px-5 sm:px-6 py-3.5 border-b border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2 bg-[#FFFDF9]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#D9744A] text-white text-[10px] font-extrabold uppercase tracking-wide">
                    Official
                  </span>
                  <Store className="w-4 h-4 text-[#1E543B]" />
                  <span className="text-sm font-extrabold text-[#1A1A1A]">
                    BabyShalls Boutique • Kota Malang
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  Berat total: <strong className="text-[#1A1A1A]">{formatWeight(totalWeightInGrams)}</strong>
                </span>
              </div>

              {/* Desktop Table Header */}
              <div className="hidden md:grid md:grid-cols-12 px-6 py-2.5 text-xs font-bold text-[#6B7280] border-b border-[#F3F4F6]">
                <div className="col-span-6">Produk Dipesan</div>
                <div className="col-span-2 text-right">Harga Satuan</div>
                <div className="col-span-2 text-center">Jumlah</div>
                <div className="col-span-2 text-right">Subtotal Produk</div>
              </div>

              {/* Product Rows */}
              <div className="divide-y divide-[#F3F4F6]">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="px-5 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:items-center"
                  >
                    <div className="md:col-span-6 flex items-center gap-3.5 min-w-0">
                      <img
                        src={product.images?.[0] || '/images/placeholder-product.png'}
                        alt={product.title}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-[#FFF8EF] flex-shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#6B7280]">
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF4E8] text-[#502E1E] font-semibold">
                            {product.category}
                          </span>
                          <span>• {formatWeight(product.weightInGrams * quantity)}</span>
                        </div>
                        <div className="md:hidden flex items-center justify-between pt-1 text-xs">
                          <span className="font-bold text-[#D9744A]">
                            {formatIDR(product.price)}
                          </span>
                          <span className="text-[#6B7280]">x{quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-right text-xs font-semibold text-[#4A4A4A]">
                      {formatIDR(product.price)}
                    </div>
                    <div className="hidden md:block md:col-span-2 text-center text-xs font-bold text-[#1A1A1A]">
                      {quantity}
                    </div>
                    <div className="hidden md:block md:col-span-2 text-right text-sm font-extrabold text-[#1A1A1A]">
                      {formatIDR(product.price * quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shopee-style Split Row: Pesan/Gift Wrap (Left) + Opsi Pengiriman (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-t border-dashed border-[#E5E7EB] bg-[#FFF8EF]/45">
                {/* Left: Gift Wrap & Message */}
                <div className="md:col-span-6 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-dashed border-[#E5E7EB] space-y-3">
                  <label className="flex items-center justify-between gap-2 cursor-pointer">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                      <Gift className="w-4 h-4 text-[#1E543B]" />
                      Free Gift Wrapping &amp; Kartu Ucapan
                    </span>
                    <input
                      type="checkbox"
                      checked={isGiftWrapping}
                      onChange={(e) => setIsGiftWrapping(e.target.checked)}
                      className="w-4 h-4 accent-[#1E543B]"
                    />
                  </label>
                  <div className="flex items-start gap-2">
                    <MessageSquareText className="w-4 h-4 text-[#6B7280] mt-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder={
                        isGiftWrapping
                          ? 'Pesan / ucapan kartu kado (opsional)...'
                          : 'Tinggalkan pesan untuk penjual (opsional)...'
                      }
                      className="w-full h-[38px] px-3 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                </div>

                {/* Right: Shipping Option Selector */}
                <div className="md:col-span-6 p-5 sm:p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E543B]">
                      <Truck className="w-4 h-4" />
                      <span>Opsi Pengiriman</span>
                      {isFetchingShipping && (
                        <span className="text-[11px] font-semibold text-[#D9744A]">
                          (Menghitung...)
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-extrabold text-[#1A1A1A] truncate">
                      {selectedCourier.courierName} • {selectedCourier.service}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      Estimasi tiba {selectedCourier.etd}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-extrabold text-[#1A1A1A]">
                      {formatIDR(selectedCourier.cost)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCourierModalOpen(true)}
                      className="inline-flex items-center gap-0.5 text-xs font-extrabold text-[#D9744A] hover:underline"
                    >
                      <span>Ubah</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Store Subtotal Footer */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-[#F3F4F6] bg-[#FFFDF9] flex items-center justify-end gap-3 text-sm">
                <span className="text-[#6B7280] text-xs">
                  Total Pesanan ({totalItems} Produk):
                </span>
                <span className="text-base font-extrabold text-[#D9744A]">
                  {formatIDR(subtotal + selectedCourier.cost)}
                </span>
              </div>
            </section>

            {/* 3. SHOPEE-STYLE VOUCHER ROW */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Ticket className="w-5 h-5 text-[#D9744A]" />
                <span className="text-sm font-extrabold text-[#1A1A1A]">Voucher BabyShalls</span>
              </div>

              <div className="flex items-center gap-3">
                {appliedCoupon && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#E9F3E4] text-[#1E543B] text-xs font-extrabold">
                    {appliedCoupon.code} (-{formatIDR(discountAmount)})
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#D9744A] hover:underline"
                >
                  <span>{appliedCoupon ? 'Ganti Voucher' : 'Gunakan / Masukkan Kode'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* 4. SHOPEE-STYLE PAYMENT METHOD & SUMMARY */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
              {/* Payment Method Row */}
              <div className="px-5 sm:px-6 py-4 border-b border-[#F3F4F6] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#1E543B]" />
                  <span className="text-sm font-extrabold text-[#1A1A1A]">Metode Pembayaran</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#D9744A]/40 text-xs font-bold text-[#1A1A1A]">
                    Midtrans Snap (QRIS / Virtual Account / Kartu)
                  </span>
                  <img src="/images/logos/midtrans.svg" alt="Midtrans" className="h-4 w-auto" />
                </div>
              </div>

              {/* Right-aligned Shopee Summary Breakdown */}
              <div className="px-5 sm:px-6 py-5 bg-[#FFFDF9] flex flex-col items-end space-y-2.5">
                <div className="w-full sm:w-80 space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Subtotal untuk Produk</span>
                    <span className="font-bold text-[#1A1A1A]">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Subtotal Pengiriman ({selectedCourier.courierName})</span>
                    <span className="font-bold text-[#1A1A1A]">
                      {formatIDR(selectedCourier.cost)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#1E543B] font-semibold">
                      <span>Total Diskon Voucher</span>
                      <span>-{formatIDR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-[#E5E7EB]">
                    <span className="text-sm font-bold text-[#1A1A1A]">Total Pembayaran</span>
                    <span className="text-2xl font-extrabold text-[#D9744A]">
                      {formatIDR(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Bottom CTA Bar */}
              <div className="hidden lg:flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] bg-white">
                <p className="text-xs text-[#6B7280]">
                  Dengan menekan tombol Buat Pesanan, Anda menyetujui syarat &amp; ketentuan BabyShalls.
                </p>
                <button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="min-h-[46px] px-10 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-extrabold text-sm transition-colors cursor-pointer"
                >
                  {createOrderMutation.isPending ? 'Memproses Pesanan...' : 'Buat Pesanan'}
                </button>
              </div>
            </section>

            {/* Mobile Sticky Bottom Checkout Bar (Shopee Mobile Style) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="text-[11px] text-[#6B7280]">Total Pembayaran</div>
                <div className="text-lg font-extrabold text-[#D9744A] leading-tight">
                  {formatIDR(grandTotal)}
                </div>
              </div>
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="min-h-[44px] px-7 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-extrabold text-sm transition-colors"
              >
                {createOrderMutation.isPending ? 'Memproses...' : 'Buat Pesanan'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Shopee-style Modals */}
      <CourierPickerModal
        isOpen={isCourierModalOpen}
        onClose={() => setIsCourierModalOpen(false)}
        couriers={courierOptions}
        selectedCourier={selectedCourier}
        onSelect={setSelectedCourier}
        totalWeightInGrams={totalWeightInGrams}
        isFetching={isFetchingShipping}
      />

      <VoucherPickerModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        couponInput={couponInput}
        onCouponInputChange={setCouponInput}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        couponError={couponError}
        isValidating={validateCouponMutation.isPending}
        availableVouchers={availableVouchers}
      />
    </div>
  );
}
