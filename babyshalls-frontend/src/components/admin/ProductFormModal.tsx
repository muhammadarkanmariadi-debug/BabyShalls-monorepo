'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Eye,
  Lightbulb,
  Package,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CurrencyInput } from '../ui/CurrencyInput';
import { MultiImageUploader } from './MultiImageUploader';
import {
  AdminProduct,
  AdminProductPayload,
  PrismaAgeGroup,
  useCreateAdminProduct,
  useUpdateAdminProduct,
} from '../../hooks/useAdminDashboard';
import { extractApiError } from '../../lib/axios';
import { formatIDR } from '../../lib/utils';

const STOREFRONT_CATEGORIES = [
  'Board Books',
  'Picture Books',
  'Sound & Sensory',
  'Wooden Toys',
  'Gift Hampers',
  'Early Readers',
  'Preloved Kurasi',
];

const AGE_GROUPS: { label: string; value: PrismaAgeGroup }[] = [
  { label: 'Newborn+ (0-12 bln)', value: 'NEWBORN_PLUS' },
  { label: 'Ages 1-3', value: 'AGES_1_3' },
  { label: 'Ages 3+', value: 'AGES_3_PLUS' },
  { label: 'Ages 6+', value: 'AGES_6_PLUS' },
  { label: 'Semua Usia', value: 'ALL_AGES' },
];

type TabId = 'info' | 'specs' | 'pricing' | 'shipping' | 'visibility';

const TABS: { id: TabId; label: string }[] = [
  { id: 'info', label: 'Informasi Produk' },
  { id: 'specs', label: 'Spesifikasi' },
  { id: 'pricing', label: 'Harga & Stok' },
  { id: 'shipping', label: 'Pengiriman' },
  { id: 'visibility', label: 'Visibilitas' },
];

const TIPS_BY_TAB: Record<TabId, { title: string; body: string }> = {
  info: {
    title: 'Informasi & Foto Produk',
    body: 'Gunakan min. 3 foto dengan pencahayaan natural (sampul depan, isi halaman/detail kayu, dan skala ukuran). Nama 15–100 karakter membantu pencarian di katalog.',
  },
  specs: {
    title: 'Spesifikasi & Keunggulan',
    body: 'Tuliskan Penulis/Brand dan minimal 2 poin keunggulan (mis. material aman EN71, ketebalan board book, manfaat sensorik) agar orang tua yakin sebelum membeli.',
  },
  pricing: {
    title: 'Harga, Diskon & Stok',
    body: 'Isi Harga Coret jika sedang promo agar badge persentase diskon tampil otomatis di kartu Storefront. Pantau preview kartu di bawah untuk cek tampilan.',
  },
  shipping: {
    title: 'Berat Pengiriman (Malang Hub)',
    body: 'Masukkan berat aktual + kemasan bubble wrap/kardus agar estimasi ongkir KiriminAja dari Kota Malang tetap akurat.',
  },
  visibility: {
    title: 'Penempatan di Storefront',
    body: 'Aktifkan Featured di Beranda untuk produk unggulan kurasi bulan ini, dan Best Seller untuk produk favorit pelanggan.',
  },
};

const QUICK_FEATURE_CHIPS = [
  'Halaman board book tebal anti sobek',
  'Cat non-toxic ramah anak (EN71)',
  'Kayu halus bebas serpihan tajam',
  'Melatih motorik halus & sensorik',
  'Cocok untuk kado lahiran / ulang tahun',
  'Ilustrasi hangat penuh warna',
];

const WEIGHT_PRESETS = [
  { label: '250g (Board Book)', value: '250' },
  { label: '500g (Mainan Kayu)', value: '500' },
  { label: '1000g (Hampers)', value: '1000' },
  { label: '1500g (Paket Besar)', value: '1500' },
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: AdminProduct | null;
}

export function ProductFormModal({ isOpen, onClose, editingProduct }: ProductFormModalProps) {
  const createMutation = useCreateAdminProduct();
  const updateMutation = useUpdateAdminProduct();

  const [activeTab, setActiveTab] = useState<TabId>('info');
  const [name, setName] = useState('');
  const [authorOrBrand, setAuthorOrBrand] = useState('');
  const [category, setCategory] = useState('Board Books');
  const [subCategory, setSubCategory] = useState('');
  const [ageGroup, setAgeGroup] = useState<PrismaAgeGroup>('ALL_AGES');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [weight, setWeight] = useState('350');
  const [description, setDescription] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab('info');
    setNewFeatureInput('');
    if (editingProduct) {
      setName(editingProduct.name);
      setAuthorOrBrand(editingProduct.authorOrBrand || '');
      setCategory(editingProduct.category || 'Board Books');
      setSubCategory(editingProduct.subCategory || '');
      setAgeGroup(editingProduct.ageGroup || 'ALL_AGES');
      setPrice(String(editingProduct.price));
      setOriginalPrice(editingProduct.originalPrice ? String(editingProduct.originalPrice) : '');
      setStock(String(editingProduct.stock));
      setWeight(String(editingProduct.weight || 300));
      setDescription(editingProduct.description || '');
      setFeaturesList(
        Array.isArray(editingProduct.features)
          ? editingProduct.features.map((f) => String(f).trim()).filter(Boolean)
          : []
      );
      setImages(Array.isArray(editingProduct.images) ? editingProduct.images : []);
      setIsFeatured(Boolean(editingProduct.isFeatured));
      setIsNewArrival(Boolean(editingProduct.isNewArrival));
      setIsBestSeller(Boolean(editingProduct.isBestSeller));
    } else {
      setName('');
      setAuthorOrBrand('');
      setCategory('Board Books');
      setSubCategory('');
      setAgeGroup('ALL_AGES');
      setPrice('');
      setOriginalPrice('');
      setStock('10');
      setWeight('350');
      setDescription('');
      setFeaturesList([]);
      setImages([]);
      setIsFeatured(false);
      setIsNewArrival(true);
      setIsBestSeller(false);
    }
  }, [editingProduct, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const recommendations = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedBrand = authorOrBrand.trim();
    const numWeight = Number(weight || 0);

    return [
      {
        id: 'photos',
        label: 'Tambah min. 3 foto produk',
        done: images.length >= 3,
        tab: 'info' as TabId,
      },
      {
        id: 'name',
        label: 'Buat nama 15–100 karakter',
        done: trimmedName.length >= 15 && trimmedName.length <= 100,
        tab: 'info' as TabId,
      },
      {
        id: 'desc',
        label: 'Buat deskripsi min. 80 karakter',
        done: trimmedDesc.length >= 80,
        tab: 'info' as TabId,
      },
      {
        id: 'brand',
        label: 'Tambah info Penulis / Brand',
        done: trimmedBrand.length > 0,
        tab: 'specs' as TabId,
      },
      {
        id: 'features',
        label: 'Tambah min. 2 poin keunggulan',
        done: featuresList.length >= 2,
        tab: 'specs' as TabId,
      },
      {
        id: 'weight',
        label: 'Isi berat akurat (≥ 50g)',
        done: Number.isFinite(numWeight) && numWeight >= 50,
        tab: 'shipping' as TabId,
      },
    ];
  }, [images.length, name, description, authorOrBrand, featuresList.length, weight]);

  if (!isOpen) return null;

  const doneCount = recommendations.filter((r) => r.done).length;
  const completionPct = Math.round((doneCount / recommendations.length) * 100);

  const numericPrice = Number(price);
  const numericOriginal = Number(originalPrice);
  const discountPercent =
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    Number.isFinite(numericOriginal) &&
    numericOriginal > numericPrice
      ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
      : 0;

  const addFeature = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (featuresList.includes(trimmed)) {
      toast('Poin keunggulan sudah ada.');
      return;
    }
    setFeaturesList((prev) => [...prev, trimmed]);
    setNewFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const applyDescriptionTemplate = () => {
    if (description.trim().length > 0) {
      toast('Deskripsi sudah terisi. Kosongkan dulu jika ingin memakai template.');
      return;
    }
    setDescription(
      `Produk kurasi BabyShalls Malang yang dirancang untuk menemani waktu bermain & belajar si kecil.\n\nManfaat utama:\n- Menstimulasi rasa ingin tahu, bahasa, dan motorik halus anak.\n- Material aman dan nyaman digenggam anak.`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setActiveTab('info');
      toast.error('Nama produk wajib diisi.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setActiveTab('pricing');
      toast.error('Harga jual produk wajib diisi dengan nominal valid.');
      return;
    }

    const payload: AdminProductPayload = {
      name: name.trim(),
      authorOrBrand: authorOrBrand.trim() || null,
      category,
      subCategory: subCategory.trim() || null,
      ageGroup,
      price: numericPrice,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      stock: Math.max(0, Number(stock || 0)),
      weight: Math.max(1, Number(weight || 300)),
      description: description.trim() || 'Produk kurasi BabyShalls Malang.',
      features: featuresList,
      images: images.length > 0 ? images : ['/images/placeholder-book.jpg'],
      isFeatured,
      isNewArrival,
      isBestSeller,
    };

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, ...payload });
        toast.success(`Produk "${payload.name}" berhasil diperbarui.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`Produk "${payload.name}" berhasil ditambahkan.`);
      }
      onClose();
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menyimpan data produk.'));
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const activeTip = TIPS_BY_TAB[activeTab];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#502E1E]/45 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl h-full bg-[#FFF8EF] shadow-2xl border-l border-[#EBDCCB] flex flex-col text-xs"
      >
        {/* Sticky Top Header */}
        <div className="shrink-0 bg-[#FCF6EC] border-b border-[#EBDCCB] px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#502E1E]">
              {editingProduct ? 'Edit Produk Katalog' : 'Tambah Produk Baru'}
            </h3>
            <p className="text-xs text-[#6B3F2A] mt-0.5">
              Lengkapi rekomendasi kualitas produk agar tampil optimal di Storefront BabyShalls.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup editor produk"
            className="p-2 rounded-xl border border-[#EBDCCB] bg-white text-[#6B3F2A] hover:bg-[#F5E9D9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6" data-lenis-prevent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Sidebar: Shopee-style Rekomendasi + Tips */}
            <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-0">
              <div className="bg-white border border-[#EBDCCB] rounded-2xl overflow-hidden">
                <div className="bg-[#FCF6EC] border-b border-[#EBDCCB] px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#502E1E]">Rekomendasi</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E9F3E4] text-[#1E543B] font-extrabold text-[11px]">
                    {completionPct}%
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="w-full h-2 rounded-full bg-[#FCF6EC] border border-[#EBDCCB] overflow-hidden">
                    <div
                      className="h-full bg-[#1E543B] transition-all duration-300"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {recommendations.map((rec) => (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => setActiveTab(rec.tab)}
                        className="w-full flex items-center gap-2.5 text-left py-1 px-1.5 rounded-lg hover:bg-[#FCF6EC] transition-colors cursor-pointer"
                      >
                        {rec.done ? (
                          <CheckCircle2 className="w-4 h-4 text-[#1E543B] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#D1C4B4] shrink-0" />
                        )}
                        <span
                          className={`text-xs ${
                            rec.done ? 'text-[#1E543B] font-bold' : 'text-[#6B3F2A] font-medium'
                          }`}
                        >
                          {rec.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#EBDCCB] rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#D9744A]">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-wide">Tips</span>
                </div>
                <p className="text-xs font-bold text-[#502E1E]">{activeTip.title}</p>
                <p className="text-[11px] leading-relaxed text-[#6B3F2A]">{activeTip.body}</p>
              </div>
            </aside>

            {/* Right Main Panel: Tabs + Active Section Content */}
            <div className="lg:col-span-8 bg-white border border-[#EBDCCB] rounded-2xl overflow-hidden">
              {/* Tab Bar */}
              <div className="border-b border-[#EBDCCB] bg-[#FCF6EC]/60 px-4 pt-2 flex items-center gap-1 overflow-x-auto">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#D9744A] text-[#D9744A]'
                          : 'border-transparent text-[#6B3F2A] hover:text-[#502E1E]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6 space-y-5">
                {activeTab === 'info' && (
                  <>
                    <MultiImageUploader
                      images={images}
                      onChange={setImages}
                      folder="babyshalls/products"
                      maxImages={6}
                      label="Galeri Foto Produk (Disarankan min. 3 foto)"
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[#502E1E]">Nama Produk *</label>
                        <span className="text-[11px] text-[#6B7280]">{name.length}/100</span>
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Very Hungry Caterpillar Board Book (Edisi Kurasi)"
                        className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Kategori Storefront *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        >
                          {STOREFRONT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Sub-Kategori</label>
                        <input
                          type="text"
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          placeholder="Sensory Book / Balok Kayu"
                          className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Kelompok Usia *</label>
                        <select
                          value={ageGroup}
                          onChange={(e) => setAgeGroup(e.target.value as PrismaAgeGroup)}
                          className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        >
                          {AGE_GROUPS.map((ag) => (
                            <option key={ag.value} value={ag.value}>
                              {ag.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[#502E1E]">Deskripsi Produk *</label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={applyDescriptionTemplate}
                            className="text-[11px] font-bold text-[#D9744A] hover:underline cursor-pointer"
                          >
                            + Pakai Template
                          </button>
                          <span className="text-[11px] text-[#6B7280]">{description.trim().length} karakter</span>
                        </div>
                      </div>
                      <textarea
                        rows={5}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Jelaskan isi buku/mainan, manfaat edukasi, bahan, atau kondisi preloved..."
                        className="w-full p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'specs' && (
                  <>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Penulis / Brand / Penerbit</label>
                      <input
                        type="text"
                        value={authorOrBrand}
                        onChange={(e) => setAuthorOrBrand(e.target.value)}
                        placeholder="Contoh: Eric Carle / Usborne / Melissa & Doug"
                        className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#502E1E]">
                          Keunggulan &amp; Spesifikasi ({featuresList.length} poin)
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFeatureInput}
                          onChange={(e) => setNewFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeature(newFeatureInput);
                            }
                          }}
                          placeholder="Tulis 1 poin keunggulan lalu tekan Enter atau klik Tambah..."
                          className="flex-1 h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                        <button
                          type="button"
                          onClick={() => addFeature(newFeatureInput)}
                          className="h-[40px] px-4 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] hover:bg-[#F5E9D9] font-bold text-[#502E1E] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#D9744A]" /> Tambah
                        </button>
                      </div>

                      {/* Quick Chips */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-[#6B3F2A]">Pilih cepat template BabyShalls:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_FEATURE_CHIPS.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => addFeature(chip)}
                              className="px-2.5 py-1 rounded-full bg-[#FCF6EC] hover:bg-[#FDECE6] border border-[#EBDCCB] text-[11px] font-semibold text-[#502E1E] transition-colors cursor-pointer"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {featuresList.length === 0 ? (
                        <p className="text-xs text-[#6B7280] py-4 text-center border border-dashed border-[#EBDCCB] rounded-xl">
                          Belum ada poin keunggulan. Tambahkan minimal 2 poin untuk melengkapi rekomendasi.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {featuresList.map((feat, idx) => (
                            <div
                              key={`${feat}-${idx}`}
                              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#FCF6EC]/70 border border-[#EBDCCB]"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Tag className="w-3.5 h-3.5 text-[#D9744A] shrink-0" />
                                <span className="font-semibold text-[#502E1E] truncate">{feat}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFeature(idx)}
                                className="p-1 rounded-lg text-[#6B7280] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                aria-label="Hapus poin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'pricing' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Harga Jual (Rp) *</label>
                        <CurrencyInput
                          required
                          value={price}
                          onChange={setPrice}
                          placeholder="125.000"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-[#502E1E]">Harga Coret / Asli (Opsional)</label>
                          {discountPercent > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[11px]">
                              Hemat {discountPercent}%
                            </span>
                          )}
                        </div>
                        <CurrencyInput
                          value={originalPrice}
                          onChange={setOriginalPrice}
                          placeholder="150.000 (kosongkan jika tidak diskon)"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Stok Tersedia (pcs) *</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                        />
                      </div>
                    </div>

                    {/* Live Storefront Card Preview */}
                    <div className="md:col-span-5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#6B3F2A]">
                        <Eye className="w-3.5 h-3.5 text-[#D9744A]" />
                        <span>Preview Kartu Storefront</span>
                      </div>
                      <div className="bg-white border border-[#EBDCCB] rounded-xl overflow-hidden">
                        <div className="relative h-36 bg-[#F8FAFC]">
                          <img
                            src={images[0] || '/images/placeholder-book.jpg'}
                            alt={name || 'Preview Produk'}
                            className="w-full h-full object-cover"
                          />
                          {discountPercent > 0 && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#D9744A] text-white text-[10px] font-extrabold">
                              -{discountPercent}%
                            </span>
                          )}
                          {isBestSeller && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#1E543B] text-white text-[10px] font-extrabold">
                              Best Seller
                            </span>
                          )}
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-[10px] font-bold text-[#6B3F2A]">{category}</p>
                          <p className="text-xs font-extrabold text-[#502E1E] line-clamp-2">
                            {name || 'Nama Produk BabyShalls'}
                          </p>
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-xs font-extrabold text-[#D9744A]">
                              {numericPrice > 0 ? formatIDR(numericPrice) : 'Rp 0'}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-[10px] text-[#6B7280] line-through">
                                {formatIDR(numericOriginal)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Berat Produk + Kemasan (gram) *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-[#6B3F2A]">Preset berat cepat:</p>
                      <div className="flex flex-wrap gap-2">
                        {WEIGHT_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => setWeight(preset.value)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                              weight === preset.value
                                ? 'bg-[#D9744A] text-white border-[#D9744A]'
                                : 'bg-[#FCF6EC] text-[#502E1E] border-[#EBDCCB] hover:bg-[#F5E9D9]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#E9F3E4]/70 border border-[#CBE0C0] flex items-start gap-3">
                      <Truck className="w-5 h-5 text-[#1E543B] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-[#1E543B]">Origin Pengiriman: Kota Malang</p>
                        <p className="text-[11px] text-[#2B5D44]">
                          Semua perhitungan ongkos kirim otomatis KiriminAja menggunakan titik asal Butik BabyShalls
                          (Jl. Cempaka No. 12, Malang).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'visibility' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1">
                      <Sparkles className="w-4 h-4 text-[#D9744A]" />
                      <h4 className="text-sm font-extrabold text-[#502E1E]">Pengaturan Tampilan Storefront</h4>
                    </div>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FCF6EC]/70 border border-[#EBDCCB] cursor-pointer">
                      <div>
                        <p className="font-bold text-[#502E1E]">Tandai New Arrival</p>
                        <p className="text-[11px] text-[#6B7280]">Tampilkan badge &amp; filter produk baru</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#D9744A]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FCF6EC]/70 border border-[#EBDCCB] cursor-pointer">
                      <div>
                        <p className="font-bold text-[#502E1E]">Tandai Best Seller</p>
                        <p className="text-[11px] text-[#6B7280]">Sorot sebagai produk favorit pelanggan</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#D9744A]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FCF6EC]/70 border border-[#EBDCCB] cursor-pointer">
                      <div>
                        <p className="font-bold text-[#502E1E]">Featured di Beranda</p>
                        <p className="text-[11px] text-[#6B7280]">Prioritaskan tampil di halaman utama</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#D9744A]"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="shrink-0 bg-[#FCF6EC] border-t border-[#EBDCCB] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] text-[#6B3F2A]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#EBDCCB] font-bold text-[#502E1E]">
              <Package className="w-3.5 h-3.5 text-[#D9744A]" />
              Rekomendasi: {doneCount}/{recommendations.length}
            </span>
            <span>
              {images.length}/6 foto • Stok: <span className="font-bold">{stock || 0} pcs</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] px-5 rounded-xl border border-[#EBDCCB] bg-white font-bold text-[#6B3F2A] hover:bg-[#F5E9D9] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-[40px] px-6 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-bold cursor-pointer"
            >
              {isPending ? 'Menyimpan...' : editingProduct ? 'Simpan Perubahan' : 'Simpan & Tampilkan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
