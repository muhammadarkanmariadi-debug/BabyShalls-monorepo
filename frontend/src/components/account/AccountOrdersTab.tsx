'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Star, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { AccountOrder, useOrderSnapToken, useSubmitReview } from '../../hooks/useAccount';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { openMidtransSnap } from '../../lib/midtrans-snap';
import { PaymentCountdownBadge } from '../checkout/PaymentCountdownBadge';

const STATUS_LABELS: Record<AccountOrder['status'], string> = {
  PENDING_PAYMENT: 'Belum Bayar',
  PAID: 'Sudah Dibayar',
  PROCESSING: 'Sedang Dikemas',
  SHIPPED: 'Sedang Dikirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export function AccountOrdersTab({ orders, isLoading }: { orders: AccountOrder[]; isLoading: boolean }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | AccountOrder['status']>('ALL');
  const [reviewDraft, setReviewDraft] = useState<Record<string, { rating: number; comment: string }>>({});
  const submitReviewMutation = useSubmitReview();
  const orderSnapTokenMutation = useOrderSnapToken();

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

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

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
    return <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-xs text-[#6B7280]">Memuat pesanan...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-x-auto">
        <div className="flex min-w-max">
          {(['ALL', 'PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`flex-1 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap ${filter === tab
                  ? 'border-[#1E543B] text-[#1E543B] bg-[#FAF4E8]/40'
                  : 'border-transparent text-[#4A4A4A]'
                }`}
            >
              {tab === 'ALL' ? 'Semua' : STATUS_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-3">
          <Package className="w-10 h-10 text-[#9CA3AF] mx-auto" />
          <p className="text-xs font-bold text-[#4A4A4A]">Belum ada pesanan pada kategori ini.</p>
          <Link
            href="/catalog"
            className="inline-flex items-center px-5 h-10 rounded-full bg-[#1A1A1A] text-white text-xs font-bold"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        filtered.map((order) => (
          <div key={order.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F3F4F6]">
              <div>
                <span className="font-extrabold text-[#1A1A1A]">{order.orderNumber}</span>
                <span className="text-[#6B7280] ml-2">
                  • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {order.waybillNumber && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] font-mono font-bold">
                    <Truck className="w-3 h-3 text-[#1E543B]" /> {order.waybillNumber}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#FDF0B8] font-bold text-[#1A1A1A]">
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#1A1A1A]">{item.product.name}</span>
                      <span className="text-[#6B7280] ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-[#1A1A1A]">{formatIDR(item.price * item.quantity)}</span>
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
              ))}
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
    </div>
  );
}

