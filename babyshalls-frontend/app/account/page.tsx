'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';
import { formatIDR } from '../../src/data/mockProducts';

export default function CustomerAccountPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Nurhaliza',
    email: 'sarah.nurhaliza@example.com',
    phone: '0812-3456-7890',
    address: 'Citraland Puncak Tidar, Sukun, Kota Malang, Jawa Timur 65146'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
        setOrders(savedOrders);

        const savedEvents = JSON.parse(localStorage.getItem('babyshalls_event_registrations') || '[]');
        setEvents(savedEvents);

        const savedProfile = localStorage.getItem('babyshalls_customer_profile');
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        }
      } catch {
        // fallback
      }
    }
  }, []);

  const recentOrders = orders.slice(0, 3);

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
            <span className="text-[#2C2725] font-semibold">Akun Saya</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#EDE8E1] gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                Selamat Datang, {userProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                Kelola pesanan buku, tiket workshop anak, dan alamat pengiriman Anda di satu tempat.
              </p>
            </div>
            
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E07A5F] hover:underline"
            >
              <span>Masuk Portal Admin Kurator</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Profile Card & Quick Nav (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 shadow-xs text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FBE7E3] text-[#E07A5F] font-bold text-lg flex items-center justify-center">
                    {userProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#2C2725]">{userProfile.name}</h2>
                    <p className="text-xs text-[#68625D]">{userProfile.email}</p>
                    <p className="text-[11px] text-[#68625D]">{userProfile.phone}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EDE8E1] text-xs space-y-2">
                  <div className="flex items-start gap-2 text-[#68625D]">
                    <MapPin size={15} className="text-[#E07A5F] shrink-0 mt-0.5" />
                    <span>{userProfile.address}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg divide-y divide-[#EDE8E1] shadow-xs text-xs font-semibold">
                <Link
                  href="/account/orders"
                  className="flex items-center justify-between p-4 hover:bg-[#FBE7E3]/40 text-[#2C2725] hover:text-[#E07A5F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package size={17} className="text-[#E07A5F]" />
                    <span>Semua Pesanan ({orders.length})</span>
                  </div>
                  <ChevronRight size={15} className="text-[#68625D]" />
                </Link>

                <Link
                  href="/events"
                  className="flex items-center justify-between p-4 hover:bg-[#FBE7E3]/40 text-[#2C2725] hover:text-[#E07A5F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={17} className="text-[#E07A5F]" />
                    <span>Pendaftaran Workshop ({events.length})</span>
                  </div>
                  <ChevronRight size={15} className="text-[#68625D]" />
                </Link>

                <Link
                  href="/shop"
                  className="flex items-center justify-between p-4 hover:bg-[#FBE7E3]/40 text-[#2C2725] hover:text-[#E07A5F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={17} className="text-[#E07A5F]" />
                    <span>Eksplorasi Toko Buku</span>
                  </div>
                  <ChevronRight size={15} className="text-[#68625D]" />
                </Link>
              </div>

            </div>

            {/* Right Column: Recent Activity (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Recent Orders Overview */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs text-left space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E1]">
                  <h2 className="text-base font-bold text-[#2C2725] flex items-center gap-2">
                    <Package size={18} className="text-[#E07A5F]" />
                    <span>Pesanan Terakhir</span>
                  </h2>
                  <Link
                    href="/account/orders"
                    className="text-xs font-semibold text-[#E07A5F] hover:underline"
                  >
                    Lihat Semua Pesanan →
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#68625D] space-y-2">
                    <p>Belum ada riwayat pesanan buku atau mainan.</p>
                    <Link
                      href="/shop"
                      className="inline-block px-4 py-2 bg-[#E07A5F] text-white rounded-md text-xs font-semibold"
                    >
                      Buka Katalog Toko
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((ord: any) => (
                      <div
                        key={ord.orderId}
                        className="p-4 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-[#2C2725]">ID: {ord.orderId}</span>
                            <span className="text-[#68625D] ml-2">
                              {new Date(ord.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
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

                        {ord.shippingTrackingNumber && (
                          <div className="text-xs flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-sm">
                            <Truck size={14} />
                            <span>Resi {ord.courier || 'Ekspedisi'}: <strong>{ord.shippingTrackingNumber}</strong></span>
                          </div>
                        )}

                        <div className="text-xs text-[#68625D]">
                          {ord.items?.length || 1} item • Total: <strong className="text-[#2C2725]">{formatIDR(ord.total)}</strong>
                        </div>

                        <div className="pt-2 flex justify-end gap-2 border-t border-[#EDE8E1]">
                          <Link
                            href={`/order-success/${ord.orderId}`}
                            className="text-xs text-[#E07A5F] font-semibold hover:underline"
                          >
                            Lihat Detail &amp; Invoice →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registered Events / Workshops */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E1]">
                  <h2 className="text-base font-bold text-[#2C2725] flex items-center gap-2">
                    <Calendar size={18} className="text-[#E07A5F]" />
                    <span>Jadwal Workshop &amp; Acara Anak</span>
                  </h2>
                  <Link href="/events" className="text-xs font-semibold text-[#E07A5F] hover:underline">
                    Daftar Acara Lain →
                  </Link>
                </div>

                {events.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#68625D] space-y-2">
                    <p>Anda belum mendaftar di workshop BabyShalls Citraland Malang.</p>
                    <Link
                      href="/events"
                      className="inline-block px-4 py-2 bg-[#E2ECE0] text-[#3A5C37] rounded-md text-xs font-bold"
                    >
                      Lihat Jadwal Workshop (Gratis)
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((evt: any) => (
                      <div
                        key={evt.id}
                        className="p-4 bg-[#FAF8F5] border border-[#EDE8E1] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#2C2725] text-sm">
                            {evt.workshopTitle || 'Workshop BabyShalls'}
                          </div>
                          <div className="text-[#68625D] mt-0.5">
                            Peserta: {evt.parentName} ({evt.childrenCount} Anak, Usia {evt.childrenAge || '2-4 Tahun'})
                          </div>
                          <div className="text-[11px] text-[#3A5C37] font-semibold mt-1">
                            Status: Tiket Terkonfirmasi (Gratis)
                          </div>
                        </div>

                        <Link
                          href="/events"
                          className="px-3.5 py-1.5 bg-white border border-[#EDE8E1] hover:border-[#E07A5F] rounded text-xs font-semibold text-[#2C2725] text-center"
                        >
                          Lihat E-Tiket QR
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}

