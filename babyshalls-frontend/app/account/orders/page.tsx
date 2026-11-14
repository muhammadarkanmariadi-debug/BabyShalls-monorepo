'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  ExternalLink,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { Header } from '../../../src/components/Header';
import { Footer } from '../../../src/components/Footer';
import { OrderDrawer } from '../../../src/components/OrderDrawer';
import { formatIDR } from '../../../src/data/mockProducts';

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
          const defaultDemo = [
            {
              orderId: 'BS-849201',
              customerName: 'Sarah Nurhaliza',
              customerPhone: '081234567890',
              customerEmail: 'sarah.nurhaliza@example.com',
              deliveryMethod: 'Ekspedisi Reguler (JNE / SiCepat)',
              deliveryAddress: 'Jl. Dieng Atas No. 42, Sukun, Malang 65146',
              paymentMethod: 'Transfer Bank BCA (816-123-9999)',
              status: 'Dikirim',
              shippingTrackingNumber: 'JNE88291039401ID',
              courier: 'JNE Reguler',
              items: [
                {
                  productId: '1',
                  title: 'The Very Hungry Caterpillar',
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                  quantity: 1,
                  price: 165000
                },
                {
                  productId: '2',
                  title: 'Goodnight Moon',
                  coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
                  quantity: 1,
                  price: 155000
                }
              ],
              subtotal: 320000,
              shippingFee: 25000,
              giftWrappingCost: 0,
              total: 345000,
              date: new Date(Date.now() - 86400000 * 2).toISOString()
            }
          ];
          setOrders(defaultDemo);
          localStorage.setItem('babyshalls_orders', JSON.stringify(defaultDemo));
        }
      } catch {
        // fallback
      }
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== 'all' && ord.status !== statusFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = ord.orderId?.toLowerCase().includes(q);
        const matchesItem = ord.items?.some((i: any) => i.title?.toLowerCase().includes(q));
        if (!matchesId && !matchesItem) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchTerm]);

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
            <Link href="/account" className="hover:text-[#E07A5F] transition-colors">
              Akun Saya
            </Link>
            <span>/</span>
            <span className="text-[#2C2725] font-semibold">Riwayat Pesanan</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#EDE8E1] gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                Riwayat &amp; Pelacakan Pesanan
              </h1>
              <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                Lacak status verifikasi pembayaran, nomor resi pengiriman ekspedisi, atau jadwal pickup di butik Malang.
              </p>
            </div>
            <Link
              href="/shop"
              className="px-4 py-2 bg-[#E07A5F] text-white rounded-md text-xs font-semibold hover:bg-[#cc654b] transition-colors self-start sm:self-auto"
            >
              + Belanja Lagi
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-[#EDE8E1] rounded-lg p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { label: 'Semua', value: 'all' },
                { label: 'Menunggu Pembayaran', value: 'Menunggu Pembayaran' },
                { label: 'Diproses', value: 'Diproses' },
                { label: 'Dikirim', value: 'Dikirim' },
                { label: 'Selesai', value: 'Selesai' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    statusFilter === tab.value
                      ? 'bg-[#E07A5F] text-white'
                      : 'bg-[#FFFDF9] border border-[#EDE8E1] text-[#68625D] hover:text-[#2C2725]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search ID or Book Title */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68625D]" />
              <input
                type="text"
                placeholder="Cari No. Order atau Judul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 bg-white border border-[#EDE8E1] rounded-lg text-center p-8 shadow-xs space-y-3">
              <Package size={36} className="mx-auto text-[#68625D]" />
              <h3 className="text-base font-bold text-[#2C2725]">Tidak Ada Pesanan</h3>
              <p className="text-xs text-[#68625D]">
                Tidak ada pesanan dengan status atau kata kunci yang dipilih.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((ord: any) => (
                <div
                  key={ord.orderId}
                  className="bg-white border border-[#EDE8E1] rounded-lg p-5 sm:p-7 shadow-xs text-left space-y-5"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EDE8E1]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-[#2C2725]">
                          Order #{ord.orderId}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Dikirim'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'Diproses'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#FBE7E3] text-[#E07A5F]'
                        }`}>
                          {ord.status || 'Menunggu Pembayaran'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#68625D] flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          Dipesan pada{' '}
                          {new Date(ord.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#68625D]">Total Pembayaran</div>
                      <div className="text-base font-bold text-[#E07A5F]">
                        {formatIDR(ord.total)}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Resi Banner if available */}
                  {ord.shippingTrackingNumber ? (
                    <div className="bg-[#E2ECE0]/50 border border-[#C7DAC3] p-3.5 rounded-md flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-[#3A5C37]">
                        <Truck size={17} />
                        <span>
                          Nomor Resi Pengiriman ({ord.courier || 'Ekspedisi'}):{' '}
                          <strong className="font-mono text-sm">{ord.shippingTrackingNumber}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] text-[#3A5C37] font-semibold">
                        Paket Sedang Dalam Pengiriman
                      </span>
                    </div>
                  ) : ord.deliveryMethod?.includes('Ambil') ? (
                    <div className="bg-[#FAF8F5] border border-[#EDE8E1] p-3 rounded-md text-xs text-[#68625D] flex items-center gap-2">
                      <MapPin size={15} className="text-[#E07A5F]" />
                      <span>
                        Ambil di butik BabyShalls: Citraland Puncak Tidar Blok HH-26, Malang (Tunjukkan No. Order ini ke staf)
                      </span>
                    </div>
                  ) : (
                    <div className="bg-[#FAF8F5] border border-[#EDE8E1] p-3 rounded-md text-xs text-[#68625D] flex items-center gap-2">
                      <Clock size={15} className="text-[#E07A5F]" />
                      <span>
                        Pesanan sedang disiapkan di butik. Nomor resi kurir akan diupdate oleh admin setelah paket di-pickup ekspedisi.
                      </span>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="divide-y divide-[#EDE8E1]">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {item.coverImage && (
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-11 h-14 object-cover rounded-sm border border-[#EDE8E1]"
                            />
                          )}
                          <div>
                            <Link
                              href={`/product/${item.productId}`}
                              className="font-semibold text-[#2C2725] hover:text-[#E07A5F]"
                            >
                              {item.title}
                            </Link>
                            <div className="text-[11px] text-[#68625D] mt-0.5">
                              {item.quantity} × {formatIDR(item.price)}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-[#2C2725]">
                          {formatIDR(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Card Actions */}
                  <div className="pt-3 border-t border-[#EDE8E1] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-[#68625D]">
                      Pengiriman: <span className="font-medium text-[#2C2725]">{ord.deliveryMethod}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/order-success/${ord.orderId}`}
                        className="font-semibold text-[#E07A5F] hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Bukti &amp; Tagihan</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}

