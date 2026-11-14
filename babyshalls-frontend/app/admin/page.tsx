'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  Check,
  X,
  Package,
  Layers,
  ChevronRight,
  Sliders,
  Image as ImageIcon,
  Upload,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Truck,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Product, ProductCategory, AgeGroup, AdminUser } from '../../src/types';
import { mockProducts as initialProducts, formatIDR } from '../../src/data/mockProducts';
import { HeroSlide } from '../../src/components/Hero';

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2400&q=90',
    alt: 'Child happily reading a picture book in warm natural light'
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=2400&q=90',
    alt: 'Curated stack of hardcover children picture books on wooden shelf'
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2400&q=90',
    alt: 'Open illustrated board book for early learning'
  },
  {
    id: 'slide-4',
    url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=2400&q=90',
    alt: 'Toddler playing with natural wooden Montessori toys beside books'
  }
];

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Active Admin Tab: 'overview' | 'orders' | 'catalog' | 'hero' | 'events' | 'requests'
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'catalog' | 'hero' | 'events' | 'requests'>('orders');

  // Orders Management State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [editingOrderResi, setEditingOrderResi] = useState<{ [orderId: string]: string }>({});
  const [editingOrderCourier, setEditingOrderCourier] = useState<{ [orderId: string]: string }>({});

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');

  // Hero Carousel State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideAlt, setNewSlideAlt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Event Registrations State
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);

  // Book Requests State
  const [bookRequests, setBookRequests] = useState<any[]>([]);

  // Modal State for Add / Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Products
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'Picture Books' as Exclude<ProductCategory, 'All Products'>,
    ageGroup: '3–5 Years' as AgeGroup,
    price: 155000,
    coverImage: '',
    description: '',
    inStock: true,
    badge: 'New',
    format: 'Hardcover',
    pages: '32 pages',
    language: 'English',
    isbn: '',
    dimensions: '20 x 20 x 1.2 cm'
  });

  // Check auth and load catalog, orders & hero data
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('babyshalls_admin_user');
      if (!storedUser) {
        // Set mock admin user if not present so it's fully accessible
        const demoAdmin: AdminUser = {
          id: 'admin-1',
          name: 'Kurator Butik BabyShalls',
          email: 'admin@babyshalls.id',
          role: 'curator'
        };
        localStorage.setItem('babyshalls_admin_user', JSON.stringify(demoAdmin));
        setCurrentUser(demoAdmin);
      } else {
        setCurrentUser(JSON.parse(storedUser));
      }

      // Load products
      const savedProducts = localStorage.getItem('babyshalls_catalog_data');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          } else {
            setProducts(initialProducts);
          }
        } catch {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
      }

      // Load hero slides
      const savedSlides = localStorage.getItem('babyshalls_hero_slides');
      if (savedSlides) {
        try {
          const parsed = JSON.parse(savedSlides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHeroSlides(parsed);
          }
        } catch {
          setHeroSlides(defaultHeroSlides);
        }
      }

      // Load orders
      const savedOrders = localStorage.getItem('babyshalls_orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch {
          setOrders([]);
        }
      } else {
        // Provide sample initial orders if empty
        const initialOrders = [
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
          },
          {
            orderId: 'BS-918234',
            customerName: 'Budi Prakoso',
            customerPhone: '081399887766',
            customerEmail: 'budi.prakoso@example.com',
            deliveryMethod: 'Ambil Sendiri di Toko Citraland Puncak Tidar, Malang',
            deliveryAddress: 'Butik BabyShalls Citraland Puncak Tidar Blok HH-26, Malang',
            paymentMethod: 'QRIS Instan',
            status: 'Diproses',
            shippingTrackingNumber: '',
            courier: 'Ambil di Toko',
            items: [
              {
                productId: '4',
                title: 'Grimm’s Rainbow Wooden Stacker',
                coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
                quantity: 1,
                price: 245000
              }
            ],
            subtotal: 245000,
            shippingFee: 0,
            giftWrappingCost: 25000,
            total: 270000,
            date: new Date(Date.now() - 3600000 * 4).toISOString()
          }
        ];
        setOrders(initialOrders);
        localStorage.setItem('babyshalls_orders', JSON.stringify(initialOrders));
      }

      // Load event registrations
      const savedEvents = localStorage.getItem('babyshalls_event_registrations');
      if (savedEvents) {
        try {
          setEventRegistrations(JSON.parse(savedEvents));
        } catch {
          setEventRegistrations([]);
        }
      } else {
        const initialEvents = [
          {
            id: 'reg-1',
            workshopId: 'ws-1',
            workshopTitle: 'Sensory Storytelling: The Very Hungry Caterpillar',
            parentName: 'Sarah Nurhaliza',
            email: 'sarah@example.com',
            phone: '0812-3456-7890',
            childrenCount: '1',
            childrenAge: '3 tahun',
            checkedIn: true,
            date: new Date().toISOString()
          },
          {
            id: 'reg-2',
            workshopId: 'ws-2',
            workshopTitle: 'Nature Craft & Botanical Painting for Toddlers',
            parentName: 'Dina Anindya',
            email: 'dina@example.com',
            phone: '0811-9876-5432',
            childrenCount: '2',
            childrenAge: '4 dan 2 tahun',
            checkedIn: false,
            date: new Date().toISOString()
          }
        ];
        setEventRegistrations(initialEvents);
        localStorage.setItem('babyshalls_event_registrations', JSON.stringify(initialEvents));
      }

      // Load book requests
      const savedReqs = localStorage.getItem('babyshalls_book_requests');
      if (savedReqs) {
        try {
          setBookRequests(JSON.parse(savedReqs));
        } catch {
          setBookRequests([]);
        }
      } else {
        const sampleReqs = [
          {
            id: 'REQ-101',
            bookTitle: 'Guess How Much I Love You (Pop-Up Edition)',
            author: 'Sam McBratney',
            contactEmail: 'bunda.nadia@gmail.com',
            contactPhone: '08129876543',
            notes: 'Mencari edisi hardcover pop-up berbahasa Inggris untuk kado ulang tahun anak ke-2.',
            createdAt: new Date().toISOString(),
            status: 'Dihubungi'
          }
        ];
        setBookRequests(sampleReqs);
        localStorage.setItem('babyshalls_book_requests', JSON.stringify(sampleReqs));
      }
    } finally {
      setIsAuthLoading(false);
    }
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Update Order Status & Resi
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status: newStatus
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('babyshalls_orders', JSON.stringify(updated));
    showToast(`Status pesanan ${orderId} diubah menjadi "${newStatus}"!`);
  };

  const handleSaveResi = (orderId: string) => {
    const resiValue = editingOrderResi[orderId];
    const courierValue = editingOrderCourier[orderId] || 'JNE Reguler';

    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          shippingTrackingNumber: resiValue !== undefined ? resiValue : o.shippingTrackingNumber,
          courier: courierValue,
          status: o.status === 'Menunggu Pembayaran' ? 'Diproses' : 'Dikirim'
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('babyshalls_orders', JSON.stringify(updated));
    showToast(`Nomor Resi untuk ${orderId} berhasil disimpan!`);
  };

  // Toggle Event Check-in
  const handleToggleEventCheckin = (regId: string) => {
    const updated = eventRegistrations.map((r) => {
      if (r.id === regId) {
        return {
          ...r,
          checkedIn: !r.checkedIn
        };
      }
      return r;
    });
    setEventRegistrations(updated);
    localStorage.setItem('babyshalls_event_registrations', JSON.stringify(updated));
    showToast('Status check-in peserta berhasil diperbarui!');
  };

  // Hero Slides
  const saveHeroSlidesState = (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    try {
      localStorage.setItem('babyshalls_hero_slides', JSON.stringify(slides));
      showToast('Hero Carousel berhasil diperbarui!');
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideUrl.trim()) return;

    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      url: newSlideUrl.trim(),
      alt: newSlideAlt.trim() || 'BabyShalls Campaign Image'
    };

    const updated = [...heroSlides, newSlide];
    saveHeroSlidesState(updated);
    setNewSlideUrl('');
    setNewSlideAlt('');
  };

  const handleDeleteSlide = (id: string) => {
    const updated = heroSlides.filter((s) => s.id !== id);
    saveHeroSlidesState(updated);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= heroSlides.length) return;
    const copy = [...heroSlides];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    saveHeroSlidesState(copy);
  };

  // Products Catalog
  const handleToggleStock = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('babyshalls_catalog_data', JSON.stringify(updated));
    showToast('Status ketersediaan stok diperbarui!');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini dari katalog?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('babyshalls_catalog_data', JSON.stringify(updated));
      showToast('Produk berhasil dihapus!');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...formData,
            price: Number(formData.price)
          };
        }
        return p;
      });
      setProducts(updated);
      localStorage.setItem('babyshalls_catalog_data', JSON.stringify(updated));
      showToast('Data buku berhasil diperbarui!');
    } else {
      const newProduct: Product = {
        id: `book-${Date.now()}`,
        ...formData,
        price: Number(formData.price)
      };
      const updated = [newProduct, ...products];
      setProducts(updated);
      localStorage.setItem('babyshalls_catalog_data', JSON.stringify(updated));
      showToast('Buku baru berhasil ditambahkan ke katalog!');
    }

    setIsModalOpen(false);
  };

  // Summary Metrics for Overview
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  }, [orders]);

  const filteredOrdersList = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesId = o.orderId?.toLowerCase().includes(q);
        const matchesName = o.customerName?.toLowerCase().includes(q);
        if (!matchesId && !matchesName) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchAge = selectedAge === 'all' || p.ageGroup === selectedAge;
      const matchStock =
        selectedStock === 'all' ||
        (selectedStock === 'inStock' && p.inStock) ||
        (selectedStock === 'outOfStock' && !p.inStock);
      return matchSearch && matchCategory && matchAge && matchStock;
    });
  }, [products, searchTerm, selectedCategory, selectedAge, selectedStock]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2725] flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2725] text-white px-5 py-3 text-xs font-semibold rounded-md shadow-xl flex items-center gap-2 animate-in fade-in duration-200 border border-[#EDE8E1]">
          <Check size={16} className="text-[#E07A5F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#EDE8E1] bg-[#FFFDF9] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#EDE8E1]">
            <Link href="/" className="inline-block">
              <img
                src="/BabyShallsLogo 1.PNG"
                alt="BabyShalls Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E07A5F] block mt-1">
              Back-Office &amp; Toko Kurator
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#E07A5F] text-white'
                  : 'text-[#68625D] hover:bg-[#FBE7E3]/50 hover:text-[#2C2725]'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>Dashboard Rekap</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-left cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#E07A5F] text-white'
                  : 'text-[#68625D] hover:bg-[#FBE7E3]/50 hover:text-[#2C2725]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package size={16} />
                <span>Kelola Pesanan</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === 'orders' ? 'bg-white/20' : 'bg-[#EDE8E1]'}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-left cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#E07A5F] text-white'
                  : 'text-[#68625D] hover:bg-[#FBE7E3]/50 hover:text-[#2C2725]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Katalog Buku &amp; Mainan</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === 'catalog' ? 'bg-white/20' : 'bg-[#EDE8E1]'}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-left cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#E07A5F] text-white'
                  : 'text-[#68625D] hover:bg-[#FBE7E3]/50 hover:text-[#2C2725]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={16} />
                <span>Banner Hero Slide</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === 'hero' ? 'bg-white/20' : 'bg-[#EDE8E1]'}`}>
                {heroSlides.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-left cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#E07A5F] text-white'
                  : 'text-[#68625D] hover:bg-[#FBE7E3]/50 hover:text-[#2C2725]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Peserta Workshop</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === 'events' ? 'bg-white/20' : 'bg-[#EDE8E1]'}`}>
                {eventRegistrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-left cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#E07A5F] text-white'
                  : 'text-[#68625D] hover:bg-[#FBE7E3]/50 hover:text-[#2C2725]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>Book Request</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === 'requests' ? 'bg-white/20' : 'bg-[#EDE8E1]'}`}>
                {bookRequests.length}
              </span>
            </button>

            <div className="pt-3 border-t border-[#EDE8E1]">
              <Link
                href="/"
                target="_blank"
                className="px-3 py-2 flex items-center justify-between text-[#68625D] hover:text-[#E07A5F] transition-colors"
              >
                <span>Lihat Website Toko</span>
                <ExternalLink size={13} strokeWidth={1.5} />
              </Link>
            </div>
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-6 border-t border-[#EDE8E1] text-xs">
          <div className="font-semibold text-[#2C2725] truncate">{currentUser?.name || 'Kurator Butik'}</div>
          <div className="text-[11px] text-[#68625D] truncate">{currentUser?.email}</div>
          <button
            onClick={() => router.push('/')}
            className="mt-3 flex items-center gap-1.5 text-xs text-[#E07A5F] hover:underline cursor-pointer"
          >
            <span>Kembali ke Halaman Depan</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* TAB 1: OVERVIEW / REKAP */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left">
              <div className="pb-4 border-b border-[#EDE8E1]">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                  Dashboard Rekap Penjualan &amp; Toko
                </h1>
                <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                  Ringkasan transaksi buku, status pesanan aktif, pendaftaran event gratis, dan inventory butik Citraland Malang.
                </p>
              </div>

              {/* 4 Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EDE8E1] p-5 rounded-lg shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68625D] block">
                    Total Transaksi
                  </span>
                  <span className="text-2xl font-bold text-[#E07A5F] mt-1 block">
                    {formatIDR(totalRevenue)}
                  </span>
                </div>

                <div className="bg-white border border-[#EDE8E1] p-5 rounded-lg shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68625D] block">
                    Pesanan Masuk
                  </span>
                  <span className="text-2xl font-bold text-[#2C2725] mt-1 block">
                    {orders.length} Pesanan
                  </span>
                  <span className="text-[11px] text-amber-700 font-medium">
                    {orders.filter((o) => o.status === 'Menunggu Pembayaran').length} menunggu bayar
                  </span>
                </div>

                <div className="bg-white border border-[#EDE8E1] p-5 rounded-lg shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68625D] block">
                    Koleksi Produk
                  </span>
                  <span className="text-2xl font-bold text-[#2C2725] mt-1 block">
                    {products.length} Judul
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {products.filter((p) => p.inStock).length} siap dikirim
                  </span>
                </div>

                <div className="bg-white border border-[#EDE8E1] p-5 rounded-lg shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68625D] block">
                    Peserta Workshop
                  </span>
                  <span className="text-2xl font-bold text-[#2C2725] mt-1 block">
                    {eventRegistrations.length} Keluarga
                  </span>
                  <span className="text-[11px] text-[#3A5C37] font-medium">
                    {eventRegistrations.filter((r) => r.checkedIn).length} hadir di lokasi
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Preview */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E1]">
                  <h2 className="text-sm font-bold text-[#2C2725] uppercase tracking-wider">
                    Pesanan Terbaru yang Perlu Diproses
                  </h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#E07A5F] hover:underline"
                  >
                    Buka Tab Pesanan →
                  </button>
                </div>

                <div className="divide-y divide-[#EDE8E1]">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.orderId} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-[#2C2725]">{ord.orderId}</span>
                        <span className="text-[#68625D] ml-2">— {ord.customerName} ({ord.customerPhone})</span>
                        <div className="text-[11px] text-[#68625D] mt-0.5">{ord.deliveryMethod}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#E07A5F]">{formatIDR(ord.total)}</span>
                        <span className="px-2 py-0.5 bg-[#FBE7E3] text-[#E07A5F] text-[10px] font-bold rounded">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT (KELOLA PESANAN & RESI) */}
          {activeTab === 'orders' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE8E1]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                    Kelola Pesanan &amp; Resi Pengiriman
                  </h1>
                  <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                    Verifikasi pembayaran masuk, ubah status pengiriman, dan input nomor resi kurir agar pelanggan dapat melacak di akun mereka.
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {[
                    { label: 'Semua Pesanan', value: 'all' },
                    { label: 'Menunggu Bayar', value: 'Menunggu Pembayaran' },
                    { label: 'Diproses', value: 'Diproses' },
                    { label: 'Dikirim', value: 'Dikirim' },
                    { label: 'Selesai', value: 'Selesai' }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setOrderStatusFilter(tab.value)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        orderStatusFilter === tab.value
                          ? 'bg-[#E07A5F] text-white'
                          : 'bg-[#FFFDF9] border border-[#EDE8E1] text-[#68625D] hover:text-[#2C2725]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68625D]" />
                  <input
                    type="text"
                    placeholder="Cari ID Pesanan / Nama..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {filteredOrdersList.length === 0 ? (
                  <div className="py-12 bg-white border border-[#EDE8E1] rounded-lg text-center p-8 text-xs text-[#68625D]">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </div>
                ) : (
                  filteredOrdersList.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="bg-white border border-[#EDE8E1] rounded-lg p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      {/* Order Card Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE8E1]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-[#2C2725]">
                              Order #{ord.orderId}
                            </span>
                            <span className="text-xs text-[#68625D]">
                              • {new Date(ord.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="text-xs text-[#68625D] mt-0.5">
                            Pembeli: <strong className="text-[#2C2725]">{ord.customerName}</strong> ({ord.customerPhone}) • {ord.customerEmail}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-[#68625D]">Ubah Status:</label>
                          <select
                            value={ord.status || 'Menunggu Pembayaran'}
                            onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:border-[#E07A5F] cursor-pointer"
                          >
                            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Dikirim">Dikirim</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </div>
                      </div>

                      {/* Items Ordered & Total */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs">
                        <div className="md:col-span-7 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#68625D]">
                            Daftar Item ({ord.items?.length || 1} judul):
                          </div>
                          <div className="divide-y divide-[#EDE8E1] border border-[#EDE8E1] rounded-md bg-[#FFFDF9] p-3 max-h-40 overflow-y-auto">
                            {ord.items?.map((item: any, idx: number) => (
                              <div key={idx} className="py-2 flex items-center justify-between">
                                <span className="font-semibold text-[#2C2725] truncate max-w-xs">{item.title}</span>
                                <span className="text-[#68625D]">{item.quantity} × {formatIDR(item.price)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[#68625D] pt-1">
                            Alamat Kirim: <span className="text-[#2C2725]">{ord.deliveryAddress}</span>
                          </div>
                        </div>

                        {/* Right: Resi Input & Courier Form */}
                        <div className="md:col-span-5 bg-[#FAF8F5] border border-[#EDE8E1] p-4 rounded-md space-y-3">
                          <div className="text-xs font-bold text-[#2C2725] flex items-center gap-1.5">
                            <Truck size={15} className="text-[#E07A5F]" />
                            <span>Pengiriman &amp; Nomor Resi</span>
                          </div>

                          <div>
                            <label className="block text-[11px] text-[#68625D] mb-1">Kurir Pengiriman:</label>
                            <input
                              type="text"
                              placeholder="Contoh: JNE Reguler / SiCepat / GoSend"
                              defaultValue={ord.courier || 'JNE Reguler'}
                              onChange={(e) =>
                                setEditingOrderCourier({
                                  ...editingOrderCourier,
                                  [ord.orderId]: e.target.value
                                })
                              }
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#EDE8E1] rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-[#68625D] mb-1">Nomor Resi / AWB:</label>
                            <input
                              type="text"
                              placeholder="Contoh: JNE88291039401ID"
                              defaultValue={ord.shippingTrackingNumber || ''}
                              onChange={(e) =>
                                setEditingOrderResi({
                                  ...editingOrderResi,
                                  [ord.orderId]: e.target.value
                                })
                              }
                              className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-[#EDE8E1] rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="text-xs">
                              <span className="text-[#68625D]">Total: </span>
                              <strong className="text-sm text-[#E07A5F]">{formatIDR(ord.total)}</strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSaveResi(ord.orderId)}
                              className="px-3 py-1.5 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold rounded transition-colors"
                            >
                              Simpan Resi
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE8E1]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                    Katalog Buku &amp; Mainan
                  </h1>
                  <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                    Tambah, edit harga, ubah deskripsi, atau ubah ketersediaan stok buku.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      title: '',
                      author: '',
                      publisher: '',
                      category: 'Picture Books',
                      ageGroup: '3–5 Years',
                      price: 155000,
                      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
                      description: '',
                      inStock: true,
                      badge: 'New',
                      format: 'Hardcover',
                      pages: '32 pages',
                      language: 'English',
                      isbn: '',
                      dimensions: '20 x 20 x 1.2 cm'
                    });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68625D]" />
                  <input
                    type="text"
                    placeholder="Cari judul buku atau penulis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-[#EDE8E1] rounded-md"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Board Books">Board Books</option>
                  <option value="Picture Books">Picture Books</option>
                  <option value="Educational Toys">Educational Toys</option>
                  <option value="Hampers">Hampers</option>
                  <option value="Preloved Item">Preloved Item</option>
                </select>
              </div>

              {/* Product Table */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EDE8E1] text-[10px] uppercase font-bold text-[#68625D]">
                    <tr>
                      <th className="py-3 px-4">Buku / Mainan</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Usia</th>
                      <th className="py-3 px-4">Harga</th>
                      <th className="py-3 px-4">Stok</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE8E1]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.coverImage} alt={p.title} className="w-9 h-12 object-cover rounded border border-[#EDE8E1]" />
                            <div>
                              <div className="font-semibold text-[#2C2725]">{p.title}</div>
                              <div className="text-[11px] text-[#68625D]">{p.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{p.category}</td>
                        <td className="py-3 px-4">{p.ageGroup}</td>
                        <td className="py-3 px-4 font-semibold text-[#2C2725]">{formatIDR(p.price)}</td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                              p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.inStock ? 'Tersedia' : 'Habis'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setFormData({
                                title: p.title,
                                author: p.author,
                                publisher: p.publisher || '',
                                category: p.category as any,
                                ageGroup: p.ageGroup as any,
                                price: p.price,
                                coverImage: p.coverImage,
                                description: p.description,
                                inStock: p.inStock,
                                badge: p.badge || '',
                                format: p.format || 'Hardcover',
                                pages: p.pages || '32 pages',
                                language: p.language || 'English',
                                isbn: p.isbn || '',
                                dimensions: p.dimensions || '20 x 20 x 1.2 cm'
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-[#68625D] hover:text-[#E07A5F]"
                            title="Edit Produk"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-red-600 hover:text-red-800"
                            title="Hapus Produk"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: HERO CAROUSEL */}
          {activeTab === 'hero' && (
            <div className="space-y-6 text-left">
              <div className="pb-4 border-b border-[#EDE8E1]">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                  Kelola Banner Carousel Halaman Utama
                </h1>
                <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                  Tambah slide foto baru, ubah urutan slide, atau hapus slide hero.
                </p>
              </div>

              {/* Add New Slide Form */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-[#2C2725] uppercase tracking-wider">
                  + Tambah Slide Baru
                </h2>
                <form onSubmit={handleAddSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#68625D] font-semibold mb-1">URL Gambar Foto *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newSlideUrl}
                      onChange={(e) => setNewSlideUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#68625D] font-semibold mb-1">Teks Deskripsi / Alt</label>
                    <input
                      type="text"
                      placeholder="Buku cerita dongeng anak di Malang"
                      value={newSlideAlt}
                      onChange={(e) => setNewSlideAlt(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#E07A5F] hover:bg-[#cc654b] text-white rounded-md text-xs font-semibold cursor-pointer"
                    >
                      Tambahkan ke Carousel
                    </button>
                  </div>
                </form>
              </div>

              {/* Slides Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heroSlides.map((slide, idx) => (
                  <div key={slide.id || idx} className="bg-white border border-[#EDE8E1] rounded-lg overflow-hidden shadow-xs">
                    <div className="relative aspect-[16/9] w-full">
                      <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Slide #{idx + 1}
                      </span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between text-xs border-t border-[#EDE8E1]">
                      <span className="text-[#68625D] truncate max-w-xs">{slide.alt}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, 'up')}
                          className="p-1 text-[#68625D] hover:text-[#2C2725] disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === heroSlides.length - 1}
                          onClick={() => handleMoveSlide(idx, 'down')}
                          className="p-1 text-[#68625D] hover:text-[#2C2725] disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-1 text-red-600 hover:text-red-800 ml-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EVENT REGISTRATIONS */}
          {activeTab === 'events' && (
            <div className="space-y-6 text-left">
              <div className="pb-4 border-b border-[#EDE8E1]">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                  Daftar Peserta Workshop &amp; Acara Anak
                </h1>
                <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                  Peserta yang telah mendaftar secara gratis melalui form reservasi online BabyShalls Citraland Malang.
                </p>
              </div>

              <div className="bg-white border border-[#EDE8E1] rounded-lg overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EDE8E1] text-[10px] uppercase font-bold text-[#68625D]">
                    <tr>
                      <th className="py-3 px-4">Nama Orang Tua</th>
                      <th className="py-3 px-4">Kontak (WhatsApp / Email)</th>
                      <th className="py-3 px-4">Workshop</th>
                      <th className="py-3 px-4">Jumlah Anak</th>
                      <th className="py-3 px-4">Status Kehadiran</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE8E1]">
                    {eventRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#2C2725]">{reg.parentName}</td>
                        <td className="py-3 px-4">
                          <div>{reg.phone}</div>
                          <div className="text-[11px] text-[#68625D]">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#2C2725]">{reg.workshopTitle}</td>
                        <td className="py-3 px-4">{reg.childrenCount} Anak ({reg.childrenAge})</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.checkedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {reg.checkedIn ? 'Sudah Check-In' : 'Belum Hadir'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleEventCheckin(reg.id)}
                            className="px-2.5 py-1 bg-[#FFFDF9] border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] rounded text-[11px] font-semibold cursor-pointer"
                          >
                            {reg.checkedIn ? 'Batal Hadir' : 'Verifikasi Hadir'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: BOOK REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-6 text-left">
              <div className="pb-4 border-b border-[#EDE8E1]">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2725]">
                  Permintaan Buku Khusus dari Pembeli
                </h1>
                <p className="text-xs sm:text-sm text-[#68625D] mt-1">
                  Daftar judul buku yang belum ada di katalog dan diajukan oleh orang tua untuk dicarikan impor.
                </p>
              </div>

              <div className="space-y-4">
                {bookRequests.length === 0 ? (
                  <div className="py-12 bg-white border border-[#EDE8E1] rounded-lg text-center p-8 text-xs text-[#68625D]">
                    Belum ada permintaan buku dari pelanggan.
                  </div>
                ) : (
                  bookRequests.map((req, i) => (
                    <div key={req.id || i} className="bg-white border border-[#EDE8E1] rounded-lg p-5 shadow-xs space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E1]">
                        <span className="font-bold text-sm text-[#2C2725]">{req.bookTitle}</span>
                        <span className="text-[10px] font-bold text-[#E07A5F] bg-[#FBE7E3] px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                      </div>
                      <div>Penulis: <span className="font-semibold text-[#2C2725]">{req.author || 'Tidak dicantumkan'}</span></div>
                      {req.notes && (
                        <p className="text-[#68625D] bg-[#FAF8F5] p-2.5 rounded border border-[#EDE8E1] italic">
                          &ldquo;{req.notes}&rdquo;
                        </p>
                      )}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[#68625D] border-t border-[#EDE8E1]">
                        <div>Kontak: <strong className="text-[#2C2725]">{req.contactEmail}</strong> ({req.contactPhone})</div>
                        <span>Status: <strong className="text-emerald-700">{req.status || 'Baru Masuk'}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#EDE8E1] rounded-lg p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E1]">
              <h3 className="font-bold text-base text-[#2C2725]">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Buku / Mainan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#68625D] hover:text-[#2C2725] p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2C2725] mb-1">Judul Buku / Mainan *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C2725] mb-1">Penulis *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2C2725] mb-1">Penerbit</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C2725] mb-1">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                  >
                    <option value="Board Books">Board Books</option>
                    <option value="Picture Books">Picture Books</option>
                    <option value="Educational Toys">Educational Toys</option>
                    <option value="Hampers">Hampers</option>
                    <option value="Preloved Item">Preloved Item</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#2C2725] mb-1">Kelompok Usia *</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                  >
                    <option value="0–2 Years">0–2 Years</option>
                    <option value="3–5 Years">3–5 Years</option>
                    <option value="6+ Years">6+ Years</option>
                    <option value="All Ages">All Ages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C2725] mb-1">Harga (IDR) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C2725] mb-1">URL Cover Buku *</label>
                <input
                  type="url"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C2725] mb-1">Sinopsis &amp; Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:border-[#E07A5F]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#EDE8E1] text-[#2C2725] rounded-md font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E07A5F] hover:bg-[#cc654b] text-white rounded-md font-semibold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
