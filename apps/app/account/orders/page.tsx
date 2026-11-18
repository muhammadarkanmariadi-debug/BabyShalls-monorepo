'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Truck,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { formatIDR } from '@/data/mockProducts';

export default function CustomerOrdersHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
        if (Array.isArray(saved) && saved.length > 0) {
          setOrders(saved);
        } else {
          // Default initial demo order
          setOrders([
            {
              orderId: 'BS-2026-0881',
              customerName: 'Dina Permata',
              customerPhone: '0812-3456-7890',
              customerEmail: 'dina.permata@gmail.com',
              deliveryMethod: 'JNE Reguler',
              deliveryAddress: 'Jl. Puncak Tidar No. 18, Sukun, Malang 65146',
              paymentMethod: 'QRIS Instan',
              status: 'Sedang Dikirim',
              shippingTrackingNumber: 'JNE88291039401ID',
              courier: 'JNE Reguler',
              items: [
                {
                  productId: 'p-1',
                  title: 'Little Bear & The Whispering Woods',
                  coverImage: '/images/products/p-1-little-bear.png',
                  quantity: 1,
                  price: 165000,
                },
              ],
              totalAmount: 183000,
              createdAt: '2026-11-14T10:30:00Z',
            },
            {
              orderId: 'BS-2026-0842',
              customerName: 'Dina Permata',
              customerPhone: '0812-3456-7890',
              customerEmail: 'dina.permata@gmail.com',
              deliveryMethod: 'Ambil di Toko Citraland Malang',
              deliveryAddress: 'Citraland Puncak Tidar Blok HH-26, Malang',
              paymentMethod: 'BCA Virtual Account',
              status: 'Selesai',
              shippingTrackingNumber: '-',
              courier: 'Ambil di Toko',
              items: [
                {
                  productId: 'p-2',
                  title: 'Petualangan Si Kancil & Buaya Cerdik',
                  coverImage: '/images/products/p-2-kancil.png',
                  quantity: 1,
                  price: 125000,
                },
                {
                  productId: 'p-6',
                  title: 'Buku Kain Lembut: Suara Hewan Ternak',
                  coverImage: '/images/products/p-6-buku-kain.png',
                  quantity: 1,
                  price: 120000,
                },
              ],
              totalAmount: 245000,
              createdAt: '2026-11-02T14:15:00Z',
            },
          ]);
        }
      } catch {
        // fallback
      }
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status
      if (statusFilter === 'menunggu' && !o.status.includes('Menunggu')) return false;
      if (statusFilter === 'dikirim' && !o.status.includes('Dikirim')) return false;
      if (statusFilter === 'selesai' && !o.status.includes('Selesai')) return false;

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = o.orderId?.toLowerCase().includes(q);
        const matchesItems = o.items?.some((i: any) => i.title?.toLowerCase().includes(q));
        if (!matchesId && !matchesItems) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TombolKembali fallbackUrl="/account" label="Kembali ke Akun Profil" />

      <main className="py-10 sm:py-14 flex-1 bg-[#FFFDF9]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#F2E4D6]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
                Riwayat &amp; Lacak Pesanan
              </h1>
              <p className="text-xs sm:text-sm text-[#7A5644] mt-1">
                Pantau progres penyiapan buku, resi pengiriman kurir, dan riwayat belanja.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 scrollbar-none">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'menunggu', label: 'Menunggu' },
                { key: 'dikirim', label: 'Dikirim' },
                { key: 'selesai', label: 'Selesai' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer ${
                    statusFilter === tab.key
                      ? 'bg-[#B05A26] text-white'
                      : 'bg-white border border-[#E6D2C0] text-[#7A5644] hover:border-[#B05A26]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 shadow-xs flex flex-col gap-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2E4D6] text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-[#4A2A1C]">
                        {ord.orderId}
                      </span>
                      <span className="text-[#7A5644]">
                        {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-[2px] ${
                        ord.status === 'Selesai'
                          ? 'bg-[#DDF1E5] text-[#2A6E37]'
                          : ord.status === 'Sedang Dikirim'
                          ? 'bg-[#E3EDF9] text-[#2C5282]'
                          : 'bg-[#FFF6EA] text-[#B05A26]'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#F9EAE1]">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0 border border-[#E6D2C0]">
                          <Image
                            src={item.coverImage || '/images/products/p-1-little-bear.png'}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#4A2A1C] truncate">
                            {item.title}
                          </h4>
                          <span className="text-xs text-[#7A5644]">
                            {item.quantity} barang × {formatIDR(item.price)}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-[#4A2A1C] shrink-0">
                          {formatIDR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info Box */}
                  <div className="bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] p-3.5 text-xs text-[#7A5644] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#B05A26] shrink-0" />
                      <span>Kurir: <strong>{ord.deliveryMethod}</strong></span>
                      {ord.shippingTrackingNumber && ord.shippingTrackingNumber !== '-' && (
                        <span>· Resi: <strong className="text-[#4A2A1C] font-mono">{ord.shippingTrackingNumber}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Total:</span>
                      <strong className="text-sm text-[#B05A26]">{formatIDR(ord.totalAmount)}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3 text-xs">
                    <Link
                      href="/shop"
                      className="px-4 py-2 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium rounded-[2px] transition-colors"
                    >
                      Beli Lagi
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-12 text-center">
                <p className="text-sm text-[#7A5644] mb-4">
                  Tidak ada pesanan pada filter ini.
                </p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px]"
                >
                  Lihat Katalog Buku
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}
