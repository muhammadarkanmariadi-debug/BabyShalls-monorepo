'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  Search,
  X,
  QrCode,
  Ticket,
  MessageCircle,
  RefreshCw,
  Plus,
  Star,
  Check,
  CreditCard,
} from 'lucide-react';
import { formatIDR } from '../../lib/utils';

// -------------------------------------------------------------
// Type Definitions
// -------------------------------------------------------------
type OrderStatus = 'BELUM_BAYAR' | 'DIKEMAS' | 'DIKIRIM' | 'SELESAI' | 'DIBATALKAN';

interface OrderItem {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  imageBg: string;
}

interface OrderRecord {
  orderNumber: string;
  date: string;
  status: OrderStatus;
  courier: string;
  courierService: string;
  trackingNumber?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  isGiftWrapping: boolean;
  giftNote?: string;
  timeline?: { time: string; title: string; location: string }[];
}

interface AddressItem {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface EventTicket {
  id: string;
  code: string;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  childName: string;
  childAge: string;
  parentName: string;
  relationship: string;
  status: 'AKTIF' | 'SELESAI';
  price: number;
}

// -------------------------------------------------------------
// Mock Data
// -------------------------------------------------------------
const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'BS-20261109-082',
    date: '9 Nov 2026, 14:20 WIB',
    status: 'BELUM_BAYAR',
    courier: 'J&T Express (KiriminAja)',
    courierService: 'EZ (Reguler)',
    items: [
      {
        id: 'p-1',
        title: 'Montessori Wooden Geometric Puzzle',
        category: 'Mainan Kayu SNI • Usia 1-3 Tahun',
        price: 185000,
        quantity: 1,
        imageBg: 'from-[#FDF3D6] to-[#FCE6BD]',
      },
    ],
    subtotal: 185000,
    shippingCost: 18000,
    discount: 20000,
    total: 183000,
    isGiftWrapping: true,
    giftNote: 'Selamat ulang tahun ke-2 untuk adik tersayang!',
  },
  {
    orderNumber: 'BS-20261108-001',
    date: '8 Nov 2026, 10:15 WIB',
    status: 'DIKIRIM',
    courier: 'J&T Express (KiriminAja)',
    courierService: 'EZ (Reguler)',
    trackingNumber: 'JX8920192801ID',
    items: [
      {
        id: 'p-2',
        title: 'Look and Grow: Nature & Garden',
        category: 'Board Book Impor • Usia 1-3 Tahun',
        price: 245000,
        quantity: 1,
        imageBg: 'from-[#EBF2E0] to-[#D5E4CA]',
      },
      {
        id: 'p-3',
        title: 'Wooden Rainbow Stacker (Handmade Malang)',
        category: 'Kayu Edukasi • Non-Toxic Water Paint',
        price: 197500,
        quantity: 1,
        imageBg: 'from-[#FFE4D0] to-[#F6B79B]',
      },
    ],
    subtotal: 442500,
    shippingCost: 18000,
    discount: 0,
    total: 460500,
    isGiftWrapping: true,
    giftNote: 'Hadiah ceria untuk Arka belajar warna.',
    timeline: [
      { time: '9 Nov 2026 - 15:40', title: 'Paket sedang dibawa kurir J&T Malang ke alamat penerima', location: 'Klojen, Kota Malang' },
      { time: '9 Nov 2026 - 08:30', title: 'Paket telah tiba di Hub Sortir Malang', location: 'DC Malang Pandanwangi' },
      { time: '8 Nov 2026 - 17:00', title: 'Paket di-pickup oleh kurir KiriminAja dari Butik BabyShalls', location: 'Jl. Cempaka No. 12, Malang' },
      { time: '8 Nov 2026 - 10:30', title: 'Pesanan selesai dikemas dengan kertas kado cantik', location: 'Butik BabyShalls Malang' },
    ],
  },
  {
    orderNumber: 'BS-20261105-045',
    date: '5 Nov 2026, 16:00 WIB',
    status: 'DIKEMAS',
    courier: 'SiCepat (KiriminAja)',
    courierService: 'SIUNTUNG',
    items: [
      {
        id: 'p-4',
        title: 'Little Friends: Farm Animal Sounds Board Book',
        category: 'Buku Anak Suara Interaktif',
        price: 175000,
        quantity: 1,
        imageBg: 'from-[#E0F2FE] to-[#BAE6FD]',
      },
    ],
    subtotal: 175000,
    shippingCost: 17000,
    discount: 15000,
    total: 177000,
    isGiftWrapping: false,
  },
  {
    orderNumber: 'BS-20261025-014',
    date: '25 Okt 2026, 09:20 WIB',
    status: 'SELESAI',
    courier: 'SiCepat (KiriminAja)',
    courierService: 'SIUNTUNG',
    trackingNumber: 'SI0019283749ID',
    items: [
      {
        id: 'p-5',
        title: 'Baby Sensory: Touch & Feel Animals',
        category: 'Touch & Feel Board Book',
        price: 165000,
        quantity: 1,
        imageBg: 'from-[#F3E8FF] to-[#DDD6FE]',
      },
    ],
    subtotal: 165000,
    shippingCost: 17000,
    discount: 0,
    total: 182000,
    isGiftWrapping: true,
  },
];

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    label: 'Rumah Utama',
    recipientName: 'Bunda Amanda Rahma',
    phone: '0812-3456-7890',
    fullAddress: 'Jl. Merbabu No. 15, RT 02 / RW 05, Kel. Oro-oro Dowo, Kec. Klojen',
    city: 'Kota Malang, Jawa Timur',
    postalCode: '65111',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Rumah Eyang (Alamat Hadiah)',
    recipientName: 'Ibu Hj. Sulastri / Amanda',
    phone: '0813-9876-5432',
    fullAddress: 'Jl. Ijen No. 44, Gading Kasri, Kec. Klojen',
    city: 'Kota Malang, Jawa Timur',
    postalCode: '65115',
    isDefault: false,
  },
];

const INITIAL_TICKETS: EventTicket[] = [
  {
    id: 'tkt-1',
    code: 'BS-EVT-2286',
    eventTitle: 'Wooden Toy Craft Workshop & Storytelling',
    date: 'Sabtu, 30 Nov 2026',
    time: '10.00 - 12.00 WIB',
    location: 'Butik BabyShalls (Jl. Cempaka No. 12, Klojen, Malang)',
    childName: 'Arka',
    childAge: '2.5 Tahun',
    parentName: 'Bunda Amanda Rahma',
    relationship: 'Bunda',
    status: 'AKTIF',
    price: 85000,
  },
];

const ACTIVE_VOUCHERS = [
  { code: 'BABYNEW', title: 'Diskon 15% Bunda Baru', desc: 'Maks. Rp 50.000 tanpa min. belanja', exp: '30 Nov 2026' },
  { code: 'MALANGCOZY', title: 'Potongan Rp 20.000', desc: 'Spesial pengiriman Malang Area', exp: '15 Des 2026' },
  { code: 'ONGKIRHEMAT', title: 'Hemat Ongkir Rp 10.000', desc: 'Subsidi ongkir kurir KiriminAja', exp: '31 Des 2026' },
];

export default function AccountPage() {
  // Navigation tabs (Shopee style)
  const [activeMenu, setActiveMenu] = useState<
    'orders' | 'profile' | 'addresses' | 'tickets' | 'vouchers'
  >('orders');

  // Shopee order status tabs
  const [orderStatusTab, setOrderStatusTab] = useState<
    'ALL' | 'BELUM_BAYAR' | 'DIKEMAS' | 'DIKIRIM' | 'SELESAI' | 'DIBATALKAN'
  >('ALL');

  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);

  // Modals state
  const [trackingModalOrder, setTrackingModalOrder] = useState<OrderRecord | null>(null);
  const [ticketModalItem, setTicketModalItem] = useState<EventTicket | null>(null);
  const [qrisModalOrder, setQrisModalOrder] = useState<OrderRecord | null>(null);

  // New address form modal
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrRecipient, setNewAddrRecipient] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrPostal, setNewAddrPostal] = useState('');

  // Profile edit state
  const [profileName, setProfileName] = useState('Amanda Rahma, S.Psi');
  const [profileEmail, setProfileEmail] = useState('amanda.rahma@email.com');
  const [profilePhone, setProfilePhone] = useState('0812-3456-7890');
  const [profileGender, setProfileGender] = useState<'Perempuan' | 'Laki-Laki'>('Perempuan');
  const [profileChild, setProfileChild] = useState('Arka (2.5 Tahun)');
  const [profileSaved, setProfileSaved] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (orderStatusTab !== 'ALL' && order.status !== orderStatusTab) {
      return false;
    }
    // Search query
    if (searchOrderQuery.trim()) {
      const q = searchOrderQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.title.toLowerCase().includes(q));
      return matchNumber || matchItem;
    }
    return true;
  });

  // Action handlers
  const handleCancelOrder = (orderNumber: string) => {
    if (confirm(`Yakin ingin membatalkan pesanan ${orderNumber}?`)) {
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'DIBATALKAN' } : o))
      );
    }
  };

  const handleConfirmReceived = (orderNumber: string) => {
    if (confirm(`Konfirmasi paket ${orderNumber} telah diterima dengan baik?`)) {
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'SELESAI' } : o))
      );
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Hapus alamat pengiriman ini?')) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrRecipient || !newAddrPhone || !newAddrStreet) return;
    const newAddr: AddressItem = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      recipientName: newAddrRecipient,
      phone: newAddrPhone,
      fullAddress: newAddrStreet,
      city: newAddrCity || 'Kota Malang',
      postalCode: newAddrPostal || '65111',
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    setIsAddingAddress(false);
    // Reset form
    setNewAddrLabel('');
    setNewAddrRecipient('');
    setNewAddrPhone('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrPostal('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8A6A55] mb-6">
          <Link href="/" className="hover:text-[#DA7A5B]">Beranda</Link>
          <span>/</span>
          <span className="text-[#3E2415] font-bold">Portal Pengguna & Kelola Pesanan</span>
        </div>

        {/* Layout Grid: Sidebar (Left) + Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ============================================================== */}
          {/* LEFT SIDEBAR: SHOPEE STYLE NAVIGATION                          */}
          {/* ============================================================== */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* User Profile Capsule */}
            <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-full bg-[#FFE4D0] border-2 border-[#F6B79B] flex items-center justify-center text-[#DA7A5B] flex-shrink-0 shadow-2xs">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-serif font-bold text-sm text-[#3E2415] block truncate">
                  Bunda Amanda Rahma
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF2E0] text-[#709154] text-[10px] font-bold mt-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Member Gold BabyShalls</span>
                </span>
              </div>
            </div>

            {/* Menu List */}
            <nav className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-3 shadow-xs space-y-1 text-xs">
              
              {/* Group: Akun Saya */}
              <div className="px-3 py-2 text-[10px] font-bold text-[#8A6A55] uppercase tracking-wider">
                Kelola Akun
              </div>

              <button
                onClick={() => setActiveMenu('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                  activeMenu === 'profile'
                    ? 'bg-[#DA7A5B] text-white shadow-2xs'
                    : 'text-[#502E1E] hover:bg-[#FCF6EC]'
                }`}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Profil Saya</span>
              </button>

              <button
                onClick={() => setActiveMenu('addresses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                  activeMenu === 'addresses'
                    ? 'bg-[#DA7A5B] text-white shadow-2xs'
                    : 'text-[#502E1E] hover:bg-[#FCF6EC]'
                }`}
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Alamat Saya ({addresses.length})</span>
              </button>

              {/* Group: Pesanan & Workshop */}
              <div className="pt-2 px-3 py-2 text-[10px] font-bold text-[#8A6A55] uppercase tracking-wider border-t border-[#EEDBC9]/60">
                Aktivitas & Belanja
              </div>

              <button
                onClick={() => setActiveMenu('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                  activeMenu === 'orders'
                    ? 'bg-[#DA7A5B] text-white shadow-2xs'
                    : 'text-[#502E1E] hover:bg-[#FCF6EC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span>Pesanan Saya</span>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeMenu === 'orders' ? 'bg-white/20 text-white' : 'bg-[#FFE4D0] text-[#DA7A5B]'
                  }`}
                >
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveMenu('tickets')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                  activeMenu === 'tickets'
                    ? 'bg-[#DA7A5B] text-white shadow-2xs'
                    : 'text-[#502E1E] hover:bg-[#FCF6EC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-4 h-4 flex-shrink-0" />
                  <span>E-Tiket Workshop</span>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeMenu === 'tickets' ? 'bg-white/20 text-white' : 'bg-[#EBF2E0] text-[#709154]'
                  }`}
                >
                  {INITIAL_TICKETS.length}
                </span>
              </button>

              <button
                onClick={() => setActiveMenu('vouchers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                  activeMenu === 'vouchers'
                    ? 'bg-[#DA7A5B] text-white shadow-2xs'
                    : 'text-[#502E1E] hover:bg-[#FCF6EC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 flex-shrink-0" />
                  <span>Voucher Diskon</span>
                </div>
                <span className="text-[10px] font-bold text-[#DA7A5B]">3 Kupon</span>
              </button>

              {/* WhatsApp direct help */}
              <div className="pt-3 border-t border-[#EEDBC9]/60">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20BabyShalls%20Malang,%20saya%20butuh%20bantuan%20terkait%20pesanan%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#EBF2E0] hover:bg-[#D5E4CA] text-[#709154] font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Bantuan Admin WA</span>
                </a>
              </div>

            </nav>

          </aside>

          {/* ============================================================== */}
          {/* RIGHT MAIN CONTENT AREA                                         */}
          {/* ============================================================== */}
          <main className="lg:col-span-9 space-y-6">

            {/* TAB 1: PESANAN SAYA (SHOPEE STYLE TABS & CARDS) */}
            {activeMenu === 'orders' && (
              <div className="space-y-4">
                
                {/* Shopee-style Horizontal Status Tabs */}
                <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-1.5 shadow-xs overflow-x-auto flex items-center gap-1 scrollbar-none">
                  {[
                    { id: 'ALL', label: 'Semua Pesanan' },
                    { id: 'BELUM_BAYAR', label: 'Belum Bayar' },
                    { id: 'DIKEMAS', label: 'Sedang Dikemas' },
                    { id: 'DIKIRIM', label: 'Sedang Dikirim' },
                    { id: 'SELESAI', label: 'Selesai' },
                    { id: 'DIBATALKAN', label: 'Dibatalkan' },
                  ].map((tab) => {
                    const count = tab.id === 'ALL'
                      ? orders.length
                      : orders.filter((o) => o.status === tab.id).length;
                    const isActive = orderStatusTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setOrderStatusTab(tab.id as any)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#DA7A5B] text-white shadow-2xs'
                            : 'text-[#6B3F2A] hover:bg-[#FCF6EC]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {count > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                              isActive ? 'bg-white/20 text-white' : 'bg-[#EEDBC9] text-[#502E1E]'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar for Orders */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchOrderQuery}
                    onChange={(e) => setSearchOrderQuery(e.target.value)}
                    placeholder="Cari berdasarkan nomor pesanan (BS-...) atau judul buku & mainan..."
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl text-xs text-[#3E2415] placeholder-[#8A6A55] focus:outline-none focus:border-[#DA7A5B] shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-[#8A6A55] absolute left-3.5 top-3.5" />
                  {searchOrderQuery && (
                    <button
                      onClick={() => setSearchOrderQuery('')}
                      className="absolute right-3.5 top-3.5 text-[#8A6A55] hover:text-[#3E2415]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-3xl p-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#FFE4D0] text-[#DA7A5B] flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#3E2415]">
                      Belum Ada Pesanan di Kategori Ini
                    </h3>
                    <p className="text-xs text-[#8A6A55] max-w-sm mx-auto">
                      Jelajahi butik buku anak kurasi dan mainan kayu edukasi kami untuk si kecil.
                    </p>
                    <Link
                      href="/catalog"
                      className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs shadow-2xs transition-all"
                    >
                      Mulai Belanja Sekarang
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.orderNumber}
                        className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
                      >
                        {/* Header Shopee Card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEDBC9]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#3E2415]">
                              Butik BabyShalls Malang
                            </span>
                            <span className="text-[#8A6A55] text-xs">&bull;</span>
                            <span className="font-mono text-xs text-[#8A6A55]">
                              {order.orderNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#8A6A55]">{order.date}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                order.status === 'BELUM_BAYAR'
                                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                                  : order.status === 'DIKEMAS'
                                  ? 'bg-[#FEF3C7] text-[#D97706]'
                                  : order.status === 'DIKIRIM'
                                  ? 'bg-[#DBEAFE] text-[#2563EB]'
                                  : order.status === 'SELESAI'
                                  ? 'bg-[#EBF2E0] text-[#709154]'
                                  : 'bg-[#F1F5F9] text-[#64748B]'
                              }`}
                            >
                              {order.status === 'BELUM_BAYAR'
                                ? 'Belum Bayar'
                                : order.status === 'DIKEMAS'
                                ? 'Sedang Dikemas'
                                : order.status === 'DIKIRIM'
                                ? 'Sedang Dikirim'
                                : order.status === 'SELESAI'
                                ? 'Pesanan Selesai'
                                : 'Dibatalkan'}
                            </span>
                          </div>
                        </div>

                        {/* Items List inside Order */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-3.5">
                              <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.imageBg} flex items-center justify-center flex-shrink-0 border border-[#EEDBC9] shadow-2xs`}
                              >
                                <Package className="w-6 h-6 text-[#8A6A55]" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-[#3E2415] truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[11px] text-[#8A6A55] block">
                                  {item.category}
                                </span>
                                <span className="text-[11px] text-[#502E1E] mt-0.5 block">
                                  Jumlah: {item.quantity} x {formatIDR(item.price)}
                                </span>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <span className="font-bold text-xs text-[#3E2415]">
                                  {formatIDR(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Gift Wrap Notice if active */}
                        {order.isGiftWrapping && (
                          <div className="p-2.5 rounded-xl bg-[#FCF6EC] border border-[#EEDBC9] text-[11px] text-[#6B3F2A] flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-[#709154]">
                              <Check className="w-3.5 h-3.5" />
                              <span>Layanan Bungkus Kado & Kartu Ucapan Aktif</span>
                            </span>
                            {order.giftNote && (
                              <span className="italic truncate max-w-xs text-[#8A6A55]">
                                &ldquo;{order.giftNote}&rdquo;
                              </span>
                            )}
                          </div>
                        )}

                        {/* Courier / Tracking Line */}
                        <div className="p-3 rounded-xl bg-[#FFF8EF] border border-[#EEDBC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#DA7A5B] flex-shrink-0" />
                            <div>
                              <span className="text-[#8A6A55] block">
                                Kurir: <strong>{order.courier}</strong> ({order.courierService})
                              </span>
                              {order.trackingNumber ? (
                                <span className="font-mono font-bold text-[#3E2415]">
                                  No. Resi: {order.trackingNumber}
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#8A6A55]">
                                  Nomor resi otomatis di-update setelah di-pickup kurir di Malang
                                </span>
                              )}
                            </div>
                          </div>

                          {order.trackingNumber && (
                            <button
                              onClick={() => setTrackingModalOrder(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFE4D0] hover:bg-[#F6B79B] text-[#502E1E] font-bold text-[11px] transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5 text-[#DA7A5B]" />
                              <span>Lacak Paket Real-Time</span>
                            </button>
                          )}
                        </div>

                        {/* Card Footer: Total & Actions (Shopee Style) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EEDBC9]">
                          <div className="text-xs">
                            <span className="text-[#8A6A55]">Total Pesanan: </span>
                            <span className="font-serif font-extrabold text-base text-[#DA7A5B]">
                              {formatIDR(order.total)}
                            </span>
                          </div>

                          {/* Action Buttons depending on order status */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {order.status === 'BELUM_BAYAR' && (
                              <>
                                <button
                                  onClick={() => handleCancelOrder(order.orderNumber)}
                                  className="px-3.5 py-1.5 rounded-xl border border-[#EEDBC9] hover:bg-[#FEE2E2] hover:text-[#DC2626] text-xs font-bold text-[#8A6A55] transition-colors"
                                >
                                  Batalkan Pesanan
                                </button>
                                <button
                                  onClick={() => setQrisModalOrder(order)}
                                  className="px-4 py-1.5 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Bayar Sekarang (QRIS)</span>
                                </button>
                              </>
                            )}

                            {order.status === 'DIKEMAS' && (
                              <>
                                <a
                                  href={`https://wa.me/6281234567890?text=Halo%20Admin%20BabyShalls,%20saya%20ingin%20tanya%20status%20pesanan%20${order.orderNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-1.5 rounded-xl border border-[#EEDBC9] hover:bg-[#FCF6EC] text-xs font-bold text-[#502E1E] flex items-center gap-1.5"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-[#709154]" />
                                  <span>Chat Butik WA</span>
                                </a>
                                <span className="text-[11px] text-[#709154] font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Sedang disiapkan dengan rapi</span>
                                </span>
                              </>
                            )}

                            {order.status === 'DIKIRIM' && (
                              <>
                                <button
                                  onClick={() => setTrackingModalOrder(order)}
                                  className="px-3.5 py-1.5 rounded-xl border border-[#EEDBC9] hover:bg-[#FCF6EC] text-xs font-bold text-[#502E1E] flex items-center gap-1.5"
                                >
                                  <Truck className="w-3.5 h-3.5 text-[#DA7A5B]" />
                                  <span>Lacak Resi</span>
                                </button>
                                <button
                                  onClick={() => handleConfirmReceived(order.orderNumber)}
                                  className="px-4 py-1.5 rounded-xl bg-[#709154] hover:bg-[#5E7C45] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Pesanan Diterima</span>
                                </button>
                              </>
                            )}

                            {order.status === 'SELESAI' && (
                              <>
                                <Link
                                  href="/catalog"
                                  className="px-3.5 py-1.5 rounded-xl bg-[#FFE4D0] hover:bg-[#F6B79B] text-[#502E1E] text-xs font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-[#DA7A5B]" />
                                  <span>Beli Lagi</span>
                                </Link>
                                <a
                                  href="https://g.page/r/babyshalls-malang/review"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-1.5 rounded-xl border border-[#EEDBC9] hover:bg-[#FCF6EC] text-xs font-bold text-[#502E1E] flex items-center gap-1.5"
                                >
                                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                                  <span>Beri Ulasan</span>
                                </a>
                              </>
                            )}

                            {order.status === 'DIBATALKAN' && (
                              <Link
                                href="/catalog"
                                className="px-3.5 py-1.5 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white text-xs font-bold shadow-2xs"
                              >
                                Belanja Produk Serupa
                              </Link>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: ALAMAT SAYA (MULTI-ALAMAT) */}
            {activeMenu === 'addresses' && (
              <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEDBC9]">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#3E2415]">
                      Buku Alamat Pengiriman
                    </h2>
                    <p className="text-xs text-[#8A6A55] mt-0.5">
                      Kelola alamat pengiriman untuk kemudahan checkout otomatis.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white text-xs font-bold shadow-2xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Alamat Baru</span>
                  </button>
                </div>

                {/* Address Cards List */}
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-[#DA7A5B] bg-[#FFF2EA] shadow-xs'
                          : 'border-[#EEDBC9] bg-white hover:border-[#F6B79B]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-[#3E2415]">
                            {addr.recipientName}
                          </strong>
                          <span className="text-[#8A6A55] text-xs">({addr.phone})</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-[#DA7A5B] text-white text-[10px] font-bold">
                              Alamat Utama
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-[#FCF6EC] border border-[#EEDBC9] text-[10px] font-bold text-[#8A6A55]">
                            {addr.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[#DA7A5B] hover:underline font-bold text-[11px]"
                            >
                              Atur Sebagai Utama
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-[#DC2626] hover:underline text-[11px] font-semibold"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#502E1E] leading-relaxed">
                        {addr.fullAddress}, {addr.city} {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Address Form Modal / Inline */}
                {isAddingAddress && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="p-5 rounded-2xl bg-[#FCF6EC] border-2 border-dashed border-[#DA7A5B] space-y-4 animate-in fade-in-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#EEDBC9]">
                      <h3 className="font-bold text-xs text-[#3E2415] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#DA7A5B]" />
                        <span>Form Tambah Alamat Baru</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="text-[#8A6A55] hover:text-[#3E2415]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-[#502E1E] mb-1">
                          Label Alamat (Contoh: Rumah, Kantor, Alamat Eyang) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          placeholder="Rumah Bunda"
                          className="w-full px-3 py-2 bg-white border border-[#EEDBC9] rounded-xl text-xs focus:outline-none focus:border-[#DA7A5B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#502E1E] mb-1">
                          Nama Penerima *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrRecipient}
                          onChange={(e) => setNewAddrRecipient(e.target.value)}
                          placeholder="Amanda Rahma"
                          className="w-full px-3 py-2 bg-white border border-[#EEDBC9] rounded-xl text-xs focus:outline-none focus:border-[#DA7A5B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#502E1E] mb-1">
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          placeholder="081234567890"
                          className="w-full px-3 py-2 bg-white border border-[#EEDBC9] rounded-xl text-xs focus:outline-none focus:border-[#DA7A5B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#502E1E] mb-1">
                          Kota / Kabupaten *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          placeholder="Kota Malang"
                          className="w-full px-3 py-2 bg-white border border-[#EEDBC9] rounded-xl text-xs focus:outline-none focus:border-[#DA7A5B]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#502E1E] mb-1">
                          Alamat Lengkap (Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan) *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          placeholder="Jl. Merbabu No. 15, RT 02 / RW 05, Klojen"
                          className="w-full px-3 py-2 bg-white border border-[#EEDBC9] rounded-xl text-xs focus:outline-none focus:border-[#DA7A5B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#502E1E] mb-1">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          value={newAddrPostal}
                          onChange={(e) => setNewAddrPostal(e.target.value)}
                          placeholder="65111"
                          className="w-full px-3 py-2 bg-white border border-[#EEDBC9] rounded-xl text-xs focus:outline-none focus:border-[#DA7A5B]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 rounded-xl border border-[#EEDBC9] text-xs font-bold text-[#6B3F2A]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#DA7A5B] text-white text-xs font-bold shadow-2xs hover:bg-[#C46749]"
                      >
                        Simpan Alamat
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* TAB 3: PROFIL SAYA */}
            {activeMenu === 'profile' && (
              <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-[#EEDBC9]">
                  <h2 className="font-serif text-xl font-bold text-[#3E2415]">
                    Profil Saya
                  </h2>
                  <p className="text-xs text-[#8A6A55] mt-0.5">
                    Kelola informasi profil Bunda & si kecil untuk personalisasi kurasi buku.
                  </p>
                </div>

                {profileSaved && (
                  <div className="p-3 rounded-xl bg-[#EBF2E0] border border-[#D5E4CA] text-xs font-bold text-[#709154] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profil berhasil diperbarui!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="max-w-xl space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">
                      Nama Lengkap Bunda / Ayah *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">
                      Alamat Email (Untuk Bukti Pembayaran & Tiket) *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">
                      Nomor WhatsApp (Untuk Notifikasi Resi & Event) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">
                      Jenis Kelamin
                    </label>
                    <div className="flex gap-4 pt-1 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Perempuan"
                          checked={profileGender === 'Perempuan'}
                          onChange={() => setProfileGender('Perempuan')}
                          className="text-[#DA7A5B] focus:ring-[#DA7A5B]"
                        />
                        <span>Perempuan (Bunda)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Laki-Laki"
                          checked={profileGender === 'Laki-Laki'}
                          onChange={() => setProfileGender('Laki-Laki')}
                          className="text-[#DA7A5B] focus:ring-[#DA7A5B]"
                        />
                        <span>Laki-Laki (Ayah)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">
                      Data Anak (Nama & Usia)
                    </label>
                    <input
                      type="text"
                      value={profileChild}
                      onChange={(e) => setProfileChild(e.target.value)}
                      placeholder="Contoh: Adik Arka (2.5 Tahun)"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs shadow-2xs transition-all"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: E-TIKET WORKSHOP DENGAN QR CODE */}
            {activeMenu === 'tickets' && (
              <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-[#EEDBC9]">
                  <h2 className="font-serif text-xl font-bold text-[#3E2415]">
                    E-Tiket Workshop & Kegiatan Butik
                  </h2>
                  <p className="text-xs text-[#8A6A55] mt-0.5">
                    Tunjukkan QR Code e-tiket ini ke kasir/resepsionis Butik BabyShalls Malang untuk check-in.
                  </p>
                </div>

                <div className="space-y-4">
                  {INITIAL_TICKETS.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FCF6EC] border border-[#EEDBC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF2E0] text-[#709154] font-bold text-[10px] uppercase tracking-wider">
                            Tiket Valid
                          </span>
                          <span className="font-mono font-bold text-[#DA7A5B]">
                            {tkt.code}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-bold text-[#3E2415]">
                          {tkt.eventTitle}
                        </h3>

                        <div className="text-[11px] text-[#8A6A55] space-y-0.5">
                          <p>
                            🗓️ <strong>{tkt.date}</strong> &bull; {tkt.time}
                          </p>
                          <p>
                            📍 {tkt.location}
                          </p>
                          <p>
                            👶 Peserta: <strong>{tkt.childName} ({tkt.childAge})</strong> &bull; Pendamping: {tkt.parentName}
                          </p>
                        </div>
                      </div>

                      {/* Prominent QR Button */}
                      <button
                        onClick={() => setTicketModalItem(tkt)}
                        className="px-5 py-3 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-2 flex-shrink-0 transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Buka QR E-Tiket</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: VOUCHER DISKON SAYA */}
            {activeMenu === 'vouchers' && (
              <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-[#EEDBC9]">
                  <h2 className="font-serif text-xl font-bold text-[#3E2415]">
                    Voucher Diskon & Promo Saya
                  </h2>
                  <p className="text-xs text-[#8A6A55] mt-0.5">
                    Gunakan kode voucher ini saat berada di halaman Checkout untuk mendapatkan potongan belanja.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ACTIVE_VOUCHERS.map((v) => (
                    <div
                      key={v.code}
                      className="p-4 rounded-2xl bg-[#FCF6EC] border border-[#EEDBC9] space-y-2 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-sm text-[#DA7A5B] bg-white px-2.5 py-1 rounded-lg border border-[#EEDBC9]">
                          {v.code}
                        </span>
                        <span className="text-[10px] text-[#8A6A55]">
                          Hingga {v.exp}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[#3E2415]">{v.title}</h4>
                      <p className="text-[11px] text-[#8A6A55] leading-relaxed">{v.desc}</p>

                      <div className="pt-2">
                        <Link
                          href="/checkout"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DA7A5B] hover:underline"
                        >
                          <span>Gunakan di Checkout &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: REAL-TIME TRACKING TIMELINE (SHOPEE STYLE)            */}
      {/* ============================================================== */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-3xl max-w-lg w-full p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDBC9]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#3E2415] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#DA7A5B]" />
                  <span>Pelacakan Paket Pengiriman</span>
                </h3>
                <span className="text-[11px] text-[#8A6A55]">
                  Kurir: {trackingModalOrder.courier} &bull; Resi: {trackingModalOrder.trackingNumber}
                </span>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="text-[#8A6A55] hover:text-[#3E2415]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {trackingModalOrder.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs relative">
                  <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        idx === 0 ? 'bg-[#709154]' : 'bg-[#EEDBC9]'
                      }`}
                    />
                    {idx !== (trackingModalOrder.timeline?.length ?? 1) - 1 && (
                      <div className="w-0.5 h-12 bg-[#EEDBC9] my-0.5" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <span className="text-[10px] text-[#8A6A55] block">{step.time}</span>
                    <strong
                      className={`block font-bold text-xs ${
                        idx === 0 ? 'text-[#709154]' : 'text-[#3E2415]'
                      }`}
                    >
                      {step.title}
                    </strong>
                    <span className="text-[11px] text-[#8A6A55] block">{step.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EEDBC9] flex justify-end">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#DA7A5B] text-white text-xs font-bold"
              >
                Tutup Pelacakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: TICKET QR PASS POPUP                                  */}
      {/* ============================================================== */}
      {ticketModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white border border-[#EEDBC9] rounded-3xl max-w-sm w-full p-6 shadow-card text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EEDBC9]">
              <span className="text-xs font-bold text-[#709154] uppercase tracking-wider">
                E-Tiket Masuk Workshop
              </span>
              <button
                onClick={() => setTicketModalItem(null)}
                className="text-[#8A6A55] hover:text-[#3E2415]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-serif text-base font-bold text-[#3E2415]">
                {ticketModalItem.eventTitle}
              </h4>
              <p className="text-[11px] text-[#8A6A55] mt-0.5">
                {ticketModalItem.date} &bull; {ticketModalItem.time}
              </p>
            </div>

            {/* Crisp QR Code Container */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#EEDBC9] inline-block shadow-xs">
              <svg
                width={160}
                height={160}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <rect width="120" height="120" fill="#FFFFFF" rx="8" />
                <rect x="10" y="10" width="30" height="30" rx="3" fill="#3E2415" />
                <rect x="15" y="15" width="20" height="20" rx="2" fill="#FFFFFF" />
                <rect x="20" y="20" width="10" height="10" rx="1.5" fill="#DA7A5B" />
                <rect x="80" y="10" width="30" height="30" rx="3" fill="#3E2415" />
                <rect x="85" y="15" width="20" height="20" rx="2" fill="#FFFFFF" />
                <rect x="90" y="20" width="10" height="10" rx="1.5" fill="#DA7A5B" />
                <rect x="10" y="80" width="30" height="30" rx="3" fill="#3E2415" />
                <rect x="15" y="85" width="20" height="20" rx="2" fill="#FFFFFF" />
                <rect x="20" y="90" width="10" height="10" rx="1.5" fill="#DA7A5B" />
                <rect x="44" y="14" width="6" height="6" fill="#3E2415" />
                <rect x="54" y="14" width="6" height="6" fill="#DA7A5B" />
                <rect x="64" y="14" width="6" height="6" fill="#3E2415" />
                <rect x="44" y="44" width="6" height="6" fill="#DA7A5B" />
                <rect x="54" y="44" width="6" height="6" fill="#3E2415" />
                <rect x="64" y="44" width="6" height="6" fill="#3E2415" />
                <rect x="74" y="44" width="6" height="6" fill="#DA7A5B" />
                <rect x="44" y="64" width="6" height="6" fill="#3E2415" />
                <rect x="64" y="64" width="6" height="6" fill="#DA7A5B" />
                <rect x="44" y="84" width="6" height="6" fill="#DA7A5B" />
                <rect x="54" y="84" width="6" height="6" fill="#3E2415" />
                <rect x="74" y="84" width="6" height="6" fill="#DA7A5B" />
                <rect x="50" y="50" width="20" height="20" rx="4" fill="#DA7A5B" />
                <text x="60" y="63" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">BS</text>
              </svg>
              <span className="font-mono font-extrabold text-sm text-[#DA7A5B] block mt-2">
                {ticketModalItem.code}
              </span>
            </div>

            <div className="text-[11px] text-[#502E1E] space-y-0.5">
              <p>Peserta: <strong>{ticketModalItem.childName} ({ticketModalItem.childAge})</strong></p>
              <p>Pendamping: <strong>{ticketModalItem.parentName}</strong></p>
              <p className="text-[10px] text-[#8A6A55] pt-1">
                Tunjukkan QR ini ke admin/resepsionis Butik BabyShalls Klojen Malang saat hari-H.
              </p>
            </div>

            <button
              onClick={() => setTicketModalItem(null)}
              className="w-full py-2.5 rounded-xl bg-[#DA7A5B] text-white text-xs font-bold"
            >
              Tutup E-Tiket
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: QRIS INSTANT PAYMENT                                  */}
      {/* ============================================================== */}
      {qrisModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white border border-[#EEDBC9] rounded-3xl max-w-sm w-full p-6 shadow-card text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EEDBC9]">
              <span className="text-xs font-bold text-[#DA7A5B] uppercase tracking-wider">
                Pembayaran Instan QRIS
              </span>
              <button
                onClick={() => setQrisModalOrder(null)}
                className="text-[#8A6A55] hover:text-[#3E2415]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-xs text-[#8A6A55]">Total Tagihan:</span>
              <h4 className="font-serif text-2xl font-extrabold text-[#DA7A5B]">
                {formatIDR(qrisModalOrder.total)}
              </h4>
              <span className="text-[11px] font-mono text-[#8A6A55] block">
                {qrisModalOrder.orderNumber}
              </span>
            </div>

            {/* QRIS SVG Visual */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#EEDBC9] inline-block shadow-xs">
              <div className="font-extrabold text-xs text-[#3E2415] mb-2 tracking-widest">
                QRIS &bull; BABYSHALLS
              </div>
              <svg width={140} height={140} viewBox="0 0 140 140" fill="none" className="mx-auto">
                <rect x="10" y="10" width="36" height="36" rx="4" fill="#1A1A1A" />
                <rect x="16" y="16" width="24" height="24" rx="2" fill="#FFFFFF" />
                <rect x="22" y="22" width="12" height="12" rx="1.5" fill="#1A1A1A" />
                <rect x="94" y="10" width="36" height="36" rx="4" fill="#1A1A1A" />
                <rect x="100" y="16" width="24" height="24" rx="2" fill="#FFFFFF" />
                <rect x="106" y="22" width="12" height="12" rx="1.5" fill="#1A1A1A" />
                <rect x="10" y="94" width="36" height="36" rx="4" fill="#1A1A1A" />
                <rect x="16" y="100" width="24" height="24" rx="2" fill="#FFFFFF" />
                <rect x="22" y="106" width="12" height="12" rx="1.5" fill="#1A1A1A" />
                <rect x="52" y="52" width="8" height="8" fill="#1A1A1A" />
                <rect x="64" y="52" width="8" height="8" fill="#1A1A1A" />
                <rect x="76" y="52" width="8" height="8" fill="#1A1A1A" />
                <rect x="88" y="52" width="8" height="8" fill="#1A1A1A" />
                <rect x="52" y="68" width="8" height="8" fill="#1A1A1A" />
                <rect x="76" y="68" width="8" height="8" fill="#1A1A1A" />
                <rect x="52" y="80" width="8" height="8" fill="#1A1A1A" />
                <rect x="64" y="80" width="8" height="8" fill="#1A1A1A" />
                <rect x="56" y="56" width="28" height="28" rx="4" fill="#DA7A5B" />
                <text x="70" y="74" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">QRIS</text>
              </svg>
              <span className="text-[10px] text-[#8A6A55] font-semibold mt-2 block">
                NMID: ID1029481902
              </span>
            </div>

            <p className="text-[11px] text-[#8A6A55] leading-relaxed">
              Buka aplikasi BCA, Mandiri, GoPay, OVO, ShopeePay, atau m-Banking Anda. Scan QRIS di atas untuk menyelesaikan transaksi.
            </p>

            <button
              onClick={() => {
                alert('Terima kasih! Pembayaran sedang diverifikasi secara otomatis.');
                setQrisModalOrder(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#709154] text-white text-xs font-bold"
            >
              Saya Sudah Bayar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
