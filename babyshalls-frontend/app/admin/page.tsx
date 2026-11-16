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
  RotateCcw,
  Save,
  Sparkles,
  HelpCircle,
  ShieldCheck,
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
import { useCms, CmsFaqItem } from '@/context/CmsContext';

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

  // Semi-CMS State & Integration
  const { cms, updateCms, resetCmsToDefault, addFaqItem, updateFaqItem, deleteFaqItem } = useCms();
  const [cmsDraft, setCmsDraft] = useState(cms);
  const [cmsSubTab, setCmsSubTab] = useState<'home' | 'about' | 'faq' | 'preloved' | 'store'>('home');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('all');
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<CmsFaqItem | null>(null);
  const [faqFormCategory, setFaqFormCategory] = useState('Pemesanan & Pembayaran');
  const [faqFormQuestion, setFaqFormQuestion] = useState('');
  const [faqFormAnswer, setFaqFormAnswer] = useState('');

  useEffect(() => {
    setCmsDraft(cms);
  }, [cms]);

  const handleSaveCms = () => {
    updateCms(cmsDraft);
    showToast('Konten CMS berhasil disimpan dan disinkronkan ke seluruh website!');
  };

  const handleResetCms = () => {
    if (typeof window !== 'undefined' && window.confirm('Kembalikan seluruh konten CMS ke default asli?')) {
      resetCmsToDefault();
      showToast('Konten CMS dikembalikan ke pengaturan default asli!');
    }
  };

  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqFormCategory('Pemesanan & Pembayaran');
    setFaqFormQuestion('');
    setFaqFormAnswer('');
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq: CmsFaqItem) => {
    setEditingFaq(faq);
    setFaqFormCategory(faq.category);
    setFaqFormQuestion(faq.question);
    setFaqFormAnswer(faq.answer);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaqModal = () => {
    if (!faqFormQuestion.trim() || !faqFormAnswer.trim()) {
      alert('Pertanyaan dan Jawaban wajib diisi!');
      return;
    }
    if (editingFaq) {
      updateFaqItem(editingFaq.id, {
        category: faqFormCategory,
        question: faqFormQuestion,
        answer: faqFormAnswer,
      });
      showToast('Pertanyaan FAQ berhasil diperbarui!');
    } else {
      addFaqItem({
        category: faqFormCategory,
        question: faqFormQuestion,
        answer: faqFormAnswer,
      });
      showToast('Pertanyaan FAQ baru berhasil ditambahkan!');
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id: string, question: string) => {
    if (typeof window !== 'undefined' && window.confirm(`Hapus pertanyaan: "${question}"?`)) {
      deleteFaqItem(id);
      showToast('FAQ berhasil dihapus!');
    }
  };

  const handleToggleFaqActive = (faq: CmsFaqItem) => {
    updateFaqItem(faq.id, { isActive: !faq.isActive });
    showToast(`FAQ "${faq.question.slice(0, 20)}..." ${!faq.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

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
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-semibold text-[#4A2A1C]">
                Admin
              </span>
              <span className="px-2 py-0.5 bg-[#E4ECFB] text-[#3F5FA0] text-[10px] font-semibold rounded-[4px] border border-[#C5D7F8]">
                Butik
              </span>
            </div>
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
          <div className="text-[11px] font-bold text-[#7A5644] tracking-[0.08em] uppercase pt-3 pb-1 px-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B05A26]"></span>
            <span>UTAMA</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#FBE6D8] text-[#8E431A] font-semibold shadow-2xs border-l-3 border-[#B05A26]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <LayoutDashboard size={17} className={activeTab === 'dashboard' ? 'text-[#B05A26]' : 'shrink-0 text-[#7A5644]'} />
            <span>Dashboard</span>
          </button>

          {/* GROUP: TOKO */}
          <div className="text-[11px] font-bold text-[#7A5644] tracking-[0.08em] uppercase pt-5 pb-1 px-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F5FA0]"></span>
            <span>TOKO</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#E4ECFB] text-[#3F5FA0] font-semibold shadow-2xs border-l-3 border-[#3F5FA0]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={17} className={activeTab === 'orders' ? 'text-[#3F5FA0]' : 'shrink-0 text-[#7A5644]'} />
              <span>Pesanan</span>
            </div>
            {orders.filter((o) => o.status === 'Perlu Dikirim').length > 0 && (
              <span className="bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {orders.filter((o) => o.status === 'Perlu Dikirim').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#FFF1C7] text-[#8A5A00] font-semibold shadow-2xs border-l-3 border-[#D89F29]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <Tag size={17} className={activeTab === 'products' ? 'text-[#8A5A00]' : 'shrink-0 text-[#7A5644]'} />
            <span>Katalog Produk</span>
          </button>

          {/* GROUP: KEGIATAN */}
          <div className="text-[11px] font-bold text-[#7A5644] tracking-[0.08em] uppercase pt-5 pb-1 px-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7E4A84]"></span>
            <span>KEGIATAN</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#F3E6F2] text-[#7E4A84] font-semibold shadow-2xs border-l-3 border-[#BA7EB8]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <CalendarCheck size={17} className={activeTab === 'events' ? 'text-[#7E4A84]' : 'shrink-0 text-[#7A5644]'} />
            <span>Event &amp; Check-in</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#DDF6F9] text-[#1F6B76] font-semibold shadow-2xs border-l-3 border-[#8DDBE6]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={17} className={activeTab === 'requests' ? 'text-[#1F6B76]' : 'shrink-0 text-[#7A5644]'} />
              <span>Book Request</span>
            </div>
            {bookRequests.length > 0 && (
              <span className="bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {bookRequests.length}
              </span>
            )}
          </button>

          {/* GROUP: KONTEN & DATA */}
          <div className="text-[11px] font-bold text-[#7A5644] tracking-[0.08em] uppercase pt-5 pb-1 px-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A6E37]"></span>
            <span>KONTEN &amp; DATA</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'cms'
                ? 'bg-[#DDF1E5] text-[#2A6E37] font-semibold shadow-2xs border-l-3 border-[#82BC85]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <FileText size={17} className={activeTab === 'cms' ? 'text-[#2A6E37]' : 'shrink-0 text-[#7A5644]'} />
            <span>Konten (Semi-CMS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#FDE3E8] text-[#B83246] font-semibold shadow-2xs border-l-3 border-[#FBA6B2]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <Users size={17} className={activeTab === 'users' ? 'text-[#B83246]' : 'shrink-0 text-[#7A5644]'} />
            <span>Pengguna Staf</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import-export')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'import-export'
                ? 'bg-[#FBE6D8] text-[#8E431A] font-semibold shadow-2xs border-l-3 border-[#EFA27A]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <ArrowLeftRight size={17} className={activeTab === 'import-export' ? 'text-[#8E431A]' : 'shrink-0 text-[#7A5644]'} />
            <span>Import / Export</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shortlink')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'shortlink'
                ? 'bg-[#E4ECFB] text-[#3F5FA0] font-semibold shadow-2xs border-l-3 border-[#92B2F3]'
                : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
            }`}
          >
            <QrCode size={17} className={activeTab === 'shortlink' ? 'text-[#3F5FA0]' : 'shrink-0 text-[#7A5644]'} />
            <span>Shortlink &amp; QR Kasir</span>
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
              VIEW 01 · DASHBOARD (Figma Node #218:4704 & Design System)
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Mascot Welcome Hero Banner with Pastel Accents */}
              <div className="bg-gradient-to-r from-[#FFF6EA] via-[#FBE6D8]/40 to-[#E4ECFB]/30 border border-[#E6D2C0] rounded-[6px] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
                <div className="space-y-2.5 max-w-xl z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#B05A26] text-white text-[11px] font-semibold rounded-full tracking-wide">
                      Butik Citraland Malang
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#E4ECFB] text-[#3F5FA0] text-[11px] font-semibold rounded-full border border-[#C5D7F8]">
                      Buka Hari Ini 10.00 – 17.00 WIB
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-semibold rounded-full border border-[#BCE1C3]">
                      Katalog Siap
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-medium text-[#4A2A1C] leading-tight">
                    Halo, {adminUser?.name || 'Admin BabyShalls'}! 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                    Ada <strong className="text-[#3F5FA0] font-semibold">{orders.filter((o) => o.status === 'Perlu Dikirim').length} pesanan</strong> perlu dikemas kurir, <strong className="text-[#7E4A84] font-semibold">36 pendaftar event</strong> akhir pekan, dan <strong className="text-[#1F6B76] font-semibold">{bookRequests.length} request buku</strong> menunggu kurasi.
                  </p>

                  {/* Quick Action Shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsProductModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FFFBF7] border border-[#E6D2C0] hover:border-[#B05A26] text-xs font-semibold text-[#4A2A1C] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus size={13} className="text-[#B05A26]" />
                      <span>Tambah Produk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsQrScannerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F3E6F2] hover:bg-[#EBD5EA] border border-[#BA7EB8]/40 text-xs font-semibold text-[#7E4A84] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
                    >
                      <Camera size={13} />
                      <span>Scan Tiket Workshop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('cms')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E4ECFB] hover:bg-[#D5E3FA] border border-[#92B2F3]/40 text-xs font-semibold text-[#3F5FA0] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
                    >
                      <FileText size={13} />
                      <span>Edit Teks CMS</span>
                    </button>
                  </div>
                </div>

                {/* Right Mascot Graphic */}
                <div className="hidden md:flex items-center justify-center shrink-0 relative w-[130px] h-[130px] z-10">
                  <Image
                    src="/images/mascot/maskot-lompat-konfeti.png"
                    alt="Maskot BabyShalls"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>

                {/* Soft Decorative Pastel Circles in Background */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#E4ECFB]/40 blur-2xl pointer-events-none" />
                <div className="absolute right-36 -top-8 w-32 h-32 rounded-full bg-[#FFF1C7]/40 blur-2xl pointer-events-none" />
              </div>

              {/* 5 KPI Cards with Figma Pastel Tokens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* 1. Pendapatan (Brick/Terracotta pastel) */}
                <div className="bg-gradient-to-br from-white to-[#FBE6D8]/35 p-4 sm:p-5 rounded-[4px] border border-[#EFA27A]/50 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#8E431A] uppercase tracking-wider">
                      Pendapatan Bulan Ini
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FBE6D8] text-[#B05A26] flex items-center justify-center shrink-0">
                      <Tag size={16} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[20px] font-bold text-[#4A2A1C] block">
                      Rp 18.420.000
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/30 text-[10px] font-semibold rounded-full mt-1.5">
                      ↑ +12.5% vs bln lalu
                    </span>
                  </div>
                </div>

                {/* 2. Pesanan Baru (Blue pastel) */}
                <div className="bg-gradient-to-br from-white to-[#E4ECFB]/40 p-4 sm:p-5 rounded-[4px] border border-[#92B2F3]/60 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#3F5FA0] uppercase tracking-wider">
                      Pesanan Baru
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#E4ECFB] text-[#3F5FA0] flex items-center justify-center shrink-0">
                      <Package size={16} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[20px] font-bold text-[#4A2A1C] block">
                      24 Pesanan
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/40 text-[10px] font-semibold rounded-full mt-1.5">
                      Hari ini di toko
                    </span>
                  </div>
                </div>

                {/* 3. Perlu Dikirim (Sunny Butter Yellow pastel) */}
                <div className="bg-gradient-to-br from-white to-[#FFF1C7]/40 p-4 sm:p-5 rounded-[4px] border border-[#F7C94B]/60 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#8A5A00] uppercase tracking-wider">
                      Perlu Dikirim
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF1C7] text-[#8A5A00] flex items-center justify-center shrink-0">
                      <Truck size={16} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[20px] font-bold text-[#8A5A00] block">
                      {orders.filter((o) => o.status === 'Perlu Dikirim').length} Pesanan
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/40 text-[10px] font-semibold rounded-full mt-1.5">
                      Segera kemas &amp; resi
                    </span>
                  </div>
                </div>

                {/* 4. Pendaftar Event (Lilac Lavender pastel) */}
                <div className="bg-gradient-to-br from-white to-[#F3E6F2]/40 p-4 sm:p-5 rounded-[4px] border border-[#BA7EB8]/50 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#7E4A84] uppercase tracking-wider">
                      Pendaftar Event
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F3E6F2] text-[#7E4A84] flex items-center justify-center shrink-0">
                      <CalendarCheck size={16} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[20px] font-bold text-[#4A2A1C] block">
                      36 Peserta
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F3E6F2] text-[#7E4A84] border border-[#BA7EB8]/30 text-[10px] font-semibold rounded-full mt-1.5">
                      Workshop akhir pekan
                    </span>
                  </div>
                </div>

                {/* 5. Request Buku (Teal Aqua pastel) */}
                <div className="bg-gradient-to-br from-white to-[#DDF6F9]/40 p-4 sm:p-5 rounded-[4px] border border-[#8DDBE6]/60 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#1F6B76] uppercase tracking-wider">
                      Request Buku
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#DDF6F9] text-[#1F6B76] flex items-center justify-center shrink-0">
                      <BookOpen size={16} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[20px] font-bold text-[#1F6B76] block">
                      {bookRequests.length} Permintaan
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]/30 text-[10px] font-semibold rounded-full mt-1.5">
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
                    <span className="text-xs font-semibold text-[#B05A26] bg-[#FBE6D8] border border-[#EFA27A]/40 px-2.5 py-1 rounded-[4px]">
                      +18% Bulan Ini
                    </span>
                  </div>

                  <div className="h-[240px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B05A26" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#92B2F3" stopOpacity={0.05} />
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
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#7E4A84]" />
                      <h3 className="text-[16px] font-medium text-[#4A2A1C]">
                        Event Mendatang
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="text-xs text-[#7E4A84] font-semibold hover:underline"
                    >
                      Lihat Semua &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#FCF9FD] border border-[#F3E6F2] hover:border-[#BA7EB8] rounded-[4px] space-y-2 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#7E4A84] bg-[#F3E6F2] border border-[#BA7EB8]/30 px-2 py-0.5 rounded-[4px]">
                          28 Nov 2026
                        </span>
                        <span className="text-[11px] text-[#2A6E37] font-semibold bg-[#DDF1E5] px-2 py-0.5 rounded-full">
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
                        className="w-full py-1.5 mt-1 bg-white border border-[#BA7EB8] text-[#7E4A84] hover:bg-[#7E4A84] hover:text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                      >
                        Buka Scanner Check-in
                      </button>
                    </div>

                    <div className="p-3.5 bg-[#FCF9FD] border border-[#F3E6F2] hover:border-[#BA7EB8] rounded-[4px] space-y-2 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#7E4A84] bg-[#F3E6F2] border border-[#BA7EB8]/30 px-2 py-0.5 rounded-[4px]">
                          29 Nov 2026
                        </span>
                        <span className="text-[11px] text-[#2A6E37] font-semibold bg-[#DDF1E5] px-2 py-0.5 rounded-full">
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
                        className="w-full py-1.5 mt-1 bg-white border border-[#BA7EB8] text-[#7E4A84] hover:bg-[#7E4A84] hover:text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
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
              
              {/* Pastel Quick Tips Banner */}
              <div className="bg-gradient-to-r from-[#FFF6EA] via-[#E4ECFB]/50 to-[#DDF1E5]/40 border border-[#92B2F3]/40 p-4 sm:p-5 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 shrink-0">
                    <Image
                      src="/images/mascot/maskot-melambai.png"
                      alt="BabyShalls Mascot"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#3F5FA0] tracking-wider uppercase block">
                      MANAJEMEN PENGIRIMAN HARIAN
                    </span>
                    <p className="text-xs text-[#4A2A1C]">
                      Pesanan yang diinput resi sebelum pukul <strong>15.00 WIB</strong> langsung masuk pickup kurir ekspedisi hari ini.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-3 py-1 bg-white border border-[#E6D2C0] text-[#7A5644] rounded-[4px]">
                    Total {orders.length} Pesanan
                  </span>
                </div>
              </div>

              {/* Status Tabs (Figma #218:5064) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E6D2C0]">
                {[
                  { key: 'all', label: 'Semua', count: orders.length, activeCls: 'bg-[#FFF6EA] text-[#4A2A1C] border-[#B05A26]' },
                  { key: 'pending', label: 'Menunggu Bayar', count: orders.filter((o) => o.status === 'Menunggu Pembayaran').length, activeCls: 'bg-[#FFF1C7] text-[#8A5A00] border-[#F7C94B]' },
                  { key: 'processing', label: 'Perlu Dikirim', count: orders.filter((o) => o.status === 'Perlu Dikirim').length, activeCls: 'bg-[#FBE6D8] text-[#B05A26] border-[#EFA27A]' },
                  { key: 'shipped', label: 'Sedang Dikirim', count: orders.filter((o) => o.status === 'Sedang Dikirim').length, activeCls: 'bg-[#E4ECFB] text-[#3F5FA0] border-[#92B2F3]' },
                  { key: 'completed', label: 'Selesai', count: orders.filter((o) => o.status === 'Selesai').length, activeCls: 'bg-[#DDF1E5] text-[#2A6E37] border-[#82BC85]' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setOrderFilter(tab.key)}
                    className={`px-4 py-2 text-xs font-medium rounded-t-[4px] transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
                      orderFilter === tab.key
                        ? `${tab.activeCls} font-semibold border-b-[#B05A26] shadow-2xs`
                        : 'border-b-transparent text-[#7A5644] hover:text-[#4A2A1C] hover:bg-[#FFFBF5]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 border border-black/5 font-bold">
                      {tab.count}
                    </span>
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
                <div className="p-3 bg-[#FBE6D8] border border-[#EFA27A]/50 rounded-[4px] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#B05A26]">
                    {selectedOrderIds.length} pesanan dipilih
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Request pickup massal berhasil!')}
                      className="px-3 py-1 bg-[#B05A26] text-white text-xs font-medium rounded-[2px] hover:bg-[#8E431A]"
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
                      <tr key={o.orderId} className="hover:bg-[#FFFDF9] transition-colors">
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
                            <span className="block text-[10px] text-[#7A5644] font-mono font-normal">
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
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                              o.deliveryMethod?.includes('Toko')
                                ? 'bg-[#FBE6D8] text-[#8E431A] border border-[#EFA27A]/40'
                                : 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/40'
                            }`}
                          >
                            {o.deliveryMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#4A2A1C]">
                          {formatIDR(o.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-[4px] text-[11px] font-medium ${
                              o.status === 'Selesai'
                                ? 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/40'
                                : o.status === 'Sedang Dikirim'
                                ? 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/50'
                                : o.status === 'Perlu Dikirim'
                                ? 'bg-[#FBE6D8] text-[#B05A26] border border-[#EFA27A]/50'
                                : 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/50'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openOrderDrawer(o)}
                            className="px-3 py-1 bg-[#FFF6EA] hover:bg-[#B05A26] hover:text-white text-[#B05A26] border border-[#E6D2C0] hover:border-[#B05A26] font-medium rounded-[2px] transition-colors cursor-pointer"
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
              
              {/* Product KPI Pastel Mini-Cards & Add Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
                  <div className="bg-[#FFF6EA] border border-[#E6D2C0] p-3 rounded-[4px]">
                    <span className="text-[10px] font-bold text-[#7A5644] uppercase tracking-wider block">Total Katalog</span>
                    <span className="text-base font-bold text-[#4A2A1C]">{products.length} Item</span>
                  </div>
                  <div className="bg-[#FFF1C7]/60 border border-[#F7C94B]/40 p-3 rounded-[4px]">
                    <span className="text-[10px] font-bold text-[#8A5A00] uppercase tracking-wider block">Buku Impor/Lokal</span>
                    <span className="text-base font-bold text-[#8A5A00]">
                      {products.filter((p) => p.category.includes('Book')).length} Item
                    </span>
                  </div>
                  <div className="bg-[#F3E6F2]/70 border border-[#BA7EB8]/40 p-3 rounded-[4px]">
                    <span className="text-[10px] font-bold text-[#7E4A84] uppercase tracking-wider block">Mainan Edukasi</span>
                    <span className="text-base font-bold text-[#7E4A84]">
                      {products.filter((p) => p.category.includes('Toys')).length} Item
                    </span>
                  </div>
                  <div className="bg-[#FDE3E8]/70 border border-[#FBA6B2]/40 p-3 rounded-[4px]">
                    <span className="text-[10px] font-bold text-[#B83246] uppercase tracking-wider block">Preloved Kurasi</span>
                    <span className="text-base font-bold text-[#B83246]">
                      {products.filter((p) => p.category === 'Preloved Item' || p.condition === 'preloved').length} Item
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

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
                        <tr key={p.id} className="hover:bg-[#FFFDF9] transition-colors">
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
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-[3px] text-[11px] font-medium ${
                                p.category === 'Board Books'
                                  ? 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/30'
                                  : p.category === 'Picture Books'
                                  ? 'bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]/40'
                                  : p.category === 'Educational Toys'
                                  ? 'bg-[#F3E6F2] text-[#7E4A84] border border-[#BA7EB8]/30'
                                  : 'bg-[#FDE3E8] text-[#B83246] border border-[#FBA6B2]/40'
                              }`}
                            >
                              {p.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-[2px] text-[11px] font-medium ${
                                p.ageGroup?.includes('0-1')
                                  ? 'bg-[#E4ECFB] text-[#3F5FA0]'
                                  : p.ageGroup?.includes('1-3')
                                  ? 'bg-[#DDF1E5] text-[#2A6E37]'
                                  : p.ageGroup?.includes('3-5')
                                  ? 'bg-[#FFF1C7] text-[#8A5A00]'
                                  : 'bg-[#FBE6D8] text-[#B05A26]'
                              }`}
                            >
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
                                  ? 'bg-[#DDF1E5] text-[#2A6E37] hover:bg-[#c9e8d4] border border-[#82BC85]/30'
                                  : 'bg-[#FDF2F2] text-[#C0392B] hover:bg-[#fae2e2] border border-[#C0392B]/20'
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
              
              {/* Event Summary Pastel Banner */}
              <div className="bg-gradient-to-r from-[#FFF6EA] via-[#F3E6F2] to-[#E4ECFB]/50 border border-[#BA7EB8]/40 p-6 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
                <div className="space-y-1 z-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F3E6F2] border border-[#BA7EB8]/40 text-[#7E4A84] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7E4A84]"></span>
                    <span>WORKSHOP &amp; SENSORY PLAY CITRALAND</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#4A2A1C]">
                    Pemeriksaan Tiket &amp; Check-In Peserta
                  </h3>
                  <p className="text-xs text-[#7A5644] leading-relaxed">
                    Verifikasi tiket peserta workshop weekend dengan scan kamera smartphone/laptop atau masukkan kode tiket unik anak.
                  </p>
                </div>

                <div className="flex items-center gap-4 z-10 shrink-0">
                  <div className="relative w-16 h-16 hidden md:block">
                    <Image
                      src="/images/mascot/maskot-tiket.png"
                      alt="Mascot Tiket"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQrScannerOpen(true)}
                    className="px-5 py-3 bg-[#7E4A84] hover:bg-[#613467] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Camera size={16} />
                    <span>Buka Kamera QR Scanner</span>
                  </button>
                </div>
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
                      <tr key={t.ticketId} className="hover:bg-[#FFFDF9] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-semibold text-[#7E4A84] bg-[#F3E6F2] border border-[#BA7EB8]/30 px-2 py-0.5 rounded-[3px]">
                            {t.ticketId}
                          </span>
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
                            className={`inline-block px-2.5 py-1 rounded-[4px] text-[11px] font-medium ${
                              t.status === 'Sudah Hadir'
                                ? 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/40'
                                : 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/40'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(t.ticketId)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                              t.status === 'Sudah Hadir'
                                ? 'bg-[#F0F0F0] text-[#7A5644] hover:bg-[#e2e2e2] border border-[#E6D2C0]'
                                : 'bg-[#7E4A84] text-white hover:bg-[#613467]'
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
              
              {/* Pastel Header Banner */}
              <div className="bg-gradient-to-r from-[#FFF6EA] via-[#DDF6F9] to-[#E4ECFB]/50 border border-[#8DDBE6]/50 p-6 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
                <div className="space-y-1 z-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#DDF6F9] border border-[#8DDBE6]/50 text-[#1F6B76] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B76]"></span>
                    <span>LAYANAN PENCARIAN BUKU SPESIFIK</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#4A2A1C]">
                    Kurasi Permintaan Buku Pelanggan
                  </h3>
                  <p className="text-xs text-[#7A5644] leading-relaxed">
                    Daftar buku anak langka atau impor yang diminta orang tua. Hubungi via WhatsApp begitu stok tersedia di butik.
                  </p>
                </div>

                <div className="flex items-center gap-4 z-10 shrink-0">
                  <div className="relative w-16 h-16 hidden md:block">
                    <Image
                      src="/images/mascot/maskot-menulis-surat.png"
                      alt="Mascot Book Request"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="px-3.5 py-2 bg-white/90 border border-[#8DDBE6] text-[#1F6B76] text-xs font-semibold rounded-[4px] shadow-2xs">
                    {bookRequests.length} Permintaan Masuk
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E6D2C0] pb-1 overflow-x-auto">
                {[
                  { key: 'all', label: 'Semua Status', activeCls: 'bg-[#FFF6EA] text-[#4A2A1C] border-[#B05A26]' },
                  { key: 'Sedang Dicari', label: 'Sedang Dicari', activeCls: 'bg-[#FFF1C7] text-[#8A5A00] border-[#F7C94B]' },
                  { key: 'Ditemukan', label: 'Ditemukan', activeCls: 'bg-[#DDF1E5] text-[#2A6E37] border-[#82BC85]' },
                  { key: 'Selesai', label: 'Selesai', activeCls: 'bg-[#E4ECFB] text-[#3F5FA0] border-[#92B2F3]' },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setRequestFilter(st.key)}
                    className={`px-4 py-2 text-xs font-medium rounded-t-[4px] transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                      requestFilter === st.key
                        ? `${st.activeCls} font-semibold border-b-[#1F6B76] shadow-2xs`
                        : 'border-b-transparent text-[#7A5644] hover:text-[#4A2A1C] hover:bg-[#FFFBF5]'
                    }`}
                  >
                    {st.label}
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
                        <tr key={req.id} className="hover:bg-[#FFFDF9] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-[#1F6B76]">
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
                              className="text-[11px] text-[#2A6E37] bg-[#DDF1E5] hover:bg-[#c9e8d4] px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 mt-1 font-medium transition-colors"
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
                              className={`inline-block px-2.5 py-1 rounded-[4px] text-[11px] font-medium ${
                                req.status === 'Ditemukan'
                                  ? 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/40'
                                  : req.status === 'Selesai'
                                  ? 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/40'
                                  : 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/40'
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
                              className="px-3 py-1 bg-[#FFF6EA] hover:bg-[#1F6B76] hover:text-white text-[#1F6B76] border border-[#8DDBE6] text-xs font-medium rounded-[2px] transition-colors cursor-pointer"
                            >
                              Ubah Status
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
              VIEW 06 · KONTEN (SEMI-CMS) (Proposal & Client Requirement)
              ========================================================================= */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              
              {/* CMS Top Header Bar */}
              <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#FFF6EA] text-[#B05A26] text-[10px] font-bold uppercase rounded-[2px] tracking-wider">
                      Semi-CMS Engine
                    </span>
                    <span className="text-xs text-[#7A5644]">Sinkronisasi Real-time ke Public Site</span>
                  </div>
                  <h3 className="text-[20px] font-medium text-[#4A2A1C]">
                    Manajemen Konten &amp; Teks Website
                  </h3>
                  <p className="text-xs text-[#7A5644] max-w-2xl mt-0.5">
                    Ubah teks hero, banner promosi, profil tentang kami, kelola FAQ (tambah/edit/hapus), kebijakan sterilisasi UV buku preloved, dan info kontak toko tanpa perlu koding ulang.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleResetCms}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FFF6EA] hover:bg-[#FBE6D8] border border-[#E6D2C0] text-[#7A5644] text-xs font-semibold rounded-[2px] transition-colors"
                  >
                    <RotateCcw size={14} className="text-[#B05A26]" />
                    <span>Reset Default</span>
                  </button>

                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FFFBF7] border border-[#E6D2C0] text-[#4A2A1C] text-xs font-semibold rounded-[2px] transition-colors"
                  >
                    <ExternalLink size={14} className="text-[#B05A26]" />
                    <span>Lihat Website</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSaveCms}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs Nav */}
              <div className="flex items-center gap-2 border-b border-[#E6D2C0] pb-2 overflow-x-auto">
                {[
                  { key: 'home', label: '1. Beranda & Banner', icon: Sparkles, active: 'bg-[#B05A26] text-white', hover: 'hover:bg-[#FFF6EA] hover:text-[#B05A26]' },
                  { key: 'about', label: '2. Tentang Kami', icon: BookOpen, active: 'bg-[#3F5FA0] text-white', hover: 'hover:bg-[#E4ECFB] hover:text-[#3F5FA0]' },
                  { key: 'faq', label: '3. Kelola Tanya Jawab (FAQ)', icon: HelpCircle, active: 'bg-[#1F6B76] text-white', hover: 'hover:bg-[#DDF6F9] hover:text-[#1F6B76]' },
                  { key: 'preloved', label: '4. Preloved & Steril UV', icon: ShieldCheck, active: 'bg-[#2A6E37] text-white', hover: 'hover:bg-[#DDF1E5] hover:text-[#2A6E37]' },
                  { key: 'store', label: '5. Kontak & Toko Fisik', icon: Store, active: 'bg-[#7E4A84] text-white', hover: 'hover:bg-[#F3E6F2] hover:text-[#7E4A84]' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = cmsSubTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setCmsSubTab(tab.key as any)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-[4px] whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? `${tab.active} shadow-xs`
                          : `bg-white text-[#7A5644] border border-[#E6D2C0] ${tab.hover}`
                      }`}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUBTAB 1: BERANDA & BANNER */}
              {cmsSubTab === 'home' && (
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2E4D6] pb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[#4A2A1C]">
                          A. Hero Section (Header Utama Landing Page)
                        </h4>
                        <p className="text-[11px] text-[#7A5644]">
                          Teks headline dan tombol aksi yang pertama kali dilihat pengunjung.
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#B05A26] bg-[#FFF6EA] px-2 py-0.5 rounded-[2px]">
                        Figma #Hero
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Badge / Tag Atas
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.heroTag}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, heroTag: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Judul Headline Hero
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.heroTitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, heroTitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Subjudul / Narasi Hero
                        </label>
                        <textarea
                          rows={2}
                          value={cmsDraft.home.heroSubtitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, heroSubtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Label Tombol Utama (CTA 1)
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.heroPrimaryCtaText}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, heroPrimaryCtaText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Label Tombol Sekunder (CTA 2)
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.heroSecondaryCtaText}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, heroSecondaryCtaText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner Usia / Kampanye */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2E4D6] pb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[#4A2A1C]">
                          B. Banner Kampanye &amp; Usia (#B05A26 Terracotta)
                        </h4>
                        <p className="text-[11px] text-[#7A5644]">
                          Banner penuh di bawah katalog beranda dengan latar terracotta hangat.
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#B05A26] bg-[#FFF6EA] px-2 py-0.5 rounded-[2px]">
                        CampaignBanner
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Judul Banner Kampanye
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.ageBannerTitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, ageBannerTitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Subteks Banner Kampanye
                        </label>
                        <textarea
                          rows={2}
                          value={cmsDraft.home.ageBannerSubtitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, ageBannerSubtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Label Tombol Aksi
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.ageBannerButtonText}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, ageBannerButtonText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner Hampers */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2E4D6] pb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[#4A2A1C]">
                          C. Banner Hampers Kado &amp; Parsel Bayi
                        </h4>
                        <p className="text-[11px] text-[#7A5644]">
                          Banner khusus hampers kado kelahiran &amp; ulang tahun anak.
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#B05A26] bg-[#FFF6EA] px-2 py-0.5 rounded-[2px]">
                        BannerHampers
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Judul Banner Hampers
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.hampersBannerTitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, hampersBannerTitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Label Tombol Hampers
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.home.hampersBannerButtonText}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, hampersBannerButtonText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Subteks Banner Hampers
                        </label>
                        <textarea
                          rows={2}
                          value={cmsDraft.home.hampersBannerSubtitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              home: { ...prev.home, hampersBannerSubtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request & Visit Section */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#F2E4D6] pb-3">
                      <h4 className="text-sm font-semibold text-[#4A2A1C]">
                        D. Kartu Request Buku &amp; Kunjungan Toko Fisik
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Dua kartu penawaran khusus di bagian bawah landing page.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Request Card */}
                      <div className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] space-y-3">
                        <span className="text-[11px] font-bold text-[#B05A26] block">
                          KARTU 1: REQUEST BUKU
                        </span>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                            Judul Kartu
                          </label>
                          <input
                            type="text"
                            value={cmsDraft.home.requestCardTitle}
                            onChange={(e) =>
                              setCmsDraft((prev) => ({
                                ...prev,
                                home: { ...prev.home, requestCardTitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                            Subjudul Kartu
                          </label>
                          <textarea
                            rows={2}
                            value={cmsDraft.home.requestCardSubtitle}
                            onChange={(e) =>
                              setCmsDraft((prev) => ({
                                ...prev,
                                home: { ...prev.home, requestCardSubtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                            Teks Tombol
                          </label>
                          <input
                            type="text"
                            value={cmsDraft.home.requestCardButtonText}
                            onChange={(e) =>
                              setCmsDraft((prev) => ({
                                ...prev,
                                home: { ...prev.home, requestCardButtonText: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Visit Card */}
                      <div className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] space-y-3">
                        <span className="text-[11px] font-bold text-[#B05A26] block">
                          KARTU 2: KUNJUNGAN TOKO
                        </span>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                            Judul Kartu
                          </label>
                          <input
                            type="text"
                            value={cmsDraft.home.storeVisitTitle}
                            onChange={(e) =>
                              setCmsDraft((prev) => ({
                                ...prev,
                                home: { ...prev.home, storeVisitTitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                            Subjudul Kartu
                          </label>
                          <textarea
                            rows={2}
                            value={cmsDraft.home.storeVisitSubtitle}
                            onChange={(e) =>
                              setCmsDraft((prev) => ({
                                ...prev,
                                home: { ...prev.home, storeVisitSubtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                            Teks Tombol
                          </label>
                          <input
                            type="text"
                            value={cmsDraft.home.storeVisitButtonText}
                            onChange={(e) =>
                              setCmsDraft((prev) => ({
                                ...prev,
                                home: { ...prev.home, storeVisitButtonText: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: TENTANG KAMI */}
              {cmsSubTab === 'about' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#F2E4D6] pb-3">
                      <h4 className="text-sm font-semibold text-[#4A2A1C]">
                        A. Header &amp; Narasi Toko (/about)
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Teks pengantar dan narasi profil BabyShalls di Malang.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Badge Atas
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.about.badge}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              about: { ...prev.about, badge: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Judul Halaman
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.about.title}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              about: { ...prev.about, title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Narasi Profil Toko
                        </label>
                        <textarea
                          rows={3}
                          value={cmsDraft.about.description}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              about: { ...prev.about, description: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Judul Galeri Foto Toko
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.about.galleryTitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              about: { ...prev.about, galleryTitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Subjudul Galeri Foto Toko
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.about.gallerySubtitle}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              about: { ...prev.about, gallerySubtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 Nilai Utama / Pillars */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#F2E4D6] pb-3">
                      <h4 className="text-sm font-semibold text-[#4A2A1C]">
                        B. 3 Nilai Utama BabyShalls (Pillars)
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Tiga komitmen pelayanan yang ditampilkan dalam kartu bernomor di halaman tentang kami.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {cmsDraft.about.pillars.map((pillar, idx) => (
                        <div key={idx} className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] space-y-3">
                          <span className="w-7 h-7 rounded-full bg-[#FFF6EA] text-[#B05A26] flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                              Judul Pilar {idx + 1}
                            </label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setCmsDraft((prev) => {
                                  const updatedPillars = [...prev.about.pillars];
                                  updatedPillars[idx] = { ...updatedPillars[idx], title: newTitle };
                                  return { ...prev, about: { ...prev.about, pillars: updatedPillars } };
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                              Penjelasan Pilar
                            </label>
                            <textarea
                              rows={3}
                              value={pillar.desc}
                              onChange={(e) => {
                                const newDesc = e.target.value;
                                setCmsDraft((prev) => {
                                  const updatedPillars = [...prev.about.pillars];
                                  updatedPillars[idx] = { ...updatedPillars[idx], desc: newDesc };
                                  return { ...prev, about: { ...prev.about, pillars: updatedPillars } };
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: KELOLA FAQ (CRUD) */}
              {cmsSubTab === 'faq' && (
                <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F2E4D6] pb-4">
                    <div>
                      <h4 className="text-base font-semibold text-[#4A2A1C]">
                        Kelola Daftar Tanya Jawab (FAQ)
                      </h4>
                      <p className="text-xs text-[#7A5644]">
                        Tambah, edit, aktifkan/nonaktifkan, atau hapus pertanyaan yang tampil di pusat bantuan /faq.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddFaq}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs cursor-pointer shrink-0"
                    >
                      <Plus size={14} />
                      <span>Tambah FAQ Baru</span>
                    </button>
                  </div>

                  {/* Filter Kategori */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#7A5644] mr-1">Filter Kategori:</span>
                    {[
                      'all',
                      'Pemesanan & Pembayaran',
                      'Pengiriman & Ambil di Toko',
                      'Event & Workshop Gratis',
                      'Kurasi & Buku Preloved',
                      'Layanan Request Buku',
                      'Kado & Hampers',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFaqCategoryFilter(cat)}
                        className={`px-3 py-1 text-xs rounded-[2px] transition-colors cursor-pointer ${
                          faqCategoryFilter === cat
                            ? 'bg-[#4A2A1C] text-white'
                            : 'bg-[#FFF6EA] text-[#7A5644] hover:bg-[#FBE6D8]'
                        }`}
                      >
                        {cat === 'all' ? 'Semua Kategori' : cat}
                      </button>
                    ))}
                  </div>

                  {/* FAQ Items List */}
                  <div className="space-y-3">
                    {(cms.faq || [])
                      .filter((f) => faqCategoryFilter === 'all' || f.category === faqCategoryFilter)
                      .map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white border border-[#E6D2C0] rounded-[2px] hover:border-[#B05A26] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF6EA] text-[#B05A26] px-2 py-0.5 rounded-[2px]">
                                {item.category}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-[2px] ${
                                  item.isActive !== false
                                    ? 'bg-[#EBF6EC] text-[#2A6E37]'
                                    : 'bg-[#F0F0F0] text-[#777777]'
                                }`}
                              >
                                {item.isActive !== false ? 'Aktif' : 'Non-aktif'}
                              </span>
                            </div>
                            <h5 className="text-sm font-semibold text-[#4A2A1C]">
                              {item.question}
                            </h5>
                            <p className="text-xs text-[#7A5644] line-clamp-2 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFaqActive(item)}
                              title={item.isActive !== false ? 'Nonaktifkan' : 'Aktifkan'}
                              className="px-2.5 py-1 text-xs font-medium border border-[#E6D2C0] text-[#7A5644] rounded-[2px] hover:bg-[#FFF6EA] transition-colors"
                            >
                              {item.isActive !== false ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditFaq(item)}
                              className="p-1.5 bg-[#FFF6EA] hover:bg-[#FBE6D8] text-[#B05A26] rounded-[2px] transition-colors"
                              title="Edit Pertanyaan"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(item.id, item.question)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-[2px] transition-colors"
                              title="Hapus Pertanyaan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: PRELOVED & STERIL UV */}
              {cmsSubTab === 'preloved' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#F2E4D6] pb-3">
                      <h4 className="text-sm font-semibold text-[#4A2A1C]">
                        A. Hero &amp; Standar Sterilisasi UV (/preloved)
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Kebijakan kebersihan dan garansi keamanan buku preloved BabyShalls.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Badge Hero
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.preloved.badge}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              preloved: { ...prev.preloved, badge: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Judul Hero Preloved
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.preloved.title}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              preloved: { ...prev.preloved, title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Deskripsi Kurasi Preloved
                        </label>
                        <textarea
                          rows={2}
                          value={cmsDraft.preloved.description}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              preloved: { ...prev.preloved, description: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Pemberitahuan Sterilisasi Sinar UV-C
                        </label>
                        <input
                          type="text"
                          value={cmsDraft.preloved.uvNotice}
                          onChange={(e) =>
                            setCmsDraft((prev) => ({
                              ...prev,
                              preloved: { ...prev.preloved, uvNotice: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 Jaminan Mutu Preloved */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#F2E4D6] pb-3">
                      <h4 className="text-sm font-semibold text-[#4A2A1C]">
                        B. 3 Jaminan Mutu Buku Preloved
                      </h4>
                      <p className="text-[11px] text-[#7A5644]">
                        Tiga garansi keamanan yang ditampilkan di bawah headline preloved.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(cmsDraft.preloved.guarantees || []).map((g, idx) => (
                        <div key={idx} className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] space-y-3">
                          <span className="text-xs font-bold text-[#2A6E37] block">
                            Jaminan #{idx + 1}
                          </span>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                              Judul Jaminan
                            </label>
                            <input
                              type="text"
                              value={g.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setCmsDraft((prev) => {
                                  const updatedG = [...(prev.preloved.guarantees || [])];
                                  updatedG[idx] = { ...updatedG[idx], title: newTitle };
                                  return { ...prev, preloved: { ...prev.preloved, guarantees: updatedG } };
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                              Keterangan Singkat
                            </label>
                            <input
                              type="text"
                              value={g.desc}
                              onChange={(e) => {
                                const newDesc = e.target.value;
                                setCmsDraft((prev) => {
                                  const updatedG = [...(prev.preloved.guarantees || [])];
                                  updatedG[idx] = { ...updatedG[idx], desc: newDesc };
                                  return { ...prev, preloved: { ...prev.preloved, guarantees: updatedG } };
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 5: PENGATURAN KONTAK & TOKO */}
              {cmsSubTab === 'store' && (
                <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-4">
                  <div className="border-b border-[#F2E4D6] pb-3">
                    <h4 className="text-sm font-semibold text-[#4A2A1C]">
                      Informasi Toko Fisik, Jam Operasional &amp; Link Sosial Media
                    </h4>
                    <p className="text-[11px] text-[#7A5644]">
                      Data kontak ini otomatis diperbarui di footer seluruh halaman, floating WhatsApp, dan tombol arah peta.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Nama Butik Resmi
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.storeName}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, storeName: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Jam Buka &amp; Operasional
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.operatingHours || ''}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, operatingHours: e.target.value, openingHours: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Alamat Butik Citraland
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.address}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, address: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Kota &amp; Kode Pos
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.city}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, city: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Nomor WhatsApp Customer Service (Format 62...)
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.whatsappNumber}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, whatsappNumber: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Nomor Telepon Kantor
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.phone || ''}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, phone: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        value={cmsDraft.store.email || ''}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, email: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        URL Akun Instagram
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.instagramUrl}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, instagramUrl: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        URL Tautan Google Maps
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.googleMapsUrl}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, googleMapsUrl: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                        URL Tautan Grup Komunitas WhatsApp
                      </label>
                      <input
                        type="text"
                        value={cmsDraft.store.whatsappCommunityUrl}
                        onChange={(e) =>
                          setCmsDraft((prev) => ({
                            ...prev,
                            store: { ...prev.store, whatsappCommunityUrl: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL TAMBAH / EDIT FAQ */}
              {isFaqModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[4px] max-w-lg w-full p-6 shadow-xl space-y-4 border border-[#E6D2C0]">
                    <div className="flex items-center justify-between border-b border-[#F2E4D6] pb-3">
                      <h4 className="text-base font-semibold text-[#4A2A1C]">
                        {editingFaq ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsFaqModalOpen(false)}
                        className="p-1 text-[#7A5644] hover:text-[#4A2A1C]"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Kategori
                        </label>
                        <select
                          value={faqFormCategory}
                          onChange={(e) => setFaqFormCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        >
                          <option value="Pemesanan & Pembayaran">Pemesanan &amp; Pembayaran</option>
                          <option value="Pengiriman & Ambil di Toko">Pengiriman &amp; Ambil di Toko</option>
                          <option value="Event & Workshop Gratis">Event &amp; Workshop Gratis</option>
                          <option value="Kurasi & Buku Preloved">Kurasi &amp; Buku Preloved</option>
                          <option value="Layanan Request Buku">Layanan Request Buku</option>
                          <option value="Kado & Hampers">Kado &amp; Hampers</option>
                          <option value="Umum & Komunitas">Umum &amp; Komunitas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Pertanyaan (Question) *
                        </label>
                        <input
                          type="text"
                          value={faqFormQuestion}
                          onChange={(e) => setFaqFormQuestion(e.target.value)}
                          placeholder="Contoh: Apakah buku preloved sudah disterilkan?"
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                          Jawaban (Answer) *
                        </label>
                        <textarea
                          rows={4}
                          value={faqFormAnswer}
                          onChange={(e) => setFaqFormAnswer(e.target.value)}
                          placeholder="Tuliskan jawaban yang ramah, informatif, dan jelas untuk pembeli..."
                          className="w-full px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F2E4D6]">
                      <button
                        type="button"
                        onClick={() => setIsFaqModalOpen(false)}
                        className="px-4 py-2 bg-[#F5F5F5] text-[#7A5644] text-xs font-semibold rounded-[2px] hover:bg-[#EAEAEA] transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveFaqModal}
                        className="px-5 py-2 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#8E431A] transition-colors shadow-xs"
                      >
                        {editingFaq ? 'Simpan Pembaruan' : 'Tambahkan ke FAQ'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              VIEW 07 · PENGGUNA (Figma Node #218:7742)
              ========================================================================= */}
          {activeTab === 'users' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F2E4D6] pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FDE3E8] border border-[#FBA6B2]/40 text-[#B83246] text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Users size={12} />
                    <span>TIM BUTIK MALANG</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#4A2A1C]">
                    Daftar Staf &amp; Pengguna Admin
                  </h3>
                  <p className="text-xs text-[#7A5644]">
                    Kelola hak akses dan peran staf butik BabyShalls di Citraland Malang.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Fitur penambahan staf butik baru siap dikonfigurasi!')}
                  className="px-4 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Tambah Staf Baru</span>
                </button>
              </div>

              <div className="divide-y divide-[#F2E4D6]">
                <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#FFFDF9] p-3 rounded-[4px] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FBE6D8] border border-[#EFA27A]/40 flex items-center justify-center font-bold text-[#8E431A] text-sm">
                      SA
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#4A2A1C] block">
                        Superadmin BabyShalls (admin@babyshalls.com)
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        Akses Penuh: Finansial, Katalog, Pesanan &amp; Pengaturan CMS
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#FBE6D8] text-[#8E431A] border border-[#EFA27A]/50 text-[11px] font-bold px-3 py-1 rounded-[4px]">
                    SUPERADMIN
                  </span>
                </div>

                <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#FFFDF9] p-3 rounded-[4px] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DDF6F9] border border-[#8DDBE6]/50 flex items-center justify-center font-bold text-[#1F6B76] text-sm">
                      KB
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#4A2A1C] block">
                        Kurator Buku Malang (curator@babyshalls.com)
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        Akses: Manajemen Katalog Produk &amp; Book Request Pelanggan
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]/60 text-[11px] font-bold px-3 py-1 rounded-[4px]">
                    KURATOR BUKU
                  </span>
                </div>

                <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#FFFDF9] p-3 rounded-[4px] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F3E6F2] border border-[#BA7EB8]/40 flex items-center justify-center font-bold text-[#7E4A84] text-sm">
                      KS
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#4A2A1C] block">
                        Kasir &amp; Event Citraland (store@babyshalls.com)
                      </span>
                      <span className="text-[11px] text-[#7A5644]">
                        Akses: Check-In QR Scanner, Pos Kasir &amp; Pengiriman Kurir
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#F3E6F2] text-[#7E4A84] border border-[#BA7EB8]/50 text-[11px] font-bold px-3 py-1 rounded-[4px]">
                    KASIR &amp; EVENT
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
              <div className="bg-gradient-to-br from-white to-[#FBE6D8]/20 border border-[#EFA27A]/50 rounded-[4px] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FBE6D8] text-[#8E431A] flex items-center justify-center">
                    <Download className="w-5 h-5 text-[#8E431A]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#4A2A1C]">
                      Ekspor Data Katalog &amp; Transaksi
                    </h3>
                    <span className="text-[10px] text-[#8E431A] font-semibold bg-[#FBE6D8] px-2 py-0.2 rounded-full">
                      CADANGAN DATA
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Unduh seluruh database produk atau riwayat pesanan pelanggan ke format CSV / JSON untuk keperluan arsip laporan pembukuan.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
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
                    className="px-4 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                  >
                    Ekspor Produk (JSON)
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Riwayat pesanan CSV berhasil diunduh!')}
                    className="px-4 py-2 bg-white border border-[#E6D2C0] hover:border-[#B05A26] text-xs font-semibold text-[#4A2A1C] rounded-[2px] transition-colors cursor-pointer"
                  >
                    Ekspor Pesanan (CSV)
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-[#DDF1E5]/20 border border-[#82BC85]/50 rounded-[4px] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#2A6E37]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#4A2A1C]">
                      Impor Data Produk Massal
                    </h3>
                    <span className="text-[10px] text-[#2A6E37] font-semibold bg-[#DDF1E5] px-2 py-0.2 rounded-full">
                      BULK UPLOAD
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Unggah file CSV atau JSON untuk menambahkan puluhan buku impor atau mainan edukasi sekaligus ke dalam sistem katalog.
                </p>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#2A6E37] text-[#2A6E37] hover:bg-[#DDF1E5] text-xs font-semibold rounded-[2px] cursor-pointer transition-colors">
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
            </div>
          )}

          {/* =========================================================================
              VIEW 09 · SHORTLINK & QR (Figma Node #218:8513)
              ========================================================================= */}
          {activeTab === 'shortlink' && (
            <div className="bg-gradient-to-br from-white via-[#FFF6EA]/60 to-[#E4ECFB]/40 border border-[#92B2F3]/50 rounded-[4px] p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F2E4D6] pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E4ECFB] border border-[#92B2F3]/50 text-[#3F5FA0] text-[10px] font-bold uppercase tracking-wider mb-1">
                    <QrCode size={12} />
                    <span>INTERAKSI OFFLINE KE ONLINE</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#4A2A1C]">
                    Generator QR Code Toko Fisik &amp; Meja Kasir
                  </h3>
                  <p className="text-xs text-[#7A5644]">
                    Buat QR code instan untuk diletakkan di rak buku, poster etalase, atau meja kasir Citraland Malang.
                  </p>
                </div>

                <div className="relative w-16 h-16 shrink-0 hidden sm:block">
                  <Image
                    src="/images/mascot/maskot-peta.png"
                    alt="Mascot QR Map"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="p-6 bg-white border border-[#E6D2C0] rounded-[6px] shadow-sm flex flex-col items-center gap-4 shrink-0">
                  <div className="bg-[#FFFBF5] p-4 rounded-[4px] border border-[#F2E4D6]">
                    <QRCodeSVG value={shortlinkUrl} size={180} />
                  </div>
                  <span className="text-xs font-semibold text-[#4A2A1C] text-center max-w-[200px] block">
                    {shortlinkTitle}
                  </span>
                  <span className="text-[10px] text-[#7A5644] bg-[#FFF6EA] px-2 py-0.5 rounded-full">
                    Scan untuk buka web
                  </span>
                </div>

                <div className="flex-1 space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                      Pilih Template Cepat
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShortlinkTitle('QR Meja Kasir BabyShalls Citraland');
                          setShortlinkUrl('https://babyshalls.com/shop');
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#FFF6EA] border border-[#E6D2C0] hover:border-[#B05A26] text-[#4A2A1C] rounded-[4px]"
                      >
                        Meja Kasir
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShortlinkTitle('Buku Preloved Steril UV');
                          setShortlinkUrl('https://babyshalls.com/preloved');
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#FDE3E8] border border-[#FBA6B2]/40 text-[#B83246] rounded-[4px]"
                      >
                        Rak Preloved
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShortlinkTitle('Jadwal Sensory Play Citraland');
                          setShortlinkUrl('https://babyshalls.com/events');
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#F3E6F2] border border-[#BA7EB8]/40 text-[#7E4A84] rounded-[4px]"
                      >
                        Area Workshop
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A2A1C] mb-1">
                      Label / Keterangan QR
                    </label>
                    <input
                      type="text"
                      value={shortlinkTitle}
                      onChange={(e) => setShortlinkTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
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
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shortlinkUrl);
                        showToast('Link berhasil disalin ke clipboard!');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-medium rounded-[2px] cursor-pointer"
                    >
                      <Copy size={14} />
                      <span>Salin Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('QR Code siap dicetak!')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#C9B3A5] text-xs font-medium rounded-[2px] hover:bg-[#FFFBF5] cursor-pointer"
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
