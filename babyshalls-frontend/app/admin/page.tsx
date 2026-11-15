'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  CalendarCheck,
  BookOpen,
  FileText,
  Users,
  ArrowLeftRight,
  QrCode,
  Store,
  LogOut,
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Truck,
  Download,
  Upload,
  ExternalLink,
  MessageCircle,
  Copy,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Filter,
  Eye,
  Camera,
  Menu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY, apiClient } from '@/lib/axios';
import { Product, ProductCategory, AgeGroup } from '@/types';
import { mockProducts as initialMockProducts, formatIDR } from '@/data/mockProducts';
import { EventQrScannerModal } from '@/components/admin/EventQrScannerModal';

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'events'
  | 'requests'
  | 'cms'
  | 'users'
  | 'import-export'
  | 'shortlink';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth State
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileAdminSidebarOpen, setIsMobileAdminSidebarOpen] = useState(false);

  // Notifications
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeOrderDrawer, setActiveOrderDrawer] = useState<any | null>(null);
  const [drawerTrackingNumber, setDrawerTrackingNumber] = useState('');
  const [drawerOrderStatus, setDrawerOrderStatus] = useState('');

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productAgeFilter, setProductAgeFilter] = useState<string>('all');
  const [productConditionFilter, setProductConditionFilter] = useState<string>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Event Tickets & Attendees State
  const [eventTickets, setEventTickets] = useState<any[]>([]);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Book Requests State
  const [bookRequests, setBookRequests] = useState<any[]>([]);
  const [activeRequestDrawer, setActiveRequestDrawer] = useState<any | null>(null);
  const [requestFilter, setRequestFilter] = useState<string>('all');

  // CMS State
  const [bannerTitle, setBannerTitle] = useState('Semua yang Dibutuhkan untuk Tumbuh Kembang Si Kecil');
  const [bannerSubtitle, setBannerSubtitle] = useState('Kurasi buku berkualitas dan mainan edukatif kayu standar internasional untuk anak di Malang Raya.');
  const [bannerButtonText, setBannerButtonText] = useState('Belanja Per Usia');

  // Shortlink State
  const [shortlinkUrl, setShortlinkUrl] = useState('https://babyshalls.com/shop?source=store_qr');
  const [shortlinkTitle, setShortlinkTitle] = useState('QR Meja Kasir Toko Citraland Malang');

  // Toast / notification
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  // Check Authentication & Load Initial Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token =
        window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ||
        window.localStorage.getItem(USER_TOKEN_STORAGE_KEY);
      const savedUserStr = window.localStorage.getItem('babyshalls_admin_user');

      if (!token) {
        router.replace('/admin/login');
        return;
      }

      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          setAdminUser(u);
        } catch {
          setAdminUser({ name: 'Admin BabyShalls', role: 'ADMIN' });
        }
      } else {
        setAdminUser({ name: 'Admin BabyShalls', role: 'ADMIN' });
      }

      // Load Orders
      try {
        const savedOrders = JSON.parse(window.localStorage.getItem('babyshalls_orders') || '[]');
        if (savedOrders.length > 0) {
          setOrders(savedOrders);
        } else {
          const defaultOrders = [
            {
              orderId: 'BS-2026-0881',
              customerName: 'Dina Permata',
              customerPhone: '0812-3456-7890',
              customerEmail: 'dina.permata@gmail.com',
              deliveryMethod: 'JNE Reguler',
              deliveryAddress: 'Jl. Puncak Tidar No. 18, Sukun, Malang',
              paymentMethod: 'QRIS Instan',
              status: 'Sedang Dikirim',
              shippingTrackingNumber: 'JNE88291039401ID',
              totalAmount: 183000,
              createdAt: '2026-11-14T10:30:00Z',
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
              orderId: 'BS-2026-0894',
              customerName: 'Budi Santoso',
              customerPhone: '0813-8899-1234',
              customerEmail: 'budi.santoso@yahoo.com',
              deliveryMethod: 'GrabExpress Instant Malang',
              deliveryAddress: 'Citraland Puncak Tidar Blok AA-12, Malang',
              paymentMethod: 'BCA Virtual Account',
              status: 'Perlu Dikirim',
              shippingTrackingNumber: '',
              totalAmount: 320000,
              createdAt: '2026-11-15T08:15:00Z',
              items: [
                {
                  productId: 'p-3',
                  title: 'Wooden Rainbow Stacker Montessori',
                  price: 245000,
                  quantity: 1,
                  coverImage: '/images/products/p-3-wooden-stacker.png',
                },
                {
                  productId: 'p-4',
                  title: 'Sensory Soft Book: Farm Animals',
                  price: 75000,
                  quantity: 1,
                  coverImage: '/images/products/p-4-soft-book.png',
                },
              ],
            },
            {
              orderId: 'BS-2026-0842',
              customerName: 'Rini Kusuma',
              customerPhone: '0857-1122-3344',
              customerEmail: 'rini.kusuma@gmail.com',
              deliveryMethod: 'Ambil di Toko Citraland Malang',
              deliveryAddress: 'Citraland Puncak Tidar Blok HH-26, Malang',
              paymentMethod: 'Midtrans GoPay',
              status: 'Selesai',
              shippingTrackingNumber: 'PICKUP-STORE-OK',
              totalAmount: 245000,
              createdAt: '2026-11-02T14:15:00Z',
              items: [
                {
                  productId: 'p-2',
                  title: 'Petualangan Si Kancil & Buaya Cerdik',
                  price: 125000,
                  quantity: 1,
                  coverImage: '/images/products/p-2-kancil.png',
                },
              ],
            },
          ];
          setOrders(defaultOrders);
          window.localStorage.setItem('babyshalls_orders', JSON.stringify(defaultOrders));
        }
      } catch {
        // pass
      }

      // Load Catalog
      try {
        const savedCatalog = JSON.parse(window.localStorage.getItem('babyshalls_catalog_data') || '[]');
        if (savedCatalog.length > 0) {
          setProducts(savedCatalog);
        } else {
          setProducts(initialMockProducts);
          window.localStorage.setItem('babyshalls_catalog_data', JSON.stringify(initialMockProducts));
        }
      } catch {
        setProducts(initialMockProducts);
      }

      // Load Tickets
      try {
        const savedTickets = JSON.parse(window.localStorage.getItem('babyshalls_event_tickets') || '[]');
        if (savedTickets.length > 0) {
          setEventTickets(savedTickets);
        } else {
          const defaultTickets = [
            {
              ticketId: 'EVT-8419',
              eventTitle: 'Little Explorers: Nature Craft & Sensory Play',
              eventDate: 'Sabtu, 28 November 2026',
              eventTime: '09.30 – 11.30 WIB',
              location: 'BabyShalls Citraland Puncak Tidar Blok HH-26, Malang',
              parentName: 'Dina Permata',
              childName: 'Kenzo (3 th)',
              phone: '0812-3456-7890',
              status: 'Tiket Aktif',
              registeredAt: '2026-11-13T12:00:00Z',
            },
            {
              ticketId: 'EVT-8420',
              eventTitle: 'Wooden Toy Craft Workshop',
              eventDate: 'Minggu, 29 November 2026',
              eventTime: '10.00 – 12.00 WIB',
              location: 'BabyShalls Citraland Malang',
              parentName: 'Budi Santoso',
              childName: 'Arka (4 th)',
              phone: '0813-8899-1234',
              status: 'Sudah Hadir',
              registeredAt: '2026-11-14T09:30:00Z',
            },
          ];
          setEventTickets(defaultTickets);
          window.localStorage.setItem('babyshalls_event_tickets', JSON.stringify(defaultTickets));
        }
      } catch {
        // pass
      }

      // Load Requests
      try {
        const savedReqs = JSON.parse(window.localStorage.getItem('babyshalls_book_requests') || '[]');
        if (savedReqs.length > 0) {
          setBookRequests(savedReqs);
        } else {
          const defaultReqs = [
            {
              id: 'REQ-4819',
              bookTitle: 'The Wonderful Things You Will Be',
              author: 'Emily Winfield Martin',
              isbn: '978-0385376716',
              format: 'Board Book',
              status: 'Sedang Dicari',
              customerName: 'Dina Permata',
              whatsapp: '0812-3456-7890',
              createdAt: '2026-11-12T09:00:00Z',
              curatorNote: 'Sedang dicek ke distributor buku impor Singapura.',
            },
            {
              id: 'REQ-4820',
              bookTitle: 'All Are Welcome',
              author: 'Alexandra Penfold',
              isbn: '978-0525579649',
              format: 'Hardcover',
              status: 'Ditemukan',
              customerName: 'Haikal Ilham',
              whatsapp: '0857-9988-7766',
              createdAt: '2026-11-14T14:20:00Z',
              curatorNote: 'Stok tersedia di rekanan Jakarta, estimasi tiba di Malang 2 hari.',
            },
          ];
          setBookRequests(defaultReqs);
          window.localStorage.setItem('babyshalls_book_requests', JSON.stringify(defaultReqs));
        }
      } catch {
        // pass
      }

      setIsChecked(true);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      window.localStorage.removeItem('babyshalls_admin_user');
      window.dispatchEvent(new Event('babyshalls-auth-changed'));
    }
    router.replace('/admin/login');
  };

  // Sync state with storage
  const saveOrders = (updated: any[]) => {
    setOrders(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('babyshalls_orders', JSON.stringify(updated));
    }
  };

  const saveCatalog = (updated: Product[]) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('babyshalls_catalog_data', JSON.stringify(updated));
    }
  };

  const saveTickets = (updated: any[]) => {
    setEventTickets(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('babyshalls_event_tickets', JSON.stringify(updated));
    }
  };

  const saveRequests = (updated: any[]) => {
    setBookRequests(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('babyshalls_book_requests', JSON.stringify(updated));
    }
  };

  // Order Actions
  const openOrderDrawer = (order: any) => {
    setActiveOrderDrawer(order);
    setDrawerTrackingNumber(order.shippingTrackingNumber || '');
    setDrawerOrderStatus(order.status || 'Perlu Dikirim');
  };

  const saveOrderDrawer = () => {
    if (!activeOrderDrawer) return;
    const updated = orders.map((o) =>
      o.orderId === activeOrderDrawer.orderId
        ? {
            ...o,
            shippingTrackingNumber: drawerTrackingNumber,
            status: drawerOrderStatus,
          }
        : o
    );
    saveOrders(updated);
    setActiveOrderDrawer(null);
    showToast(`Pesanan ${activeOrderDrawer.orderId} berhasil diperbarui!`);
  };

  // Catalog Actions
  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock, stock: p.inStock ? 0 : 10 } : p
    );
    saveCatalog(updated);
    showToast('Status stok berhasil diubah!');
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveCatalog(updated);
    setDeletingProduct(null);
    showToast('Produk berhasil dihapus dari katalog!');
  };

  // Check-in Ticket
  const handleToggleCheckIn = (ticketId: string) => {
    const updated = eventTickets.map((t) => {
      if (t.ticketId === ticketId) {
        const isAttended = t.status === 'Sudah Hadir';
        return {
          ...t,
          status: isAttended ? 'Tiket Aktif' : 'Sudah Hadir',
        };
      }
      return t;
    });
    saveTickets(updated);
    showToast(`Status kehadiran tiket ${ticketId} berhasil diperbarui!`);
  };

  // Sales Chart Data
  const chartData = [
    { name: '1 Nov', omzet: 420000, pesanan: 3 },
    { name: '4 Nov', omzet: 850000, pesanan: 6 },
    { name: '7 Nov', omzet: 640000, pesanan: 4 },
    { name: '10 Nov', omzet: 1250000, pesanan: 8 },
    { name: '13 Nov', omzet: 980000, pesanan: 7 },
    { name: '15 Nov', omzet: 1450000, pesanan: 10 },
  ];

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter !== 'all') {
        if (orderFilter === 'pending' && o.status !== 'Menunggu Pembayaran') return false;
        if (orderFilter === 'processing' && o.status !== 'Perlu Dikirim') return false;
        if (orderFilter === 'shipped' && o.status !== 'Sedang Dikirim') return false;
        if (orderFilter === 'completed' && o.status !== 'Selesai') return false;
      }
      if (orderSearch) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productAgeFilter !== 'all' && p.ageGroup !== productAgeFilter) return false;
      if (productConditionFilter !== 'all') {
        const isPreloved = p.category === 'Preloved Item' || p.condition === 'preloved';
        if (productConditionFilter === 'baru' && isPreloved) return false;
        if (productConditionFilter === 'preloved' && !isPreloved) return false;
      }
      if (productSearch) {
        const q = productSearch.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.author || p.authorOrBrand || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, productCategoryFilter, productAgeFilter, productConditionFilter, productSearch]);

  // Low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => typeof p.stock === 'number' && p.stock <= 3).slice(0, 5);
  }, [products]);

  if (!isChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-3 border-[#B05A26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex font-sans text-[#4A2A1C]">
      
      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4A2A1C] text-white text-xs font-medium px-4 py-3 rounded-[4px] shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-[#8FA87E] shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isMobileAdminSidebarOpen && (
        <div
          onClick={() => setIsMobileAdminSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* =========================================================================
          01 · EXACT FIGMA ADMIN SIDEBAR (Figma Component #139:5692, width: 264px)
          ========================================================================= */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-[264px] bg-white border-r border-[#E6D2C0] flex flex-col shrink-0 select-none transition-transform duration-200 ${
          isMobileAdminSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Brand Header */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-[48px] h-[43px]">
              <Image
                src="/BabyShallsLogo 1.PNG"
                alt="Baby Shall's Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <span className="text-[16px] font-medium text-[#B05A26]">
              Admin
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileAdminSidebarOpen(false)}
            className="lg:hidden p-1 text-[#7A5644] hover:text-[#4A2A1C]"
            aria-label="Tutup sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Group Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          
          {/* GROUP: UTAMA */}
          <div className="text-[12px] font-semibold text-[#C9B3A5] tracking-[0.08em] uppercase pt-3 pb-1 px-3">
            UTAMA
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* GROUP: TOKO */}
          <div className="text-[12px] font-semibold text-[#C9B3A5] tracking-[0.08em] uppercase pt-5 pb-1 px-3">
            TOKO
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="shrink-0" />
              <span>Pesanan</span>
            </div>
            {orders.filter((o) => o.status === 'Perlu Dikirim').length > 0 && (
              <span className="bg-[#B05A26] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {orders.filter((o) => o.status === 'Perlu Dikirim').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <Tag size={18} className="shrink-0" />
            <span>Produk</span>
          </button>

          {/* GROUP: KEGIATAN */}
          <div className="text-[12px] font-semibold text-[#C9B3A5] tracking-[0.08em] uppercase pt-5 pb-1 px-3">
            KEGIATAN
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <CalendarCheck size={18} className="shrink-0" />
            <span>Event &amp; Check-in</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="shrink-0" />
              <span>Book Request</span>
            </div>
            {bookRequests.length > 0 && (
              <span className="bg-[#FFF6EA] text-[#B05A26] border border-[#E6D2C0] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {bookRequests.length}
              </span>
            )}
          </button>

          {/* GROUP: KONTEN & DATA */}
          <div className="text-[12px] font-semibold text-[#C9B3A5] tracking-[0.08em] uppercase pt-5 pb-1 px-3">
            KONTEN &amp; DATA
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'cms'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <FileText size={18} className="shrink-0" />
            <span>Konten (CMS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <Users size={18} className="shrink-0" />
            <span>Pengguna</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import-export')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'import-export'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <ArrowLeftRight size={18} className="shrink-0" />
            <span>Import / Export</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shortlink')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[15px] rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'shortlink'
                ? 'bg-[#FBE6D8] text-[#B05A26] font-medium'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <QrCode size={18} className="shrink-0" />
            <span>Shortlink &amp; QR</span>
          </button>

        </nav>

        {/* Bottom Actions: Lihat Toko & Keluar */}
        <div className="p-4 border-t border-[#E6D2C0] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3.5 py-2 text-[14px] text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] rounded-[2px] transition-colors"
          >
            <Store size={18} />
            <span>Lihat Toko</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-[14px] text-[#C0392B] hover:bg-[#FDF2F2] rounded-[2px] transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>

      </aside>

      {/* =========================================================================
          02 · MAIN CONTENT AREA (Figma Header Topbar + Views)
          ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Topbar: Title, Actions, Notifications, Admin Avatar */}
        <header className="sticky top-0 z-10 bg-white border-b border-[#E6D2C0] px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileAdminSidebarOpen(!isMobileAdminSidebarOpen)}
              className="lg:hidden p-2 text-[#4A2A1C] hover:bg-[#FFF6EA] rounded-[2px] cursor-pointer"
              aria-label="Toggle admin sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-[20px] sm:text-[24px] font-medium text-[#4A2A1C] capitalize">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'orders' && 'Pesanan'}
                {activeTab === 'products' && 'Produk'}
                {activeTab === 'events' && 'Event & Check-in'}
                {activeTab === 'requests' && 'Book Request'}
                {activeTab === 'cms' && 'Konten (CMS)'}
                {activeTab === 'users' && 'Pengguna'}
                {activeTab === 'import-export' && 'Import / Export'}
                {activeTab === 'shortlink' && 'Shortlink & QR'}
              </h1>
              <p className="text-[12px] sm:text-[13px] text-[#7A5644] hidden sm:block">
                {activeTab === 'dashboard' && 'Ringkasan aktivitas toko & kurasi buku di Malang'}
                {activeTab === 'orders' && 'Kelola & proses pesanan pelanggan toko online'}
                {activeTab === 'products' && 'Katalog buku edukatif, mainan kayu & preloved'}
                {activeTab === 'events' && 'Daftar peserta workshop & check-in tiket masuk'}
                {activeTab === 'requests' && 'Concierge pencarian buku langka & impor'}
                {activeTab === 'cms' && 'Pengaturan banner promosi & pengumuman toko'}
                {activeTab === 'users' && 'Manajemen staf admin toko & kurator buku'}
                {activeTab === 'import-export' && 'Sinkronisasi data katalog & transaksi via CSV'}
                {activeTab === 'shortlink' && 'Generator QR code untuk meja kasir & rak buku'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && (
              <div className="px-3.5 py-1.5 bg-white border border-[#C9B3A5] rounded-[2px] text-xs font-medium text-[#4A2A1C]">
                Hari ini: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </div>
            )}

            {activeTab === 'orders' && (
              <button
                type="button"
                onClick={() => showToast('Ekspor CSV pesanan berhasil diunduh!')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#C9B3A5] hover:border-[#B05A26] rounded-[2px] text-xs font-medium text-[#4A2A1C] transition-colors"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            )}

            {activeTab === 'products' && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white rounded-[2px] text-xs font-medium transition-colors shadow-xs"
              >
                <Plus size={14} />
                <span>Tambah Produk</span>
              </button>
            )}

            {activeTab === 'events' && (
              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white rounded-[2px] text-xs font-medium transition-colors shadow-xs"
              >
                <Camera size={14} />
                <span>Scan QR Tiket</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className="relative p-2 text-[#4A2A1C] hover:text-[#B05A26] hover:bg-[#FFF6EA] rounded-full transition-colors"
                aria-label="Notifikasi"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C0392B] rounded-full" />
                )}
              </button>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E6D2C0]">
              <div className="w-9 h-9 rounded-[4px] bg-[#F2E4D6] text-[#B05A26] font-semibold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-medium text-[#4A2A1C]">
                  {adminUser?.name || 'Admin BabyShalls'}
                </span>
                <span className="block text-[10px] text-[#7A5644]">
                  Citraland Malang
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] w-full mx-auto space-y-6">

          {/* =========================================================================
              VIEW 01 · DASHBOARD (Figma Node #218:4704)
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* 5 KPI Cards (Figma #218:4716) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-[4px] border border-[#E6D2C0] shadow-xs flex flex-col justify-between">
                  <span className="text-[12px] font-semibold text-[#7A5644] uppercase tracking-wider">
                    Pendapatan Bulan Ini
                  </span>
                  <div className="mt-2">
                    <span className="text-[20px] font-semibold text-[#4A2A1C]">
                      Rp 18.420.000
                    </span>
                    <span className="block text-[11px] text-[#2A6E37] font-medium mt-0.5">
                      +12.5% vs bln lalu
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[4px] border border-[#E6D2C0] shadow-xs flex flex-col justify-between">
                  <span className="text-[12px] font-semibold text-[#7A5644] uppercase tracking-wider">
                    Pesanan Baru
                  </span>
                  <div className="mt-2">
                    <span className="text-[20px] font-semibold text-[#4A2A1C]">
                      24 Pesanan
                    </span>
                    <span className="block text-[11px] text-[#B05A26] font-medium mt-0.5">
                      Hari ini
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[4px] border border-[#E6D2C0] shadow-xs flex flex-col justify-between">
                  <span className="text-[12px] font-semibold text-[#7A5644] uppercase tracking-wider">
                    Perlu Dikirim
                  </span>
                  <div className="mt-2">
                    <span className="text-[20px] font-semibold text-[#C0392B]">
                      {orders.filter((o) => o.status === 'Perlu Dikirim').length} Pesanan
                    </span>
                    <span className="block text-[11px] text-[#7A5644] font-medium mt-0.5">
                      Segera kemas
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[4px] border border-[#E6D2C0] shadow-xs flex flex-col justify-between">
                  <span className="text-[12px] font-semibold text-[#7A5644] uppercase tracking-wider">
                    Pendaftar Event
                  </span>
                  <div className="mt-2">
                    <span className="text-[20px] font-semibold text-[#4A2A1C]">
                      36 Peserta
                    </span>
                    <span className="block text-[11px] text-[#2A6E37] font-medium mt-0.5">
                      Workshop aktif
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[4px] border border-[#E6D2C0] shadow-xs flex flex-col justify-between">
                  <span className="text-[12px] font-semibold text-[#7A5644] uppercase tracking-wider">
                    Request Buku
                  </span>
                  <div className="mt-2">
                    <span className="text-[20px] font-semibold text-[#B05A26]">
                      {bookRequests.length} Permintaan
                    </span>
                    <span className="block text-[11px] text-[#7A5644] font-medium mt-0.5">
                      Menunggu kurasi
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Grafik Penjualan + Event Mendatang (Figma #218:4737) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Grafik Penjualan */}
                <div className="lg:col-span-8 bg-white p-6 rounded-[4px] border border-[#E6D2C0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                        Tren Penjualan (November 2026)
                      </h3>
                      <p className="text-xs text-[#7A5644]">
                        Omzet akumulatif buku &amp; mainan edukasi
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#B05A26] bg-[#FFF6EA] px-2.5 py-1 rounded-[2px]">
                      +18% Bulan Ini
                    </span>
                  </div>

                  <div className="h-[240px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B05A26" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#B05A26" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2E4D6" />
                        <XAxis dataKey="name" stroke="#7A5644" fontSize={11} tickLine={false} />
                        <YAxis
                          stroke="#7A5644"
                          fontSize={11}
                          tickLine={false}
                          tickFormatter={(v) => `Rp${v / 1000}k`}
                        />
                        <Tooltip
                          formatter={(value: any) => [formatIDR(Number(value)), 'Omzet']}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E6D2C0',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="omzet"
                          stroke="#B05A26"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: Event Mendatang */}
                <div className="lg:col-span-4 bg-white p-6 rounded-[4px] border border-[#E6D2C0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                      Event Mendatang
                    </h3>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="text-xs text-[#B05A26] hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#B05A26] bg-[#FFF0E0] px-2 py-0.5 rounded-[2px]">
                          28 Nov 2026
                        </span>
                        <span className="text-[11px] text-[#2A6E37] font-medium">
                          Sisa 4 Kuota
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-[#4A2A1C] line-clamp-1">
                        Little Explorers: Sensory Play &amp; Art
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Fasilitator: Kak Nisa &bull; Toko Citraland
                      </p>
                      <button
                        onClick={() => setIsQrScannerOpen(true)}
                        className="w-full py-1.5 mt-1 bg-white border border-[#B05A26] text-[#B05A26] hover:bg-[#B05A26] hover:text-white text-xs font-medium rounded-[2px] transition-colors"
                      >
                        Buka Scanner Check-in
                      </button>
                    </div>

                    <div className="p-3.5 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#B05A26] bg-[#FFF0E0] px-2 py-0.5 rounded-[2px]">
                          29 Nov 2026
                        </span>
                        <span className="text-[11px] text-[#2A6E37] font-medium">
                          Sisa 2 Kuota
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-[#4A2A1C] line-clamp-1">
                        Wooden Toy Craft Workshop
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Fasilitator: Pengrajin Kayu Malang
                      </p>
                      <button
                        onClick={() => setIsQrScannerOpen(true)}
                        className="w-full py-1.5 mt-1 bg-white border border-[#B05A26] text-[#B05A26] hover:bg-[#B05A26] hover:text-white text-xs font-medium rounded-[2px] transition-colors"
                      >
                        Buka Scanner Check-in
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 3: Perlu Diproses + Stok Menipis (Figma #218:4765) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Perlu Diproses */}
                <div className="lg:col-span-8 bg-white p-6 rounded-[4px] border border-[#E6D2C0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                        Pesanan Perlu Diproses
                      </h3>
                      <p className="text-xs text-[#7A5644]">
                        Pesanan baru yang siap dikemas atau diinput resi
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#B05A26] hover:underline"
                    >
                      Buka Kelola Pesanan &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#4A2A1C]">
                      <thead>
                        <tr className="border-b border-[#F2E4D6] text-[#7A5644] font-semibold">
                          <th className="pb-2.5">No. Pesanan</th>
                          <th className="pb-2.5">Pelanggan</th>
                          <th className="pb-2.5">Metode Kirim</th>
                          <th className="pb-2.5">Total</th>
                          <th className="pb-2.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2E4D6]">
                        {orders.slice(0, 4).map((o) => (
                          <tr key={o.orderId} className="hover:bg-[#FFFDF9]">
                            <td className="py-3 font-semibold text-[#B05A26]">
                              {o.orderId}
                            </td>
                            <td className="py-3">
                              <span className="font-medium block">{o.customerName}</span>
                              <span className="text-[11px] text-[#7A5644]">{o.customerPhone}</span>
                            </td>
                            <td className="py-3 text-[#7A5644]">
                              {o.deliveryMethod}
                            </td>
                            <td className="py-3 font-semibold">
                              {formatIDR(o.totalAmount)}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => openOrderDrawer(o)}
                                className="px-3 py-1 bg-[#FFF6EA] hover:bg-[#B05A26] hover:text-white text-[#B05A26] text-xs font-medium rounded-[2px] transition-colors"
                              >
                                Detail &amp; Resi
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Stok Menipis */}
                <div className="lg:col-span-4 bg-white p-6 rounded-[4px] border border-[#E6D2C0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                      Peringatan Stok Menipis
                    </h3>
                    <span className="text-xs text-[#C0392B] font-semibold">
                      &le; 3 pcs
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[#4A2A1C] truncate">
                            {p.title}
                          </h4>
                          <span className="text-[11px] text-[#C0392B] font-medium block">
                            Sisa stok: {p.stock ?? 0} pcs
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleStock(p.id)}
                          className="px-2.5 py-1 bg-white border border-[#E6D2C0] hover:border-[#B05A26] text-[11px] font-medium rounded-[2px] shrink-0"
                        >
                          Restock +10
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 02 · PESANAN (Figma Node #218:5052)
              ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Status Tabs (Figma #218:5064) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E6D2C0]">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'pending', label: 'Menunggu Bayar' },
                  { key: 'processing', label: 'Perlu Dikirim' },
                  { key: 'shipped', label: 'Sedang Dikirim' },
                  { key: 'completed', label: 'Selesai' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setOrderFilter(tab.key)}
                    className={`px-4 py-2 text-xs font-medium rounded-t-[2px] transition-colors whitespace-nowrap cursor-pointer ${
                      orderFilter === tab.key
                        ? 'bg-white border-t-2 border-l border-r border-[#E6D2C0] border-t-[#B05A26] text-[#B05A26] font-semibold'
                        : 'text-[#7A5644] hover:text-[#4A2A1C]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filter Bar (Figma #218:5081) */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search size={16} className="text-[#7A5644] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Cari no. pesanan / nama pelanggan / telepon..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] placeholder-[#C9B3A5] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    className="px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] cursor-pointer"
                  >
                    <option value="all">Semua Kurir</option>
                    <option value="jne">JNE Reguler</option>
                    <option value="jnt">J&amp;T Express</option>
                    <option value="instant">GrabExpress Malang</option>
                    <option value="pickup">Ambil di Toko</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions Bar if any selected */}
              {selectedOrderIds.length > 0 && (
                <div className="p-3 bg-[#FBE6D8] border border-[#E6D2C0] rounded-[4px] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#B05A26]">
                    {selectedOrderIds.length} pesanan dipilih
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Request pickup massal berhasil!')}
                      className="px-3 py-1 bg-[#B05A26] text-white text-xs font-medium rounded-[2px]"
                    >
                      Request Pickup
                    </button>
                    <button
                      onClick={() => showToast('Label cetak resi siap diunduh!')}
                      className="px-3 py-1 bg-white border border-[#C9B3A5] text-xs font-medium rounded-[2px]"
                    >
                      Cetak Label
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Table */}
              <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-[#4A2A1C] min-w-[720px]">
                  <thead>
                    <tr className="bg-[#FFF6EA] border-b border-[#E6D2C0] text-[#7A5644] font-semibold">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.length === orders.length && orders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedOrderIds(orders.map((o) => o.orderId));
                            else setSelectedOrderIds([]);
                          }}
                          className="accent-[#B05A26]"
                        />
                      </th>
                      <th className="py-3 px-4">No. Pesanan</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Kurir</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E4D6]">
                    {filteredOrders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-[#FFFDF9]">
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={selectedOrderIds.includes(o.orderId)}
                            onChange={() => {
                              setSelectedOrderIds((prev) =>
                                prev.includes(o.orderId)
                                  ? prev.filter((id) => id !== o.orderId)
                                  : [...prev, o.orderId]
                              );
                            }}
                            className="accent-[#B05A26]"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#B05A26]">
                          {o.orderId}
                          {o.shippingTrackingNumber && (
                            <span className="block text-[10px] text-[#7A5644] font-normal">
                              Resi: {o.shippingTrackingNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#7A5644]">
                          {new Date(o.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold block">{o.customerName}</span>
                          <span className="text-[11px] text-[#7A5644]">{o.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#7A5644]">
                          {o.deliveryMethod}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#4A2A1C]">
                          {formatIDR(o.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-[2px] text-[11px] font-medium ${
                              o.status === 'Selesai'
                                ? 'bg-[#DDF1E5] text-[#2A6E37]'
                                : o.status === 'Sedang Dikirim'
                                ? 'bg-[#E3EDF9] text-[#2C5282]'
                                : 'bg-[#FFF3D6] text-[#9A6500]'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openOrderDrawer(o)}
                            className="px-3 py-1 bg-[#FFF6EA] hover:bg-[#B05A26] hover:text-white text-[#B05A26] font-medium rounded-[2px] transition-colors"
                          >
                            Detail &amp; Resi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 03 · PRODUK (Figma Node #218:5483)
              ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Filters (Figma #218:5498) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative sm:col-span-2">
                  <Search size={16} className="text-[#7A5644] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari judul buku, penulis, brand..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] placeholder-[#C9B3A5] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] cursor-pointer"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Board Books">Board Books</option>
                    <option value="Picture Books">Picture Books</option>
                    <option value="Educational Toys">Mainan Edukasi</option>
                    <option value="Preloved Item">Preloved Kurasi</option>
                  </select>
                </div>

                <div>
                  <select
                    value={productConditionFilter}
                    onChange={(e) => setProductConditionFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] cursor-pointer"
                  >
                    <option value="all">Baru &amp; Preloved</option>
                    <option value="baru">Baru Saja</option>
                    <option value="preloved">Preloved Saja</option>
                  </select>
                </div>
              </div>

              {/* Products Table with #FFF6EA Header (Figma #218:5519) */}
              <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-[#4A2A1C] min-w-[700px]">
                  <thead>
                    <tr className="bg-[#FFF6EA] border-b border-[#E6D2C0] text-[#7A5644] font-semibold">
                      <th className="py-3 px-4 w-16">Foto</th>
                      <th className="py-3 px-4">Judul &amp; Penulis</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Usia</th>
                      <th className="py-3 px-4">Harga</th>
                      <th className="py-3 px-4">Stok</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E4D6]">
                    {filteredProducts.map((p) => {
                      const isPreloved = p.category === 'Preloved Item' || p.condition === 'preloved';
                      return (
                        <tr key={p.id} className="hover:bg-[#FFFDF9]">
                          <td className="py-2.5 px-4">
                            <div className="relative w-11 h-11 bg-[#F0F0F0] rounded-[2px] overflow-hidden border border-[#E6D2C0]">
                              <Image
                                src={p.coverImage || p.images?.[0] || '/images/products/p-1-little-bear.png'}
                                alt={p.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-[#4A2A1C] max-w-xs truncate">
                            {p.title}
                            <span className="block text-[11px] text-[#7A5644] font-normal">
                              {p.author || p.authorOrBrand}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-[#7A5644]">
                            {p.category}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="bg-[#FFF0E0] text-[#B05A26] px-2 py-0.5 rounded-[2px] text-[11px] font-medium">
                              {p.ageGroup}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-semibold">
                            {formatIDR(p.price)}
                          </td>
                          <td className="py-2.5 px-4 font-semibold">
                            {p.stock ?? 12} pcs
                          </td>
                          <td className="py-2.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p.id)}
                              className={`px-2.5 py-1 rounded-[2px] text-[11px] font-medium transition-colors cursor-pointer ${
                                p.inStock
                                  ? 'bg-[#DDF1E5] text-[#2A6E37] hover:bg-[#c9e8d4]'
                                  : 'bg-[#FDF2F2] text-[#C0392B] hover:bg-[#fae2e2]'
                              }`}
                            >
                              {p.inStock ? 'Tersedia' : 'Habis'}
                            </button>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-[#7A5644] hover:text-[#B05A26] hover:bg-[#FFF6EA] rounded transition-colors"
                                title="Ubah Produk"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingProduct(p)}
                                className="p-1.5 text-[#C0392B] hover:bg-[#FDF2F2] rounded transition-colors"
                                title="Hapus Produk"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 04 · EVENT & CHECK-IN (Figma Node #218:6237)
              ========================================================================= */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              
              {/* Event Summary Banner */}
              <div className="bg-[#FFF6EA] border border-[#E6D2C0] p-6 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#B05A26] tracking-wider uppercase">
                    WORKSHOP MALANG RAYA
                  </span>
                  <h3 className="text-[18px] font-medium text-[#4A2A1C]">
                    Pemeriksaan Tiket &amp; Check-In Peserta
                  </h3>
                  <p className="text-xs text-[#7A5644]">
                    Gunakan kamera smartphone/laptop atau input kode tiket untuk verifikasi kehadiran.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQrScannerOpen(true)}
                  className="px-5 py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs flex items-center gap-2"
                >
                  <Camera size={16} />
                  <span>Buka Kamera QR Scanner</span>
                </button>
              </div>

              {/* Attendee Tickets Table */}
              <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-[#4A2A1C] min-w-[650px]">
                  <thead>
                    <tr className="bg-[#FFF6EA] border-b border-[#E6D2C0] text-[#7A5644] font-semibold">
                      <th className="py-3 px-4">Kode Tiket</th>
                      <th className="py-3 px-4">Nama Event</th>
                      <th className="py-3 px-4">Orang Tua &amp; Anak</th>
                      <th className="py-3 px-4">No. WhatsApp</th>
                      <th className="py-3 px-4">Status Kehadiran</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E4D6]">
                    {eventTickets.map((t) => (
                      <tr key={t.ticketId} className="hover:bg-[#FFFDF9]">
                        <td className="py-3.5 px-4 font-semibold text-[#B05A26]">
                          {t.ticketId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#4A2A1C]">
                          {t.eventTitle}
                          <span className="block text-[11px] text-[#7A5644] font-normal">
                            {t.eventDate} ({t.eventTime})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold block">{t.parentName}</span>
                          <span className="text-[11px] text-[#7A5644]">Anak: {t.childName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#7A5644]">
                          {t.phone}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-[2px] text-[11px] font-medium ${
                              t.status === 'Sudah Hadir'
                                ? 'bg-[#DDF1E5] text-[#2A6E37]'
                                : 'bg-[#FFF3D6] text-[#9A6500]'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(t.ticketId)}
                            className={`px-3 py-1 text-xs font-medium rounded-[2px] transition-colors ${
                              t.status === 'Sudah Hadir'
                                ? 'bg-[#F0F0F0] text-[#7A5644] hover:bg-[#e2e2e2]'
                                : 'bg-[#2A6E37] text-white hover:bg-[#22572c]'
                            }`}
                          >
                            {t.status === 'Sudah Hadir' ? 'Batal Hadir' : 'Check-in'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 05 · BOOK REQUEST (Figma Node #218:7121)
              ========================================================================= */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E6D2C0] pb-1">
                {['all', 'Sedang Dicari', 'Ditemukan', 'Selesai'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRequestFilter(st)}
                    className={`px-4 py-2 text-xs font-medium rounded-t-[2px] capitalize transition-colors ${
                      requestFilter === st
                        ? 'bg-white border-t-2 border-l border-r border-[#E6D2C0] border-t-[#B05A26] text-[#B05A26] font-semibold'
                        : 'text-[#7A5644] hover:text-[#4A2A1C]'
                    }`}
                  >
                    {st === 'all' ? 'Semua Status' : st}
                  </button>
                ))}
              </div>

              {/* Requests Table */}
              <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-[#4A2A1C] min-w-[700px]">
                  <thead>
                    <tr className="bg-[#FFF6EA] border-b border-[#E6D2C0] text-[#7A5644] font-semibold">
                      <th className="py-3 px-4">No. ID</th>
                      <th className="py-3 px-4">Judul Buku &amp; Penulis</th>
                      <th className="py-3 px-4">Pemohon</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Catatan Kurator</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E4D6]">
                    {bookRequests
                      .filter((r) => requestFilter === 'all' || r.status === requestFilter)
                      .map((req) => (
                        <tr key={req.id} className="hover:bg-[#FFFDF9]">
                          <td className="py-3.5 px-4 font-semibold text-[#B05A26]">
                            {req.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold block">{req.bookTitle}</span>
                            <span className="text-[11px] text-[#7A5644]">{req.author}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold block">{req.customerName}</span>
                            <a
                              href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#2A6E37] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <MessageCircle size={12} />
                              <span>{req.whatsapp}</span>
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-[#7A5644]">
                            {req.format}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-[#7A5644] max-w-xs truncate">
                            {req.curatorNote || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-[2px] text-[11px] font-medium ${
                                req.status === 'Ditemukan'
                                  ? 'bg-[#DDF1E5] text-[#2A6E37]'
                                  : req.status === 'Selesai'
                                  ? 'bg-[#E3EDF9] text-[#2C5282]'
                                  : 'bg-[#FFF3D6] text-[#9A6500]'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const nextStatus =
                                  req.status === 'Sedang Dicari'
                                    ? 'Ditemukan'
                                    : req.status === 'Ditemukan'
                                    ? 'Selesai'
                                    : 'Sedang Dicari';
                                const updated = bookRequests.map((r) =>
                                  r.id === req.id ? { ...r, status: nextStatus } : r
                                );
                                saveRequests(updated);
                                showToast(`Status request ${req.id} diubah ke ${nextStatus}!`);
                              }}
                              className="px-3 py-1 bg-[#FFF6EA] hover:bg-[#B05A26] hover:text-white text-[#B05A26] text-xs font-medium rounded-[2px] transition-colors"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 06 · KONTEN (CMS) (Figma Node #218:7409 & #218:7682)
              ========================================================================= */}
          {activeTab === 'cms' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-[18px] font-medium text-[#4A2A1C]">
                  Pengaturan Banner Kampanye (#B05A26 Terracotta)
                </h3>
                <p className="text-xs text-[#7A5644]">
                  Ubah teks dan tombol banner yang tampil pada landing page toko.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                    Judul Banner
                  </label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                    Subteks Banner
                  </label>
                  <textarea
                    rows={3}
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                    Label Tombol CTA
                  </label>
                  <input
                    type="text"
                    value={bannerButtonText}
                    onChange={(e) => setBannerButtonText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Konten CMS berhasil disimpan!')}
                  className="px-6 py-2.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
                >
                  Simpan Perubahan Banner
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 07 · PENGGUNA (Figma Node #218:7742)
              ========================================================================= */}
          {activeTab === 'users' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-[18px] font-medium text-[#4A2A1C]">
                  Daftar Staf &amp; Pengguna Admin
                </h3>
                <p className="text-xs text-[#7A5644]">
                  Kelola hak akses dan peran staf butik BabyShalls di Malang.
                </p>
              </div>

              <div className="divide-y divide-[#F2E4D6]">
                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#4A2A1C] block">
                      Superadmin BabyShalls (admin@babyshalls.com)
                    </span>
                    <span className="text-[11px] text-[#7A5644]">
                      Akses Penuh: Finansial, Katalog, Pesanan &amp; CMS
                    </span>
                  </div>
                  <span className="bg-[#FFF6EA] text-[#B05A26] text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                    SUPERADMIN
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#4A2A1C] block">
                      Kurator Buku Malang (curator@babyshalls.com)
                    </span>
                    <span className="text-[11px] text-[#7A5644]">
                      Akses: Manajemen Katalog Produk &amp; Book Request
                    </span>
                  </div>
                  <span className="bg-[#E3EDF9] text-[#2C5282] text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                    KURATOR
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 08 · IMPORT / EXPORT (Figma Node #218:8014)
              ========================================================================= */}
          {activeTab === 'import-export' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[#B05A26]" />
                  <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                    Ekspor Data Katalog &amp; Transaksi
                  </h3>
                </div>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Unduh seluruh database produk atau riwayat pesanan pelanggan ke format CSV / JSON untuk keperluan arsip laporan pembukuan.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `babyshalls_products_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('Katalog berhasil diekspor!');
                    }}
                    className="px-4 py-2 bg-[#B05A26] text-white text-xs font-medium rounded-[2px]"
                  >
                    Ekspor Produk (JSON)
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Riwayat pesanan CSV berhasil diunduh!')}
                    className="px-4 py-2 bg-white border border-[#C9B3A5] text-xs font-medium rounded-[2px]"
                  >
                    Ekspor Pesanan (CSV)
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-[#2A6E37]" />
                  <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                    Impor Data Produk Massal
                  </h3>
                </div>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Unggah file CSV atau JSON untuk menambahkan puluhan buku impor atau mainan edukasi sekaligus ke dalam sistem.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#2A6E37] text-[#2A6E37] text-xs font-medium rounded-[2px] cursor-pointer hover:bg-[#F2F9F4] transition-colors">
                  <Upload size={14} />
                  <span>Pilih File CSV / JSON</span>
                  <input
                    type="file"
                    accept=".json,.csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        showToast(`File ${e.target.files[0].name} berhasil divalidasi!`);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 09 · SHORTLINK & QR (Figma Node #218:8513)
              ========================================================================= */}
          {activeTab === 'shortlink' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-[18px] font-medium text-[#4A2A1C]">
                  Generator QR Code Toko Fisik &amp; Meja Kasir
                </h3>
                <p className="text-xs text-[#7A5644]">
                  Buat QR code instan untuk diletakkan di rak buku atau meja kasir Citraland Malang.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="p-6 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[4px] flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-[4px] border border-[#E6D2C0] shadow-sm">
                    <QRCodeSVG value={shortlinkUrl} size={180} />
                  </div>
                  <span className="text-xs font-medium text-[#4A2A1C] text-center max-w-[200px]">
                    {shortlinkTitle}
                  </span>
                </div>

                <div className="flex-1 space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                      Label / Keterangan QR
                    </label>
                    <input
                      type="text"
                      value={shortlinkTitle}
                      onChange={(e) => setShortlinkTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                      Target URL
                    </label>
                    <input
                      type="url"
                      value={shortlinkUrl}
                      onChange={(e) => setShortlinkUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shortlinkUrl);
                        showToast('Link berhasil disalin ke clipboard!');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B05A26] text-white text-xs font-medium rounded-[2px]"
                    >
                      <Copy size={14} />
                      <span>Salin Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('QR Code siap dicetak!')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#C9B3A5] text-xs font-medium rounded-[2px]"
                    >
                      <Download size={14} />
                      <span>Unduh PNG</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          SLIDE-OVER DRAWER: PESANAN DETAIL & INPUT RESI (Figma Node #218:5418)
          ========================================================================= */}
      {activeOrderDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveOrderDrawer(null)}
          />

          <div className="relative w-full max-w-[540px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E6D2C0] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#B05A26] uppercase">
                  DETAIL PESANAN
                </span>
                <h3 className="text-[18px] font-medium text-[#4A2A1C]">
                  {activeOrderDrawer.orderId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderDrawer(null)}
                className="p-1.5 text-[#7A5644] hover:text-[#4A2A1C] rounded-full hover:bg-[#FFF6EA]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Customer Info */}
              <div className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[4px] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#7A5644] uppercase tracking-wider block">
                  Informasi Penerima
                </span>
                <h4 className="text-sm font-semibold text-[#4A2A1C]">
                  {activeOrderDrawer.customerName}
                </h4>
                <p className="text-xs text-[#7A5644]">
                  {activeOrderDrawer.customerPhone} &bull; {activeOrderDrawer.customerEmail}
                </p>
                <p className="text-xs text-[#4A2A1C] pt-1">
                  {activeOrderDrawer.deliveryAddress}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#4A2A1C]">
                  Produk yang Dipesan ({activeOrderDrawer.items?.length || 1})
                </span>
                <div className="divide-y divide-[#F2E4D6] border border-[#F2E4D6] rounded-[4px] p-3">
                  {activeOrderDrawer.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-[#F0F0F0] rounded-[2px] overflow-hidden border border-[#E6D2C0] shrink-0">
                        <Image
                          src={item.coverImage || '/images/products/p-1-little-bear.png'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-[#4A2A1C] truncate">
                          {item.title}
                        </h5>
                        <span className="text-[11px] text-[#7A5644]">
                          {item.quantity}x &bull; {formatIDR(item.price)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#4A2A1C]">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier & Tracking Input */}
              <div className="space-y-3 p-4 bg-white border border-[#E6D2C0] rounded-[4px]">
                <span className="text-xs font-semibold text-[#4A2A1C] block">
                  Pengiriman &amp; Resi ({activeOrderDrawer.deliveryMethod})
                </span>
                
                <div>
                  <label className="block text-[11px] font-medium text-[#7A5644] mb-1">
                    Nomor Resi Pengiriman
                  </label>
                  <input
                    type="text"
                    value={drawerTrackingNumber}
                    onChange={(e) => setDrawerTrackingNumber(e.target.value)}
                    placeholder="Contoh: JNE88291039401ID"
                    className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs font-mono text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#7A5644] mb-1">
                    Status Pesanan
                  </label>
                  <select
                    value={drawerOrderStatus}
                    onChange={(e) => setDrawerOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  >
                    <option value="Perlu Dikirim">Perlu Dikirim</option>
                    <option value="Sedang Dikirim">Sedang Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[4px] space-y-2 text-xs">
                <div className="flex justify-between text-[#7A5644]">
                  <span>Subtotal</span>
                  <span>{formatIDR(activeOrderDrawer.totalAmount - 18000)}</span>
                </div>
                <div className="flex justify-between text-[#7A5644]">
                  <span>Biaya Pengiriman</span>
                  <span>Rp 18.000</span>
                </div>
                <div className="pt-2 border-t border-[#F2E4D6] flex justify-between font-semibold text-sm text-[#4A2A1C]">
                  <span>Total Tagihan</span>
                  <span className="text-[#B05A26]">{formatIDR(activeOrderDrawer.totalAmount)}</span>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-[#E6D2C0] flex items-center justify-end gap-3 bg-white">
              <button
                type="button"
                onClick={() => setActiveOrderDrawer(null)}
                className="px-4 py-2 border border-[#C9B3A5] text-xs font-medium rounded-[2px] hover:bg-[#FFFBF5]"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={saveOrderDrawer}
                className="px-5 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
              >
                Simpan &amp; Kirim Resi
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH / UBAH PRODUK (Figma Node #218:5848)
          ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-white border border-[#E6D2C0] rounded-[4px] shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-[#E6D2C0] flex items-center justify-between">
              <h3 className="text-[18px] font-medium text-[#4A2A1C]">
                {editingProduct ? 'Ubah Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#7A5644] hover:text-[#4A2A1C]"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const author = (form.elements.namedItem('author') as HTMLInputElement).value;
                const price = Number((form.elements.namedItem('price') as HTMLInputElement).value);
                const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
                const ageGroup = (form.elements.namedItem('ageGroup') as HTMLSelectElement).value;
                const stock = Number((form.elements.namedItem('stock') as HTMLInputElement).value);
                const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

                if (editingProduct) {
                  const updated = products.map((p) =>
                    p.id === editingProduct.id
                      ? {
                          ...p,
                          title,
                          author,
                          price,
                          category,
                          ageGroup: ageGroup as AgeGroup,
                          stock,
                          description,
                          inStock: stock > 0,
                        }
                      : p
                  );
                  saveCatalog(updated);
                  showToast('Produk berhasil diperbarui!');
                } else {
                  const newProd: Product = {
                    id: `p-${Date.now()}`,
                    title,
                    author,
                    price,
                    category,
                    ageGroup: ageGroup as AgeGroup,
                    stock,
                    description,
                    inStock: stock > 0,
                    coverImage: '/images/products/p-1-little-bear.png',
                  };
                  saveCatalog([newProd, ...products]);
                  showToast('Produk baru berhasil ditambahkan!');
                }
                setIsProductModalOpen(false);
              }}
              className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">Judul Produk</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingProduct?.title || ''}
                  required
                  className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4A2A1C] mb-1">Penulis / Brand</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingProduct?.author || editingProduct?.authorOrBrand || ''}
                    required
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A2A1C] mb-1">Harga (IDR)</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingProduct?.price || 150000}
                    required
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#4A2A1C] mb-1">Kategori</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'Board Books'}
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                  >
                    <option value="Board Books">Board Books</option>
                    <option value="Picture Books">Picture Books</option>
                    <option value="Educational Toys">Educational Toys</option>
                    <option value="Preloved Item">Preloved Item</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4A2A1C] mb-1">Usia Target</label>
                  <select
                    name="ageGroup"
                    defaultValue={editingProduct?.ageGroup || '0–2 Years'}
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                  >
                    <option value="0–2 Years">0–2 Years</option>
                    <option value="3–5 Years">3–5 Years</option>
                    <option value="6+ Years">6+ Years</option>
                    <option value="All Ages">All Ages</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4A2A1C] mb-1">Stok Awal</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct?.stock ?? 10}
                    required
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">Deskripsi Singkat</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingProduct?.description || ''}
                  className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px]"
                />
              </div>

              <div className="pt-4 border-t border-[#E6D2C0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#C9B3A5] rounded-[2px] font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B05A26] text-white rounded-[2px] font-semibold"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG: HAPUS PRODUK (Figma Node #218:6228)
          ========================================================================= */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setDeletingProduct(null)}
          />

          <div className="relative w-full max-w-md bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-[18px] font-medium text-[#4A2A1C]">
              Hapus Produk?
            </h3>
            <p className="text-xs text-[#7A5644] leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>&ldquo;{deletingProduct.title}&rdquo;</strong> dari katalog toko? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 border border-[#C9B3A5] text-xs font-medium rounded-[2px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deletingProduct.id)}
                className="px-4 py-2 bg-[#C0392B] hover:bg-[#a52d20] text-white text-xs font-semibold rounded-[2px] transition-colors"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Ticket Scanner Modal */}
      <EventQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />

    </div>
  );
}
