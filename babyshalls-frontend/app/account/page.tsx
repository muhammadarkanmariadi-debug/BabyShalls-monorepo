'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  Calendar,
  MapPin,
  Heart,
  BookOpen,
  LogOut,
  Check,
  QrCode,
  Truck,
  Clock,
  ChevronRight,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';
import { WireProductCard } from '@/components/common/WireProductCard';
import { mockProducts, formatIDR } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';

type TabKey = 'profil' | 'alamat' | 'pesanan' | 'tiket' | 'request' | 'wishlist';

export default function AccountPage() {
  const { addToCart } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'masuk' | 'daftar'>('masuk');

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('dina.permata@gmail.com');
  const [authPassword, setAuthPassword] = useState('********');
  const [authName, setAuthName] = useState('Dina Permata');
  const [authPhone, setAuthPhone] = useState('0812-3456-7890');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>('profil');

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'Dina Permata',
    email: 'dina.permata@gmail.com',
    phone: '0812-3456-7890',
    city: 'Kota Malang',
    address: 'Jl. Puncak Tidar No. 18, RT 02 / RW 04, Karangbesuki, Sukun, Kota Malang 65146',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('semua');

  // Event Tickets State
  const [eventTickets, setEventTickets] = useState<any[]>([]);

  // Book Requests State
  const [bookRequests, setBookRequests] = useState<any[]>([]);

  // Load localStorage data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
        if (savedOrders.length > 0) {
          setOrders(savedOrders);
        } else {
          // Default demo orders matching Figma
          setOrders([
            {
              orderId: 'BS-2026-0881',
              createdAt: '2026-11-14T10:30:00Z',
              status: 'Sedang Dikirim',
              deliveryMethod: 'JNE Reguler',
              shippingTrackingNumber: 'JNE88291039401ID',
              totalAmount: 183000,
              items: [
                {
                  productId: 'p-1',
                  title: 'Little Bear & The Whispering Woods',
                  price: 165000,
                  quantity: 1,
                  coverImage: '/images/products/p-1-little-bear.png',
                },
              ],
            },
            {
              orderId: 'BS-2026-0842',
              createdAt: '2026-11-02T14:15:00Z',
              status: 'Selesai',
              deliveryMethod: 'Ambil di Toko Citraland Malang',
              shippingTrackingNumber: '-',
              totalAmount: 245000,
              items: [
                {
                  productId: 'p-2',
                  title: 'Petualangan Si Kancil & Buaya Cerdik',
                  price: 125000,
                  quantity: 1,
                  coverImage: '/images/products/p-2-kancil.png',
                },
                {
                  productId: 'p-6',
                  title: 'Buku Kain Lembut: Suara Hewan Ternak',
                  price: 120000,
                  quantity: 1,
                  coverImage: '/images/products/p-6-buku-kain.png',
                },
              ],
            },
          ]);
        }

        const savedTickets = JSON.parse(localStorage.getItem('babyshalls_event_tickets') || '[]');
        if (savedTickets.length > 0) {
          setEventTickets(savedTickets);
        } else {
          setEventTickets([
            {
              ticketId: 'EVT-8419',
              eventTitle: 'Little Explorers: Nature Craft & Sensory Play',
              eventDate: 'Sabtu, 28 November 2026',
              eventTime: '09.30 – 11.30 WIB',
              location: 'BabyShalls Citraland Puncak Tidar Blok HH-26, Malang',
              parentName: 'Dina Permata',
              childName: 'Kenzo (3 th)',
              status: 'Tiket Aktif',
            },
          ]);
        }

        const savedRequests = JSON.parse(localStorage.getItem('babyshalls_book_requests') || '[]');
        if (savedRequests.length > 0) {
          setBookRequests(savedRequests);
        } else {
          setBookRequests([
            {
              id: 'REQ-4819',
              bookTitle: 'The Wonderful Things You Will Be',
              author: 'Emily Winfield Martin',
              isbn: '978-0385376716',
              format: 'Board Book',
              status: 'Sedang Dicari',
              createdAt: '2026-11-12T09:00:00Z',
              curatorNote: 'Sedang dicek ke distributor buku impor di Singapura. Kami kabari via WA maks esok.',
            },
          ]);
        }
      } catch {
        // pass
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Wishlist products
  const wishlistProducts = mockProducts.slice(0, 4);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'semua') return true;
    if (orderFilter === 'dikirim' && o.status.includes('Dikirim')) return true;
    if (orderFilter === 'selesai' && o.status.includes('Selesai')) return true;
    if (orderFilter === 'menunggu' && o.status.includes('Menunggu')) return true;
    return true;
  });

  // If user is not authenticated, render exact Figma Masuk / Daftar Split Screen (#169:6204)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Header />
        <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#FFFDF9]">
          <div className="w-full max-w-5xl bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[580px]">
            
            {/* Left Panel: Ilustrasi (Figma Node #169:6205, 50% width, bg #FBE6D8) */}
            <div className="w-full md:w-1/2 bg-[#FBE6D8] p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-3xl font-bold text-[#B05A26] tracking-tight mb-2">
                Baby Shall&apos;s
              </span>

              {/* Mascot Waving (Figma Node #169:6240) */}
              <div className="relative w-56 h-56 my-4">
                <Image
                  src="/images/mascot/maskot-melambai.png"
                  alt="Maskot BabyShalls"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              <h2 className="text-2xl font-medium text-[#4A2A1C] mb-2 tracking-tight">
                Halo, selamat datang!
              </h2>

              <p className="text-xs sm:text-sm text-[#7A5644] max-w-xs leading-relaxed">
                Masuk untuk melacak pesanan buku, menyimpan wishlist favorit, dan melihat tiket workshop anak.
              </p>
            </div>

            {/* Right Panel: Form Masuk / Daftar (Figma Node #169:6212) */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
              
              {/* Tab Selector (Masuk / Daftar) */}
              <div className="flex bg-[#F2E4D6] p-1 rounded-[2px] mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('masuk')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                    authMode === 'masuk'
                      ? 'bg-white text-[#4A2A1C] shadow-xs'
                      : 'text-[#7A5644] hover:text-[#4A2A1C]'
                  }`}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('daftar')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                    authMode === 'daftar'
                      ? 'bg-white text-[#4A2A1C] shadow-xs'
                      : 'text-[#7A5644] hover:text-[#4A2A1C]'
                  }`}
                >
                  Daftar Baru
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {authMode === 'daftar' && (
                  <div>
                    <label className="block text-[#7A5644] font-medium mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full px-3 py-2.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#7A5644] font-medium mb-1">
                    Email atau Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="email@anda.com / 0812xxxx"
                    className="w-full px-3 py-2.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#7A5644] font-medium">Kata Sandi *</label>
                    {authMode === 'masuk' && (
                      <a href="#forgot" className="text-[11px] text-[#B05A26] hover:underline">
                        Lupa kata sandi?
                      </a>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                {authMode === 'masuk' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      defaultChecked
                      className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] rounded-[2px] focus:ring-[#B05A26]"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-[#7A5644] cursor-pointer">
                      Ingat saya di perangkat ini
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-sm mt-2"
                >
                  {authMode === 'masuk' ? 'Masuk ke Akun' : 'Daftar Akun BabyShalls'}
                </button>

                <p className="text-[11px] text-[#7A5644] text-center pt-2">
                  Belanja tanpa akun? Kamu tetap bisa checkout langsung sebagai tamu.
                </p>
              </form>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Dashboard View (Figma Node #169:6498)
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

      {/* Main Account Area (Figma Node #169:6501, 2 Columns) */}
      <main className="py-10 sm:py-14 flex-1 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            
            {/* Left Sidebar (Figma Node #169:6502, 280px width) */}
            <aside className="w-full lg:w-[280px] shrink-0 bg-white border border-[#F2E4D6] rounded-[2px] p-5">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#F2E4D6]">
                <div className="w-12 h-12 rounded-full bg-[#FFF6EA] text-[#B05A26] font-bold text-base flex items-center justify-center border border-[#E6D2C0]">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-[#4A2A1C] truncate">
                    {userProfile.name}
                  </h3>
                  <span className="text-xs text-[#7A5644] block truncate">
                    {userProfile.phone}
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('profil')}
                  className={`w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'profil'
                      ? 'bg-[#FBE6D8] text-[#4A2A1C] font-semibold'
                      : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                  }`}
                >
                  <User className="w-4 h-4 text-[#B05A26]" />
                  <span>Profil & Keamanan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('alamat')}
                  className={`w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'alamat'
                      ? 'bg-[#FBE6D8] text-[#4A2A1C] font-semibold'
                      : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#B05A26]" />
                  <span>Daftar Alamat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pesanan')}
                  className={`w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'pesanan'
                      ? 'bg-[#FBE6D8] text-[#4A2A1C] font-semibold'
                      : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                  }`}
                >
                  <Package className="w-4 h-4 text-[#B05A26]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span>Pesanan Saya</span>
                    {orders.length > 0 && (
                      <span className="bg-[#B05A26] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {orders.length}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tiket')}
                  className={`w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'tiket'
                      ? 'bg-[#FBE6D8] text-[#4A2A1C] font-semibold'
                      : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#B05A26]" />
                  <span>Tiket Event & Workshop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('request')}
                  className={`w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'request'
                      ? 'bg-[#FBE6D8] text-[#4A2A1C] font-semibold'
                      : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#B05A26]" />
                  <span>Request Buku Saya</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'wishlist'
                      ? 'bg-[#FBE6D8] text-[#4A2A1C] font-semibold'
                      : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                  }`}
                >
                  <Heart className="w-4 h-4 text-[#B05A26]" />
                  <span>Wishlist Favorit</span>
                </button>

                <div className="pt-3 mt-3 border-t border-[#F2E4D6]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 rounded-[2px] flex items-center gap-3 text-left text-[#C0392B] hover:bg-[#FEECE8] transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </nav>
            </aside>

            {/* Right Main Content Area */}
            <div className="flex-1 w-full min-w-0">
              
              {/* TAB 1: PROFIL & DATA DIRI (Figma Node #169:6534) */}
              {activeTab === 'profil' && (
                <div className="space-y-6">
                  {savedSuccess && (
                    <div className="p-4 bg-[#DDF1E5] text-[#2A6E37] text-xs font-semibold rounded-[2px] border border-[#A7DBB8] flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Data profil berhasil diperbarui!</span>
                    </div>
                  )}

                  {/* Data Diri Card */}
                  <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-xs">
                    <h2 className="text-lg font-medium text-[#4A2A1C] mb-4 pb-2 border-b border-[#F2E4D6]">
                      Data Diri Akun
                    </h2>

                    <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Nomor WhatsApp
                          </label>
                          <input
                            type="text"
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Alamat Email
                          </label>
                          <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Kota Domisili
                          </label>
                          <input
                            type="text"
                            value={userProfile.city}
                            onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium text-xs rounded-[2px] transition-colors cursor-pointer"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Keamanan & Password */}
                  <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-xs">
                    <h2 className="text-lg font-medium text-[#4A2A1C] mb-4 pb-2 border-b border-[#F2E4D6]">
                      Ubah Kata Sandi
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Kata Sandi Lama
                        </label>
                        <input
                          type="password"
                          placeholder="Masukkan sandi saat ini"
                          className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Kata Sandi Baru
                        </label>
                        <input
                          type="password"
                          placeholder="Minimal 6 karakter"
                          className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-6 py-2.5 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-xs rounded-[2px] transition-colors cursor-pointer"
                    >
                      Update Kata Sandi
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DAFTAR ALAMAT */}
              {activeTab === 'alamat' && (
                <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#F2E4D6]">
                    <h2 className="text-lg font-medium text-[#4A2A1C]">
                      Daftar Alamat Pengiriman
                    </h2>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Alamat Baru</span>
                    </button>
                  </div>

                  {/* Primary Address Card */}
                  <div className="p-5 border border-[#B05A26] bg-[#FFFBF7] rounded-[2px] relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-[#4A2A1C]">
                        {userProfile.name} (Rumah)
                      </span>
                      <span className="bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-semibold px-2 py-0.5 rounded-[2px]">
                        Utama
                      </span>
                    </div>

                    <p className="text-xs text-[#7A5644] mb-1">
                      {userProfile.phone}
                    </p>
                    <p className="text-xs text-[#4A2A1C] max-w-xl leading-relaxed mb-4">
                      {userProfile.address}
                    </p>

                    <div className="flex items-center gap-3 text-xs">
                      <button className="text-[#B05A26] font-medium hover:underline flex items-center gap-1">
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Ubah Alamat</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PESANAN SAYA (Figma Node #169:7140) */}
              {activeTab === 'pesanan' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2E4D6]">
                    <h2 className="text-lg font-medium text-[#4A2A1C]">
                      Riwayat Pesanan ({orders.length})
                    </h2>

                    {/* Filter pills */}
                    <div className="flex items-center gap-1 text-xs">
                      {['semua', 'menunggu', 'dikirim', 'selesai'].map((filterKey) => (
                        <button
                          key={filterKey}
                          onClick={() => setOrderFilter(filterKey)}
                          className={`px-3 py-1 rounded-[2px] capitalize transition-colors ${
                            orderFilter === filterKey
                              ? 'bg-[#B05A26] text-white font-medium'
                              : 'bg-white border border-[#E6D2C0] text-[#7A5644] hover:border-[#B05A26]'
                          }`}
                        >
                          {filterKey}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders List Cards */}
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.orderId}
                        className="bg-white border border-[#F2E4D6] rounded-[2px] p-5 sm:p-6 shadow-xs flex flex-col gap-4"
                      >
                        {/* Header card */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F2E4D6] text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-[#4A2A1C]">
                              No. Pesanan: {ord.orderId}
                            </span>
                            <span className="text-[#7A5644]">
                              {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-[2px] ${
                            ord.status === 'Selesai'
                              ? 'bg-[#DDF1E5] text-[#2A6E37]'
                              : ord.status === 'Sedang Dikirim'
                              ? 'bg-[#E3EDF9] text-[#2C5282]'
                              : 'bg-[#FFF6EA] text-[#B05A26]'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="flex flex-col gap-3">
                          {ord.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3.5">
                              <div className="relative w-14 h-14 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0">
                                <Image
                                  src={item.coverImage || '/images/products/p-1-little-bear.png'}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-[#4A2A1C] truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[11px] text-[#7A5644] block">
                                  {item.quantity} × {formatIDR(item.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total & Action */}
                        <div className="pt-3 border-t border-[#F2E4D6] flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[#7A5644] block text-[11px]">Total Tagihan:</span>
                            <span className="font-bold text-[#B05A26] text-sm">
                              {formatIDR(ord.totalAmount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {ord.shippingTrackingNumber && ord.shippingTrackingNumber !== '-' && (
                              <span className="text-[11px] text-[#7A5644] bg-[#FFF6EA] px-2.5 py-1 rounded-[2px] border border-[#E6D2C0]">
                                Resi: {ord.shippingTrackingNumber}
                              </span>
                            )}
                            <Link
                              href="/shop"
                              className="px-4 py-2 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-xs rounded-[2px] transition-colors"
                            >
                              Beli Lagi
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-12 text-center">
                      <div className="relative w-32 h-32 mx-auto mb-3">
                        <Image
                          src="/images/mascot/maskot-keranjang-kosong.png"
                          alt="Tidak ada pesanan"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-base font-semibold text-[#4A2A1C] mb-1">
                        Belum Ada Pesanan
                      </h3>
                      <p className="text-xs text-[#7A5644] mb-4">
                        Yuk telusuri katalog buku edukatif anak pilihan kami.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px]"
                      >
                        Mulai Belanja
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: TIKET EVENT (Figma Node #169:7800) */}
              {activeTab === 'tiket' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2E4D6]">
                    <h2 className="text-lg font-medium text-[#4A2A1C]">
                      Tiket Workshop & Event ({eventTickets.length})
                    </h2>
                    <Link
                      href="/events"
                      className="text-xs text-[#B05A26] font-medium hover:underline"
                    >
                      + Daftar Event Lain
                    </Link>
                  </div>

                  {eventTickets.map((tkt) => (
                    <div
                      key={tkt.ticketId}
                      className="bg-white border border-[#F2E4D6] rounded-[2px] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-semibold px-2 py-0.5 rounded-[2px]">
                            {tkt.status || 'Tiket Aktif'}
                          </span>
                          <span className="text-xs text-[#7A5644]">
                            Ref: {tkt.ticketId}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-[#4A2A1C] mb-2">
                          {tkt.eventTitle}
                        </h3>

                        <div className="space-y-1 text-xs text-[#7A5644]">
                          <p>📅 <strong>{tkt.eventDate}</strong> · {tkt.eventTime}</p>
                          <p>📍 {tkt.location}</p>
                          <p>👤 Peserta: <strong>{tkt.childName}</strong> (Pendamping: {tkt.parentName})</p>
                        </div>
                      </div>

                      {/* QR Representation */}
                      <div className="p-3 bg-[#FFFBF7] border border-[#E6D2C0] rounded-[2px] flex flex-col items-center shrink-0">
                        <QrCode className="w-20 h-20 text-[#4A2A1C]" />
                        <span className="text-[10px] text-[#7A5644] mt-1 font-mono">
                          {tkt.ticketId}
                        </span>
                        <span className="text-[10px] text-[#2A6E37] font-semibold mt-0.5">
                          Tunjukkan ke Kasir
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: REQUEST BUKU SAYA (Figma Node #169:8061) */}
              {activeTab === 'request' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2E4D6]">
                    <h2 className="text-lg font-medium text-[#4A2A1C]">
                      Request Buku Saya ({bookRequests.length})
                    </h2>
                    <Link
                      href="/request-a-book"
                      className="text-xs text-[#B05A26] font-medium hover:underline"
                    >
                      + Buat Request Baru
                    </Link>
                  </div>

                  {bookRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-[#F2E4D6] rounded-[2px] p-5 sm:p-6 shadow-xs flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F2E4D6]">
                        <span className="font-semibold text-[#4A2A1C]">
                          No. Request: {req.id}
                        </span>
                        <span className="bg-[#FFF6EA] text-[#B05A26] border border-[#E6D2C0] text-[11px] font-semibold px-2.5 py-0.5 rounded-[2px]">
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-20 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0 border border-[#E6D2C0]">
                          <Image
                            src={req.coverImage || '/images/products/p-1-little-bear.png'}
                            alt={req.bookTitle}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#4A2A1C]">
                            {req.bookTitle}
                          </h3>
                          <p className="text-xs text-[#7A5644] mt-0.5">
                            Penulis: {req.author || '-'} · Format: {req.format}
                          </p>
                          {req.isbn && (
                            <p className="text-[11px] text-[#7A5644]">
                              ISBN: {req.isbn}
                            </p>
                          )}

                          {req.curatorNote && (
                            <div className="mt-3 p-3 bg-[#FFFBF7] border border-[#E6D2C0] rounded-[2px] text-xs text-[#7A5644]">
                              <strong>Catatan Kurator:</strong> {req.curatorNote}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: WISHLIST FAVORIT (Figma Node #169:8327) */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2E4D6]">
                    <h2 className="text-lg font-medium text-[#4A2A1C]">
                      Wishlist Buku Favorit ({wishlistProducts.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="relative flex flex-col">
                        <WireProductCard product={p} />
                        <button
                          type="button"
                          onClick={() => addToCart(p, 1)}
                          className="w-full mt-2 py-2 bg-[#FFF6EA] border border-[#B05A26] text-[#B05A26] hover:bg-[#B05A26] hover:text-white text-xs font-semibold rounded-[2px] transition-colors"
                        >
                          + Pindahkan ke Keranjang
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
