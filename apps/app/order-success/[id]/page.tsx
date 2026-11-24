'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { Check, Clock } from 'lucide-react';
import { formatIDR } from '@/lib/utils';

interface SavedOrderSnapshot {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  deliveryMethod?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  totalAmount?: number;
  status?: string;
}

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = typeof params?.id === 'string' ? params.id : '';
  const statusParam = (searchParams.get('status') || '').toLowerCase();
  const isPending = statusParam === 'pending';

  const [order, setOrder] = useState<SavedOrderSnapshot | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const list = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
        const found = list.find((o: SavedOrderSnapshot) => o.orderId === orderId);
        if (found) {
          setOrder(found);
        } else {
          setOrder({ orderId });
        }
      } catch {
        setOrder({ orderId });
      }
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      <main className="flex-1 py-14 sm:py-20 flex items-center justify-center px-4 bg-[#FFFDF9]">
        <div className="w-full max-w-[560px] bg-white border border-[#F2E4D6] rounded-[2px] p-8 sm:p-10 flex flex-col items-center text-center shadow-sm">
          <div className="relative w-44 h-44 mb-4">
            <Image
              src="/images/mascot/maskot-lompat-konfeti.png"
              alt={isPending ? 'Order Awaiting Payment' : 'Order Successful'}
              fill
              priority
              className="object-contain"
            />
          </div>

          {isPending ? (
            <div className="inline-flex items-center gap-1.5 bg-[#FFF3D6] text-[#9A6500] text-xs font-semibold px-3 py-1 rounded-[2px] mb-3">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Awaiting Payment (PENDING)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-[#DDF1E5] text-[#2A6E37] text-xs font-semibold px-3 py-1 rounded-[2px] mb-3">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Payment Successful</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] mb-2 tracking-tight">
            {isPending
              ? 'Your order has been recorded!'
              : 'Thank you, your order is received!'}
          </h1>

          <p className="text-sm text-[#7A5644] max-w-md mb-6 leading-relaxed">
            {isPending
              ? 'Payment has not been completed or is awaiting Midtrans confirmation. You can complete payment anytime through Order History in your Account page.'
              : 'We are carefully preparing your books. The automated tracking number will be updated in Order History once the package is handed over to the courier.'}
          </p>

          <div className="w-full bg-[#FFF6EA] border border-[#F2E4D6] rounded-[2px] p-5 text-left mb-6 flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6D2C0]">
              <span className="text-[#7A5644]">Order Number</span>
              <span className="font-semibold text-[#4A2A1C]">{orderId || '-'}</span>
            </div>

            {typeof order?.totalAmount === 'number' && (
              <div className="flex items-center justify-between">
                <span className="text-[#7A5644]">Total Payment</span>
                <span className="font-bold text-[#B05A26] text-sm">
                  {formatIDR(order.totalAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[#7A5644]">Status</span>
              <span className="font-medium text-[#4A2A1C]">
                {isPending ? 'PENDING (Awaiting Payment)' : order?.status || 'PAID'}
              </span>
            </div>

            {order?.deliveryMethod && (
              <div className="flex items-center justify-between">
                <span className="text-[#7A5644]">Shipping</span>
                <span className="font-medium text-[#4A2A1C]">{order.deliveryMethod}</span>
              </div>
            )}

            {order?.deliveryAddress && (
              <div className="pt-2 border-t border-[#E6D2C0]">
                <span className="text-[#7A5644] block mb-0.5">Destination Address</span>
                <span className="font-medium text-[#4A2A1C] line-clamp-2">
                  {order.deliveryAddress}
                </span>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 py-3 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-xs rounded-[2px] transition-colors flex items-center justify-center"
            >
              View Order History
            </Link>

            <Link
              href="/shop"
              className="flex-1 py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium text-xs rounded-[2px] transition-colors flex items-center justify-center shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
