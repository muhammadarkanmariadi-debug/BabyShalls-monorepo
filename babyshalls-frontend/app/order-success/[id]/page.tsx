'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { formatIDR } from '@/data/mockProducts';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = typeof params?.id === 'string' ? params.id : '';
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const list = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
        const found = list.find((o: any) => o.orderId === orderId);
        if (found) {
          setOrder(found);
        } else {
          // Fallback order info
          setOrder({
            orderId,
            customerName: 'Dina Permata',
            customerPhone: '0812-3456-7890',
            deliveryMethod: 'JNE Reguler',
            deliveryAddress: 'Jl. Puncak Tidar No. 18, RT 02 / RW 04, Kota Malang 65146',
            paymentMethod: 'QRIS Instan (BCA / GoPay)',
            totalAmount: 183000,
            status: 'Pembayaran Berhasil',
          });
        }
      } catch {
        // fallback
      }
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      {/* Main Success Container (Figma Node #167:6049) */}
      <main className="flex-1 py-14 sm:py-20 flex items-center justify-center px-4 bg-[#FFFDF9]">
        <div className="w-full max-w-[560px] bg-white border border-[#F2E4D6] rounded-[2px] p-8 sm:p-10 flex flex-col items-center text-center shadow-sm">
          
          {/* Mascot Jumping with Confetti (Figma Node #167:6248) */}
          <div className="relative w-44 h-44 mb-4">
            <Image
              src="/images/mascot/maskot-lompat-konfeti.png"
              alt="Pesanan Berhasil"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Badge Pembayaran Berhasil */}
          <div className="inline-flex items-center gap-1.5 bg-[#DDF1E5] text-[#2A6E37] text-xs font-semibold px-3 py-1 rounded-[2px] mb-3">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Pembayaran berhasil</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] mb-2 tracking-tight">
            Terima kasih, pesananmu diterima!
          </h1>

          {/* Subheading */}
          <p className="text-sm text-[#7A5644] max-w-md mb-6 leading-relaxed">
            Kami sedang menyiapkan bukumu dengan teliti. Nomor resi otomatis akan diperbarui di menu Riwayat Pesanan setelah paket diserahkan ke kurir.
          </p>

          {/* Order Details Summary Box (Figma Node #167:6057) */}
          <div className="w-full bg-[#FFF6EA] border border-[#F2E4D6] rounded-[2px] p-5 text-left mb-6 flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6D2C0]">
              <span className="text-[#7A5644]">Nomor Pesanan</span>
              <span className="font-semibold text-[#4A2A1C]">{orderId || '#BS-2026-0881'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5644]">Total Pembayaran</span>
              <span className="font-bold text-[#B05A26] text-sm">
                {order?.totalAmount ? formatIDR(order.totalAmount) : 'Rp 183.000'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5644]">Metode Bayar</span>
              <span className="font-medium text-[#4A2A1C]">
                {order?.paymentMethod || 'QRIS Instan'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5644]">Pengiriman</span>
              <span className="font-medium text-[#4A2A1C]">
                {order?.deliveryMethod || 'JNE Reguler'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#E6D2C0]">
              <span className="text-[#7A5644] block mb-0.5">Alamat Tujuan</span>
              <span className="font-medium text-[#4A2A1C] line-clamp-2">
                {order?.deliveryAddress || 'Jl. Puncak Tidar No. 18, Sukun, Kota Malang'}
              </span>
            </div>
          </div>

          {/* Action CTAs (Figma Node #167:6070) */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 py-3 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-xs rounded-[2px] transition-colors flex items-center justify-center"
            >
              Lihat Riwayat Pesanan
            </Link>

            <Link
              href="/shop"
              className="flex-1 py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium text-xs rounded-[2px] transition-colors flex items-center justify-center shadow-sm"
            >
              Belanja Lagi
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
