'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  Copy,
  Clock,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { Header } from '../../../src/components/Header';
import { Footer } from '../../../src/components/Footer';
import { formatIDR } from '../../../src/data/mockProducts';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = typeof params?.id === 'string' ? params.id : '';
  const [order, setOrder] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const list = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
        const found = list.find((o: any) => o.orderId === orderId);
        if (found) {
          setOrder(found);
        } else {
          // Fallback demo order
          setOrder({
            orderId,
            customerName: 'Pelanggan BabyShalls',
            customerPhone: '081234567890',
            customerEmail: 'pelanggan@example.com',
            deliveryMethod: 'Ambil Sendiri di Toko Citraland Puncak Tidar, Malang',
            deliveryAddress: 'Butik BabyShalls Citraland Puncak Tidar Blok HH-26, Malang',
            paymentMethod: 'Transfer Bank BCA (816-123-9999)',
            status: 'Menunggu Pembayaran',
            shippingTrackingNumber: '',
            courier: 'Ambil di Toko',
            items: [
              {
                productId: '1',
                title: 'The Very Hungry Caterpillar',
                coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                quantity: 1,
                price: 165000
              }
            ],
            total: 165000,
            date: new Date().toISOString()
          });
        }
      } catch {
        // fallback
      }
    }
  }, [orderId]);

  const handleCopyRek = (num: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full">
      <Header />

      <main className="flex-grow w-full py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          {/* Centered White Card with Paulette Kids Minimalist Style */}
          <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-10 shadow-sm text-left space-y-8">
            
            {/* Header Success Status */}
            <div className="text-center space-y-3 pb-6 border-b border-[#EDE8E1]">
              <div className="w-16 h-16 rounded-full bg-[#E2ECE0] text-[#3A5C37] flex items-center justify-center mx-auto border border-[#C7DAC3]">
                <CheckCircle size={32} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block">
                Pesanan Berhasil Dicatat
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                Terima Kasih Atas Pesanan Anda!
              </h1>
              <p className="text-xs sm:text-sm text-[#68625D] max-w-md mx-auto">
                Invoice ID: <span className="font-bold text-[#2C2725]">{orderId}</span>
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FBE7E3] text-[#E07A5F] rounded-full text-xs font-semibold">
                <Clock size={13} />
                <span>Status: {order?.status || 'Menunggu Pembayaran'}</span>
              </div>
            </div>

            {/* Instruksi Pembayaran */}
            <div className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-md p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#2C2725] uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} className="text-[#E07A5F]" />
                Instruksi Pembayaran
              </h2>
              
              <div className="text-xs text-[#68625D] space-y-2">
                <p>
                  Silakan selesaikan pembayaran sebesar{' '}
                  <strong className="text-base text-[#E07A5F] font-bold block sm:inline">
                    {order ? formatIDR(order.total) : 'Rp 0'}
                  </strong>{' '}
                  melalui transfer ke rekening resmi butik BabyShalls berikut:
                </p>

                <div className="bg-white border border-[#EDE8E1] rounded-md p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#2C2725]">Bank Central Asia (BCA)</div>
                    <div className="text-sm font-mono font-bold text-[#2C2725] tracking-wider mt-0.5">
                      816-123-9999
                    </div>
                    <div className="text-[11px] text-[#68625D]">a.n. BabyShalls Official Malang</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyRek('8161239999')}
                    className="px-3 py-1.5 bg-[#FFFDF9] border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Copy size={13} />
                    <span>{copied ? 'Tersalin!' : 'Salin Rekening'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#68625D] pt-1">
                  * Untuk verifikasi otomatis atau konfirmasi cepat, kirimkan bukti transfer ke WhatsApp butik kami atau admin akan mengonfirmasi status dalam 1x24 jam.
                </p>
              </div>
            </div>

            {/* Detail Pengiriman */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#2C2725] uppercase tracking-wider flex items-center gap-2">
                <Truck size={16} className="text-[#E07A5F]" />
                Detail Pengiriman
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FFFDF9] border border-[#EDE8E1] rounded-md p-4">
                <div>
                  <span className="text-[#68625D] block">Nama Penerima:</span>
                  <span className="font-semibold text-[#2C2725]">{order?.customerName}</span>
                </div>
                <div>
                  <span className="text-[#68625D] block">Nomor WhatsApp:</span>
                  <span className="font-semibold text-[#2C2725]">{order?.customerPhone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#68625D] block">Metode &amp; Alamat:</span>
                  <span className="font-semibold text-[#2C2725]">{order?.deliveryMethod}</span>
                  <p className="text-[#68625D] mt-0.5">{order?.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Rincian Produk yang Dipesan */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#2C2725] uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#E07A5F]" />
                Item yang Dipesan
              </h2>
              <div className="divide-y divide-[#EDE8E1] border-y border-[#EDE8E1]">
                {order?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.coverImage && (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-10 h-14 object-cover rounded-sm border border-[#EDE8E1]"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-[#2C2725]">{item.title}</div>
                        <div className="text-[11px] text-[#68625D]">{item.quantity} ekslempar</div>
                      </div>
                    </div>
                    <div className="font-bold text-[#2C2725]">
                      {formatIDR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 border-t border-[#EDE8E1]">
              <Link
                href="/account/orders"
                className="flex-1 py-3 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold uppercase tracking-wider rounded-md text-center transition-colors shadow-xs"
              >
                Lihat Riwayat Pesanan Saya
              </Link>
              <Link
                href="/shop"
                className="flex-1 py-3 bg-white border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] text-xs font-semibold uppercase tracking-wider rounded-md text-center transition-colors"
              >
                Kembali Belanja di Toko
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

