'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Star, CreditCard, Search, X, ArrowUpDown, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { AccountOrder, useOrderSnapToken, useSubmitReview } from '../../hooks/useAccount';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { openMidtransSnap } from '../../lib/midtrans-snap';
import { PaymentCountdownBadge } from '../checkout/PaymentCountdownBadge';
import { OrderTrackingModal } from './OrderTrackingModal';

type OrderSortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const STATUS_LABELS: Record<AccountOrder['status'], string> = {
  PENDING_PAYMENT: 'Belum Bayar',
  PAID: 'Sudah Dibayar',
  PROCESSING: 'Sedang Dikemas',
  SHIPPED: 'Sedang Dikirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const FILTER_TABS: readonly ('ALL' | AccountOrder['status'])[] = [
  'ALL',
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
];

function getFirstProductImage(images: unknown): string | null {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string' && images[0].trim()) {
    return images[0];
  }
  return null;
}

export function AccountOrdersTab({ orders, isLoading }: { orders: AccountOrder[]; isLoading: boolean }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | AccountOrder['status']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<OrderSortOption>('newest');
  const [trackingOrder, setTrackingOrder] = useState<{
    orderNumber: string;
    courier: string;
    waybillNumber: string;
  } | null>(null);
  const [reviewDraft, setReviewDraft] = useState<Record<string, { rating: number; comment: string }>>({});
  const submitReviewMutation = useSubmitReview();
  const orderSnapTokenMutation = useOrderSnapToken();

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    for (const order of orders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const filteredAndSorted = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const list = orders.filter((order) => {
      if (filter !== 'ALL' && order.status !== filter) return false;
      if (!normalizedQuery) return true;

      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(normalizedQuery);
      const matchesWaybill = (order.waybillNumber || '').toLowerCase().includes(normalizedQuery);
      const matchesCourier = (order.courierCode || '').toLowerCase().includes(normalizedQuery);
      const matchesProduct = order.items.some((item) =>
        item.product.name.toLowerCase().includes(normalizedQuery)
      );

      return matchesOrderNumber || matchesWaybill || matchesCourier || matchesProduct;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return b.grandTotal - a.grandTotal;
      }
      if (sortBy === 'lowest') {
        return a.grandTotal - b.grandTotal;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, filter, searchQuery, sortBy]);

  const handlePayOrder = async (order: AccountOrder) => {
    try {
      const data = await orderSnapTokenMutation.mutateAsync(order.orderNumber);
      openMidtransSnap(data.snapToken, data.redirectUrl, {
        onSuccess: () => {
          toast.success(`Pembayaran ${order.orderNumber} berhasil!`);
          qc.invalidateQueries({ queryKey: ['account-orders'] });
        },
        onPending: () => toast('Menunggu pembayaran Anda.'),
        onError: () => toast.error('Pembayaran gagal, silakan coba lagi.'),
      });
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal membuka halaman pembayaran Midtrans.'));
    }
  };

  const handleReviewSubmit = async (orderItemId: string) => {
    const draft = reviewDraft[orderItemId] || { rating: 5, comment: '' };
    if (draft.comment.trim().length < 3) {
      toast.error('Tulis ulasan minimal 3 karakter.');
      return;
    }
    try {
      await submitReviewMutation.mutateAsync({
        orderItemId,
        rating: draft.rating,
        comment: draft.comment.trim(),
      });
      toast.success('Ulasan terverifikasi berhasil dikirim.');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengirim ulasan.'));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-xs text-[#6B7280]">
        Memuat pesanan...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto border-b border-[#F3F4F6]">
          <div className="flex min-w-max">
            {FILTER_TABS.map((tab) => {
              const count = statusCounts[tab] || 0;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`flex-1 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                    filter === tab
                      ? 'border-[#1E543B] text-[#1E543B] bg-[#FAF4E8]/40'
                      : 'border-transparent text-[#4A4A4A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab === 'ALL' ? 'Semua' : STATUS_LABELS[tab]}
                  {count > 0 && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                        filter === tab ? 'bg-[#1E543B] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 flex flex-col sm:flex-row gap-2.5 bg-[#FAFAFA]/60">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor pesanan, nama produk, atau nomor resi..."
              className="w-full h-9 pl-9 pr-8 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1E543B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4A4A4A]"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative sm:w-52 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as OrderSortOption)}
              aria-label="Urutkan pesanan"
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1E543B]"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highest">Total Tertinggi</option>
              <option value="lowest">Total Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-3">
          <Package className="w-10 h-10 text-[#9CA3AF] mx-auto" />
          <p className="text-xs font-bold text-[#4A4A4A]">
            {orders.length === 0
              ? 'Belum ada pesanan pada akun Anda.'
              : 'Tidak ada pesanan yang cocok dengan filter atau pencarian.'}
          </p>
          {orders.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setFilter('ALL');
                setSearchQuery('');
              }}
              className="inline-flex items-center px-5 h-10 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] text-xs font-bold hover:bg-[#F8FAFC]"
            >
              Reset Filter & Pencarian
            </button>
          ) : (
            <Link
              href="/catalog"
              className="inline-flex items-center px-5 h-10 rounded-full bg-[#1A1A1A] text-white text-xs font-bold"
            >
              Mulai Belanja
            </Link>
          )}
        </div>
      ) : (
        filteredAndSorted.map((order) => (
          <div key={order.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F3F4F6]">
              <div>
                <span className="font-extrabold text-[#1A1A1A]">{order.orderNumber}</span>
                <span className="text-[#6B7280] ml-2">
                  • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {order.waybillNumber && (
                  <>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] font-mono font-bold">
                      <Truck className="w-3 h-3 text-[#1E543B]" /> {order.waybillNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTrackingOrder({
                          orderNumber: order.orderNumber,
                          courier: order.courierCode || 'jne',
                          waybillNumber: order.waybillNumber!,
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E543B] text-white font-bold hover:bg-[#17422e] transition-colors"
                    >
                      <MapPin className="w-3 h-3" /> Lacak Resi
                    </button>
                  </>
                )}
                <span className="px-3 py-1 rounded-full bg-[#FDF0B8] font-bold text-[#1A1A1A]">
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {order.items.map((item) => {
                const thumbUrl = getFirstProductImage(item.product.images);
                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB] bg-[#FAF4E8] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl border border-[#E5E7EB] bg-[#FAF4E8] flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-[#9CA3AF]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-[#1A1A1A] line-clamp-2">{item.product.name}</p>
                          <p className="text-[#6B7280] mt-0.5">
                            {formatIDR(item.price)} x{item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#1A1A1A] shrink-0">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>

                    {order.status === 'COMPLETED' && !item.review && (
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex flex-col sm:flex-row gap-2">
                        <select
                          value={reviewDraft[item.id]?.rating ?? 5}
                          onChange={(e) =>
                            setReviewDraft((prev) => ({
                              ...prev,
                              [item.id]: { rating: Number(e.target.value), comment: prev[item.id]?.comment ?? '' },
                            }))
                          }
                          className="h-9 px-2.5 rounded-lg border border-[#E5E7EB] bg-white font-bold"
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {r} Bintang
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={reviewDraft[item.id]?.comment ?? ''}
                          onChange={(e) =>
                            setReviewDraft((prev) => ({
                              ...prev,
                              [item.id]: { rating: prev[item.id]?.rating ?? 5, comment: e.target.value },
                            }))
                          }
                          placeholder="Tulis ulasan Anda..."
                          className="flex-1 h-9 px-3 rounded-lg border border-[#E5E7EB] bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleReviewSubmit(item.id)}
                          className="h-9 px-4 rounded-lg bg-[#1E543B] text-white font-bold inline-flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" /> Kirim Ulasan
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2 font-extrabold text-[#1A1A1A]">
              <span>Total Pembayaran ({order.courierCode || 'Kurir'})</span>
              <div className="flex items-center gap-3 flex-wrap">
                {order.status === 'PENDING_PAYMENT' && (
                  <>
                    <PaymentCountdownBadge
                      expiresAt={new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000)}
                      variant="pill"
                    />
                    <button
                      type="button"
                      disabled={orderSnapTokenMutation.isPending}
                      onClick={() => handlePayOrder(order)}
                      className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-[#D9744A] text-white text-xs font-bold hover:bg-[#c5633b] transition-colors disabled:opacity-60"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{orderSnapTokenMutation.isPending ? 'Memuat...' : 'Bayar Sekarang'}</span>
                    </button>
                  </>
                )}
                <span className="text-sm">{formatIDR(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        ))
      )}

      {trackingOrder && (
        <OrderTrackingModal
          orderNumber={trackingOrder.orderNumber}
          courier={trackingOrder.courier}
          waybillNumber={trackingOrder.waybillNumber}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
}
