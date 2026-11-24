"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { USER_TOKEN_STORAGE_KEY } from '@/lib/axios';
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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  X,
  Star,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { WireProductCard } from '@/components/common/WireProductCard';
import { mockProducts, formatIDR } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import {
  useAccountProfile,
  useUpdateAccountProfile,
  useAccountAddresses,
  useUpdateAccountAddress,
  useDeleteAccountAddress,
  useAccountOrders,
  type AccountAddress,
  type AccountOrder,
  type AccountOrderItem,
} from '@/hooks/useAccount';
import { EmailChangeModal } from '@/features/account/components/EmailChangeModal';
import { AddressFormModal } from '@/features/account/components/AddressFormModal';
import { OrderTrackingModal } from '@/features/account/components/OrderTrackingModal';
import { ToastNotification, type ToastState } from '@/features/account/components/ToastNotification';
import { DeleteAddressModal } from '@/features/account/components/DeleteAddressModal';
import { LogoutConfirmModal } from '@/features/account/components/LogoutConfirmModal';

type TabKey =
  | "profil"
  | "alamat"
  | "pesanan"
  | "tiket"
  | "request"
  | "wishlist";

export default function AccountPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  // Authentication State (checked from real JWT in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const token = window.localStorage.getItem(USER_TOKEN_STORAGE_KEY);
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const { data: profileData, isError: isProfileError } = useAccountProfile(isAuthenticated);
  const updateProfileMutation = useUpdateAccountProfile();

  useEffect(() => {
    if (isProfileError) {
      try {
        window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
        window.dispatchEvent(new Event('babyshalls-auth-changed'));
      } catch {
        // ignore
      }
      setIsAuthenticated(false);
      router.replace('/login');
    }
  }, [isProfileError, router]);

  const [authMode, setAuthMode] = useState<'masuk' | 'daftar'>('masuk');

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>("profil");

  // User Profile (synced from PostgreSQL /api/account/profile)
  const [userProfile, setUserProfile] = useState({
    name: "Dina Permata",
    email: "dina.permata@gmail.com",
    phone: "0812-3456-7890",
    city: "Kota Malang",
    address:
      "Jl. Puncak Tidar No. 18, RT 02 / RW 04, Karangbesuki, Sukun, Kota Malang 65146",
  });

  useEffect(() => {
    if (profileData) {
      setUserProfile((prev) => ({
        ...prev,
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
      }));
    }
  }, [profileData]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Modals & Feedback state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<AccountAddress | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<AccountAddress | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Addresses State from PostgreSQL
  const { data: dbAddresses = [], isLoading: isAddressesLoading } = useAccountAddresses(isAuthenticated);
  const updateAddressMutation = useUpdateAccountAddress();
  const deleteAddressMutation = useDeleteAccountAddress();

  // Orders State from PostgreSQL
  const { data: dbOrders = [], isLoading: isOrdersLoading } = useAccountOrders(isAuthenticated);
  const [orderFilter, setOrderFilter] = useState<string>("semua");

  // Event Tickets State
  const [eventTickets, setEventTickets] = useState<any[]>([]);

  // Book Requests State
  const [bookRequests, setBookRequests] = useState<any[]>([]);

  // Load localStorage data for tickets & requests
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTickets = JSON.parse(
          localStorage.getItem("babyshalls_event_tickets") || "[]",
        );
        if (savedTickets.length > 0) {
          setEventTickets(savedTickets);
        } else {
          setEventTickets([
            {
              ticketId: "EVT-8419",
              eventTitle: "Little Explorers: Nature Craft & Sensory Play",
              eventDate: "Sabtu, 28 November 2026",
              eventTime: "09.30 – 11.30 WIB",
              location: "BabyShalls Citraland Puncak Tidar Blok HH-26, Malang",
              parentName: "Dina Permata",
              childName: "Kenzo (3 th)",
              status: "Tiket Aktif",
            },
          ]);
        }

        const savedRequests = JSON.parse(
          localStorage.getItem("babyshalls_book_requests") || "[]",
        );
        if (savedRequests.length > 0) {
          setBookRequests(savedRequests);
        } else {
          setBookRequests([
            {
              id: "REQ-4819",
              bookTitle: "The Wonderful Things You Will Be",
              author: "Emily Winfield Martin",
              isbn: "978-0385376716",
              format: "Board Book",
              status: "Sedang Dicari",
              createdAt: "2026-11-12T09:00:00Z",
              curatorNote:
                "Sedang dicek ke distributor buku impor di Singapura. Kami kabari via WA maks esok.",
            },
          ]);
        }
      } catch {
        // pass
      }
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        name: userProfile.name,
        phone: userProfile.phone || null,
      });
      setSavedSuccess(true);
      setToast({ type: 'success', message: 'Data profil berhasil diperbarui!' });
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      setToast({ type: 'error', message: 'Gagal memperbarui data profil' });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
      window.dispatchEvent(new Event('babyshalls-auth-changed'));
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Wishlist products
  const wishlistProducts = mockProducts.slice(0, 4);

  // Filtered orders with pagination (Max 5 per page)
  const filteredOrders = dbOrders.filter((o) => {
    if (orderFilter === "semua") return true;
    if (orderFilter === "dikirim") return o.status === "SHIPPED";
    if (orderFilter === "selesai") return o.status === "COMPLETED";
    if (orderFilter === "menunggu")
      return o.status === "PENDING_PAYMENT" || o.status === "PAID" || o.status === "PROCESSING";
    return true;
  });

  const ORDERS_PER_PAGE = 5;
  const [orderPage, setOrderPage] = useState<number>(1);

  useEffect(() => {
    setOrderPage(1);
  }, [orderFilter]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, orderPage]);

  // If user is not authenticated, render dedicated Figma Auth Screen (#169:6204 & #169:6241 - NO Navbar & NO Footer)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 font-sans">
        {/* Top Floating Back Link */}
        <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7A5644] hover:text-[#B05A26] transition-colors group"
          >
            <span className="text-[#B05A26] transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            <span>Kembali ke Butik</span>
          </Link>

          <Link href="/" className="inline-block relative">
            <div className="relative w-28 h-9">
              <Image
                src="/BabyShallsLogo 1.PNG"
                alt="Baby Shall's"
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Card Container (Figma Node #169:6204) */}
        <div className="w-full max-w-4xl bg-white border border-[#E6D2C0] rounded-[6px] overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[560px]">
          {/* Left Panel: Ilustrasi & Sambutan (Figma Node #169:6205, bg #FBE6D8) */}
          <div className="w-full md:w-5/12 bg-[#FBE6D8] p-8 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 shrink-0">
              <Image
                src="/images/mascot/maskot-melambai.png"
                alt="Maskot BabyShalls"
                fill
                priority
                className="object-contain"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#4A2A1C] mb-2 tracking-tight">
              Halo, selamat datang!
            </h2>

            <p className="text-xs text-[#7A5644] max-w-xs leading-relaxed">
              Masuk untuk melacak pesanan buku anak, menyimpan wishlist kurasi,
              dan mengakses tiket QR workshop si kecil.
            </p>
          </div>

          {/* Right Panel: Form Masuk & Daftar (Figma Node #169:6212) */}
          <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
            {/* Tab Selector (Masuk / Daftar) */}
            <div className="flex bg-[#F2E4D6] p-1 rounded-[4px] mb-6">
              <button
                type="button"
                onClick={() => setAuthMode("masuk")}
                className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${authMode === "masuk"
                    ? "bg-white text-[#4A2A1C] shadow-xs"
                    : "text-[#7A5644] hover:text-[#4A2A1C]"
                  }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("daftar")}
                className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${authMode === "daftar"
                    ? "bg-white text-[#4A2A1C] shadow-xs"
                    : "text-[#7A5644] hover:text-[#4A2A1C]"
                  }`}
              >
                Daftar Akun Baru
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Field: Nama Lengkap (Only on Daftar) */}
              {authMode === "daftar" && (
                <div>
                  <label className="block text-[#4A2A1C] font-semibold mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Contoh: Rina Wahyuni"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>
              )}

              {/* Field: Email */}
              {authMode === "daftar" ? (
                <div>
                  <label className="block text-[#4A2A1C] font-semibold mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="email@anda.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[#4A2A1C] font-semibold mb-1">
                    Email atau Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="email@anda.com atau 0812xxxx"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>
              )}

              {/* Field: Nomor WhatsApp (Figma Node #169:6241 - WAJIB DI REGISTER) */}
              {authMode === "daftar" && (
                <div>
                  <label className="block text-[#4A2A1C] font-semibold mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                  <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                    Penting untuk informasi pengiriman resi &amp; tiket workshop
                    anak.
                  </span>
                </div>
              )}

              {/* Field: Kata Sandi */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#4A2A1C] font-semibold">
                    Kata Sandi *
                  </label>
                  {authMode === "masuk" && (
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Fitur pemulihan kata sandi telah dikirim ke email/WhatsApp terdaftar.",
                        )
                      }
                      className="text-[11px] text-[#B05A26] hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={
                    authMode === "daftar"
                      ? "Minimal 8 karakter"
                      : "Masukkan kata sandi"
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
                {authMode === "daftar" && (
                  <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                    Gunakan minimal 8 karakter dengan kombinasi angka dan huruf.
                  </span>
                )}
              </div>

              {/* Remember Me on Masuk */}
              {authMode === "masuk" && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    defaultChecked
                    className="w-4 h-4 accent-[#B05A26] rounded-[2px]"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs text-[#7A5644] cursor-pointer"
                  >
                    Ingat saya di perangkat ini
                  </label>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-xs mt-2"
              >
                {authMode === "masuk"
                  ? "Masuk ke Akun"
                  : "Buat Akun BabyShalls"}
              </button>

              <p className="text-[11px] text-[#7A5644] text-center pt-2 leading-relaxed">
                Belanja tanpa akun? Kamu tetap bisa checkout langsung sebagai
                tamu di keranjang belanja.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View (Figma Node #169:6498)
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">


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

              {/* Navigation Menu (Horizontal pills on mobile/tablet, vertical sidebar on desktop) */}
              <nav className="flex flex-row overflow-x-auto pb-2 lg:pb-0 gap-2 lg:gap-1 text-xs scrollbar-none lg:flex-col">
                <button
                  type="button"
                  onClick={() => setActiveTab("profil")}
                  className={`py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left transition-colors cursor-pointer shrink-0 lg:w-full whitespace-nowrap ${activeTab === "profil"
                      ? "bg-[#FBE6D8] text-[#4A2A1C] font-semibold"
                      : "text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] bg-[#FFFBF7] lg:bg-transparent"
                    }`}
                >
                  <User className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>Profil & Keamanan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("alamat")}
                  className={`py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left transition-colors cursor-pointer shrink-0 lg:w-full whitespace-nowrap ${activeTab === "alamat"
                      ? "bg-[#FBE6D8] text-[#4A2A1C] font-semibold"
                      : "text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] bg-[#FFFBF7] lg:bg-transparent"
                    }`}
                >
                  <MapPin className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>Daftar Alamat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pesanan")}
                  className={`py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left transition-colors cursor-pointer shrink-0 lg:w-full whitespace-nowrap ${activeTab === "pesanan"
                      ? "bg-[#FBE6D8] text-[#4A2A1C] font-semibold"
                      : "text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] bg-[#FFFBF7] lg:bg-transparent"
                    }`}
                >
                  <Package className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <div className="flex items-center gap-2 lg:flex-1 lg:justify-between">
                    <span>Pesanan Saya</span>
                    {dbOrders.length > 0 && (
                      <span className="bg-[#B05A26] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {dbOrders.length}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tiket")}
                  className={`py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left transition-colors cursor-pointer shrink-0 lg:w-full whitespace-nowrap ${activeTab === "tiket"
                      ? "bg-[#FBE6D8] text-[#4A2A1C] font-semibold"
                      : "text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] bg-[#FFFBF7] lg:bg-transparent"
                    }`}
                >
                  <Calendar className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>Tiket Workshop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("request")}
                  className={`py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left transition-colors cursor-pointer shrink-0 lg:w-full whitespace-nowrap ${activeTab === "request"
                      ? "bg-[#FBE6D8] text-[#4A2A1C] font-semibold"
                      : "text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] bg-[#FFFBF7] lg:bg-transparent"
                    }`}
                >
                  <BookOpen className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>Request Buku</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("wishlist")}
                  className={`py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left transition-colors cursor-pointer shrink-0 lg:w-full whitespace-nowrap ${activeTab === "wishlist"
                      ? "bg-[#FBE6D8] text-[#4A2A1C] font-semibold"
                      : "text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C] bg-[#FFFBF7] lg:bg-transparent"
                    }`}
                >
                  <Heart className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>Wishlist Favorit</span>
                </button>

                <div className="pt-0 lg:pt-3 lg:mt-3 border-t-0 lg:border-t border-[#F2E4D6] shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="py-2 px-3 sm:py-2.5 rounded-[2px] flex items-center gap-2 sm:gap-3 text-left text-[#C0392B] hover:bg-[#FEECE8] transition-colors cursor-pointer font-medium whitespace-nowrap lg:w-full"
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
              {activeTab === "profil" && (
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

                    <form
                      onSubmit={handleSaveProfile}
                      className="space-y-4 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                name: e.target.value,
                              })
                            }
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
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[#7A5644] font-medium">
                              Alamat Email
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsEmailModalOpen(true)}
                              className="text-[11px] text-[#B05A26] font-semibold hover:underline cursor-pointer"
                            >
                              Ganti Email (OTP)
                            </button>
                          </div>
                          <input
                            type="email"
                            readOnly
                            value={userProfile.email}
                            className="w-full px-3 py-2 border border-[#E6D2C0] bg-[#FFFBF7] rounded-[2px] text-[#4A2A1C] cursor-not-allowed select-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Kota Domisili
                          </label>
                          <input
                            type="text"
                            value={userProfile.city}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                city: e.target.value,
                              })
                            }
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

                    {passwordMsg && (
                      <div className="mb-4 p-3 bg-[#DDF1E5] text-[#2A6E37] border border-[#A7D7B5] rounded-[2px] text-xs font-medium flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{passwordMsg}</span>
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setPasswordMsg(
                          "Kata sandi berhasil diperbarui dengan aman!",
                        );
                        setToast({
                          type: 'success',
                          message: 'Kata sandi berhasil diperbarui dengan aman!',
                        });
                        setTimeout(() => setPasswordMsg(""), 3000);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Kata Sandi Lama
                          </label>
                          <input
                            type="password"
                            placeholder="Masukkan sandi saat ini"
                            defaultValue="••••••••"
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
                        type="submit"
                        className="px-6 py-2.5 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-xs rounded-[2px] transition-colors cursor-pointer"
                      >
                        Update Kata Sandi
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: DAFTAR ALAMAT */}
              {activeTab === "alamat" && (
                <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-[#F2E4D6]">
                    <div>
                      <h2 className="text-lg font-medium text-[#4A2A1C]">
                        Daftar Alamat Pengiriman
                      </h2>
                      <p className="text-xs text-[#7A5644] mt-0.5">
                        Kelola alamat pengiriman pesanan buku dan hampers Anda
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressToEdit(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Alamat Baru</span>
                    </button>
                  </div>

                  {/* List of Addresses from PostgreSQL */}
                  {isAddressesLoading ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-2 text-xs text-[#7A5644]">
                      <Loader2 className="w-6 h-6 text-[#B05A26] animate-spin" />
                      <span>Memuat daftar alamat tersimpan...</span>
                    </div>
                  ) : dbAddresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {dbAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-5 rounded-[2px] relative transition-all border ${
                            addr.isDefault
                              ? "border-[#B05A26] bg-[#FFFBF7]"
                              : "border-[#E6D2C0] bg-white hover:border-[#B05A26]/50"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#4A2A1C]">
                                {addr.receiverName} ({addr.label})
                              </span>
                              {addr.isDefault && (
                                <span className="bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-semibold px-2 py-0.5 rounded-[2px]">
                                  Utama
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await updateAddressMutation.mutateAsync({ id: addr.id, isDefault: true });
                                      setToast({
                                        type: 'success',
                                        message: `Alamat "${addr.label}" berhasil dijadikan alamat utama!`,
                                      });
                                    } catch {
                                      setToast({
                                        type: 'error',
                                        message: 'Gagal mengubah alamat utama',
                                      });
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#7A5644] hover:text-[#2A6E37] bg-[#FFFBF7] hover:bg-[#F2FAF4] border border-[#E6D2C0] hover:border-[#A7DBB8] rounded-[2px] transition-colors cursor-pointer"
                                >
                                  <Check className="w-3 h-3 text-[#2A6E37]" />
                                  <span>Jadikan Utama</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setAddressToEdit(addr);
                                  setIsAddressModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#B05A26] hover:bg-[#FFF6EA] border border-[#E6D2C0] hover:border-[#B05A26] rounded-[2px] font-medium transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Ubah</span>
                              </button>
                              {dbAddresses.length > 1 && !addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => setAddressToDelete(addr)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#C0392B] hover:bg-[#FDF0ED] border border-[#E6D2C0] hover:border-[#F5C2B8] rounded-[2px] font-medium transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-[#7A5644] mb-1">
                            {addr.receiverPhone}
                          </p>
                          <p className="text-xs text-[#4A2A1C] max-w-2xl leading-relaxed">
                            {addr.streetAddress}, {addr.subdistrict}, {addr.city} {addr.postalCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-[#E6D2C0] rounded-[2px] text-center text-xs text-[#7A5644]">
                      Belum ada alamat pengiriman tersimpan. Silakan klik tombol &quot;Tambah Alamat Baru&quot;.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PESANAN SAYA (Figma Node #169:7140) */}
              {activeTab === "pesanan" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#F2E4D6]">
                    <div>
                      <h2 className="text-lg font-medium text-[#4A2A1C]">
                        Riwayat Pesanan ({filteredOrders.length})
                      </h2>
                      <p className="text-xs text-[#7A5644] mt-0.5">
                        Pantau status pesanan dan pelacakan resi pengiriman buku Anda
                      </p>
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { key: "semua", label: "Semua" },
                        { key: "menunggu", label: "Menunggu" },
                        { key: "dikirim", label: "Dikirim" },
                        { key: "selesai", label: "Selesai" },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setOrderFilter(tab.key)}
                          className={`px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
                            orderFilter === tab.key
                              ? "bg-[#B05A26] text-white font-medium"
                              : "bg-white border border-[#E6D2C0] text-[#7A5644] hover:border-[#B05A26]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders List Cards */}
                  {isOrdersLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#7A5644]">
                      <Loader2 className="w-6 h-6 text-[#B05A26] animate-spin" />
                      <span>Memuat riwayat pesanan...</span>
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <>
                      {paginatedOrders.map((ord) => {
                      const statusBadge = (() => {
                        switch (ord.status) {
                          case 'COMPLETED':
                            return { label: 'Selesai', className: 'bg-[#DDF1E5] text-[#2A6E37]' };
                          case 'SHIPPED':
                            return { label: 'Sedang Dikirim', className: 'bg-[#E3EDF9] text-[#2C5282]' };
                          case 'PROCESSING':
                            return { label: 'Sedang Disiapkan', className: 'bg-[#FFF6EA] text-[#B05A26]' };
                          case 'PAID':
                            return { label: 'Sudah Dibayar', className: 'bg-[#EBF8FF] text-[#2B6CB0]' };
                          case 'PENDING_PAYMENT':
                            return { label: 'Menunggu Pembayaran', className: 'bg-[#FFF6EA] text-[#B05A26]' };
                          case 'CANCELLED':
                            return { label: 'Dibatalkan', className: 'bg-[#FDF0ED] text-[#C0392B]' };
                          default:
                            return { label: ord.status, className: 'bg-[#FFF6EA] text-[#B05A26]' };
                        }
                      })();

                      return (
                        <div
                          key={ord.id || ord.orderNumber}
                          className="bg-white border border-[#F2E4D6] rounded-[2px] p-5 sm:p-6 shadow-xs flex flex-col gap-4"
                        >
                          {/* Header card */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F2E4D6] text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-[#4A2A1C]">
                                No. Pesanan: {ord.orderNumber}
                              </span>
                              <span className="text-[#7A5644]">
                                {new Date(ord.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>

                            <span
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-[2px] ${statusBadge.className}`}
                            >
                              {statusBadge.label}
                            </span>
                          </div>

                          {/* Items list */}
                          <div className="flex flex-col gap-3">
                            {ord.items?.map((item: any, idx: number) => {
                              const images = Array.isArray(item.product?.images)
                                ? (item.product.images as string[])
                                : [];
                              const cover = images[0] || "/images/products/p-1-little-bear.png";

                              return (
                                <div
                                  key={item.id || idx}
                                  className="p-3 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <div className="relative w-14 h-14 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0 border border-[#E6D2C0]">
                                      <Image
                                        src={cover}
                                        alt={item.product?.name || "Buku BabyShalls"}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-xs font-semibold text-[#4A2A1C] truncate">
                                        {item.product?.name || "Buku Edukasi"}
                                      </h4>
                                      <span className="text-[11px] text-[#7A5644] block">
                                        {item.quantity} × {formatIDR(item.price)}
                                      </span>
                                    </div>
                                  </div>

                                  {ord.status === 'COMPLETED' && (
                                    <a
                                      href="https://maps.google.com/?q=BabyShalls+Malang"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBF7] border border-[#E6D2C0] hover:border-[#B05A26] text-[#B05A26] text-xs font-semibold rounded-[2px] transition-colors"
                                      title="Beri ulasan dan rating untuk BabyShalls di Google Maps"
                                    >
                                      <Star className="w-3.5 h-3.5 fill-[#E5A83B] text-[#E5A83B]" />
                                      <span>Ulas di Google Maps</span>
                                      <ExternalLink className="w-3 h-3 text-[#A89080]" />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Delivery info & actions */}
                          <div className="pt-3 border-t border-[#F2E4D6] flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[#7A5644] text-[11px]">
                                Kurir: <strong>{ord.courierCode || 'KiriminAja Malang'}</strong>
                              </span>
                              {ord.waybillNumber && (
                                <span className="text-[11px] font-mono text-[#B05A26] bg-[#FFF6EA] px-2 py-0.5 rounded-[2px] border border-[#E6D2C0]">
                                  Resi: {ord.waybillNumber}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <div>
                                <span className="text-[#7A5644] text-[11px] mr-1.5">Total:</span>
                                <span className="font-bold text-[#B05A26] text-sm">
                                  {formatIDR(ord.grandTotal || ord.totalAmount)}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedTrackingOrder(ord.orderNumber)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF6EA] border border-[#B05A26] text-[#B05A26] hover:bg-[#B05A26] hover:text-white font-medium text-xs rounded-[2px] transition-colors cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Lacak Resi</span>
                              </button>

                              <Link
                                href="/shop"
                                className="px-4 py-1.5 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-xs rounded-[2px] transition-colors"
                              >
                                Beli Lagi
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Pagination (Max 5 items per page) */}
                    {totalOrderPages > 1 && (
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#7A5644]">
                        <span>
                          Menampilkan{' '}
                          <strong>
                            {(orderPage - 1) * ORDERS_PER_PAGE + 1} -{' '}
                            {Math.min(orderPage * ORDERS_PER_PAGE, filteredOrders.length)}
                          </strong>{' '}
                          dari <strong>{filteredOrders.length}</strong> pesanan
                        </span>

                        <div className="flex items-center gap-1 self-center sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setOrderPage((p) => Math.max(p - 1, 1))}
                            disabled={orderPage === 1}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] hover:bg-[#FFF6EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Sebelumnya</span>
                          </button>

                          <div className="flex items-center gap-1 px-1">
                            {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setOrderPage(p)}
                                className={`w-7 h-7 rounded-[2px] text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                                  orderPage === p
                                    ? 'bg-[#B05A26] text-white'
                                    : 'bg-white border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA]'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setOrderPage((p) => Math.min(p + 1, totalOrderPages))}
                            disabled={orderPage === totalOrderPages}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] hover:bg-[#FFF6EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <span>Selanjutnya</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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
              {activeTab === "tiket" && (
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
                            {tkt.status || "Tiket Aktif"}
                          </span>
                          <span className="text-xs text-[#7A5644]">
                            Ref: {tkt.ticketId}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-[#4A2A1C] mb-2">
                          {tkt.eventTitle}
                        </h3>

                        <div className="space-y-1 text-xs text-[#7A5644]">
                          <p>
                            📅 <strong>{tkt.eventDate}</strong> ·{" "}
                            {tkt.eventTime}
                          </p>
                          <p>📍 {tkt.location}</p>
                          <p>
                            👤 Peserta: <strong>{tkt.childName}</strong>{" "}
                            (Pendamping: {tkt.parentName})
                          </p>
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
              {activeTab === "request" && (
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
                            src={
                              req.coverImage ||
                              "/images/products/p-1-little-bear.png"
                            }
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
                            Penulis: {req.author || "-"} · Format: {req.format}
                          </p>
                          {req.isbn && (
                            <p className="text-[11px] text-[#7A5644]">
                              ISBN: {req.isbn}
                            </p>
                          )}

                          {req.curatorNote && (
                            <div className="mt-3 p-3 bg-[#FFFBF7] border border-[#E6D2C0] rounded-[2px] text-xs text-[#7A5644]">
                              <strong>Catatan Kurator:</strong>{" "}
                              {req.curatorNote}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: WISHLIST FAVORIT (Figma Node #169:8327) */}
              {activeTab === "wishlist" && (
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

      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Modals for Sprint Task #2 */}
      <EmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={userProfile.email}
        onSuccess={(newEmail) => {
          setUserProfile((p) => ({ ...p, email: newEmail }));
          setSavedSuccess(true);
          setToast({ type: 'success', message: `Email akun berhasil diperbarui ke ${newEmail}` });
          setTimeout(() => setSavedSuccess(false), 3000);
        }}
      />

      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setAddressToEdit(null);
        }}
        addressToEdit={addressToEdit}
        defaultReceiverName={userProfile.name}
        defaultPhone={userProfile.phone}
        onSuccess={(msg) => setToast({ type: 'success', message: msg })}
      />

      <DeleteAddressModal
        isOpen={Boolean(addressToDelete)}
        onClose={() => setAddressToDelete(null)}
        address={addressToDelete}
        isDeleting={deleteAddressMutation.isPending}
        onConfirm={async () => {
          if (!addressToDelete) return;
          try {
            await deleteAddressMutation.mutateAsync(addressToDelete.id);
            setToast({
              type: 'success',
              message: `Alamat "${addressToDelete.label}" berhasil dihapus!`,
            });
            setAddressToDelete(null);
          } catch {
            setToast({
              type: 'error',
              message: 'Gagal menghapus alamat pengiriman',
            });
          }
        }}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          handleLogout();
        }}
      />

      <OrderTrackingModal
        isOpen={Boolean(selectedTrackingOrder)}
        onClose={() => setSelectedTrackingOrder(null)}
        orderNumber={selectedTrackingOrder}
      />
    </div>
  );
}
