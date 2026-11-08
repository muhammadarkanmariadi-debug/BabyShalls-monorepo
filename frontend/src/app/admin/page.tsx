'use client';

import React, { useState } from 'react';
import { Package, TrendingUp, Users, BookmarkCheck, Edit3, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { formatIDR, formatWeight } from '../../lib/utils';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'cms'>('overview');
  
  // Semi-CMS State
  const [topBannerText, setTopBannerText] = useState('Gratis Gift Wrapping Cantik & Kartu Ucapan untuk setiap pembelian Hampers!');
  const [heroHeadline, setHeroHeadline] = useState('Menumbuhkan Cinta Membaca Sejak Hari Pertama.');
  const [cmsSaved, setCmsSaved] = useState(false);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 2000);
  };

  return (
    <div className="py-10 lg:py-14 bg-[#FFF8EF]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EEDBC9]">
          <div>
            <span className="text-xs font-bold text-[#DA7A5B] uppercase tracking-wider block">
              Portal Operasional BabyShalls Malang
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#502E1E]">
              Admin Dashboard & Semi-CMS
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#EBF2E0] text-[#709154] text-xs font-bold">
              Role: ADMIN Toko
            </span>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex items-center gap-2 border-b border-[#EEDBC9] pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FCF6EC] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Ringkasan (Rekap)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FCF6EC] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Pesanan & KiriminAja
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FCF6EC] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Katalog Produk ({PRODUCTS.length})
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'cms'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FCF6EC] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Semi-CMS (Ubah Teks Beranda)
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[22px] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#DA7A5B] mb-2">
                  <span className="text-xs font-bold text-[#8FA87E]">Total Omzet Toko</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#502E1E]">Rp18.420.000</div>
                <span className="text-[11px] text-[#709154] font-semibold mt-1 block">
                  +14% dibanding bulan lalu
                </span>
              </div>

              <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[22px] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#DA7A5B] mb-2">
                  <span className="text-xs font-bold text-[#8FA87E]">Pesanan Baru</span>
                  <Package className="w-5 h-5" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#502E1E]">42 Pesanan</div>
                <span className="text-[11px] text-[#8FA87E] block mt-1">
                  Semua terbayar otomatis via Midtrans
                </span>
              </div>

              <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[22px] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#709154] mb-2">
                  <span className="text-xs font-bold text-[#8FA87E]">Pendaftar Workshop</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#502E1E]">21 Peserta</div>
                <span className="text-[11px] text-[#709154] font-semibold mt-1 block">
                  2 Sesi Workshop di Malang
                </span>
              </div>

              <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[22px] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#F6C95E] mb-2">
                  <span className="text-xs font-bold text-[#8FA87E]">Book Request (Jastip)</span>
                  <BookmarkCheck className="w-5 h-5 text-[#DA7A5B]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#502E1E]">8 Judul Buku</div>
                <span className="text-[11px] text-[#DA7A5B] font-semibold mt-1 block">
                  3 Judul sudah difollow-up WA
                </span>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="p-6 rounded-[24px] bg-[#FCF6EC] border border-[#EEDBC9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#502E1E]">Request Pickup Kurir KiriminAja Hari Ini</h3>
                <p className="text-xs text-[#8FA87E]">Ada 3 paket pesanan buku anak yang siap diambil kurir di toko Malang.</p>
              </div>
              <button className="px-5 py-2.5 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs shadow-subtle whitespace-nowrap">
                Panggil Pickup KiriminAja
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs overflow-x-auto">
            <h3 className="font-serif text-lg font-bold text-[#502E1E] mb-4">Manajemen Pesanan Masuk</h3>
            <table className="w-full text-left text-xs text-[#6B3F2A]">
              <thead>
                <tr className="border-b border-[#EEDBC9] text-[#8FA87E]">
                  <th className="pb-3 font-bold">No Order</th>
                  <th className="pb-3 font-bold">Pelanggan</th>
                  <th className="pb-3 font-bold">Item & Berat</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Status Bayar</th>
                  <th className="pb-3 font-bold">Aksi Kurir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEDBC9]">
                <tr>
                  <td className="py-3 font-bold text-[#502E1E]">BS-20261108-001</td>
                  <td className="py-3">Bunda Amanda (081234567890)<br/><span className="text-[#8FA87E]">Klojen, Malang</span></td>
                  <td className="py-3">Look and Grow: Nature + Rainbow Stacker<br/><span className="text-[#8FA87E]">1.130 gram</span></td>
                  <td className="py-3 font-bold text-[#DA7A5B]">{formatIDR(442500)}</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-[#EBF2E0] text-[#709154] font-bold">MIDTRANS LUNAS</span></td>
                  <td className="py-3">
                    <button className="px-3 py-1 bg-[#FFE4D0] hover:bg-[#F6B79B] text-[#502E1E] font-bold rounded-lg text-[11px]">
                      Cetak Resi J&T
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-[#502E1E]">Daftar Katalog Produk BabyShalls</h3>
              <button className="px-4 py-2 bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs rounded-full shadow-subtle">
                + Tambah Produk Baru
              </button>
            </div>
            <table className="w-full text-left text-xs text-[#6B3F2A]">
              <thead>
                <tr className="border-b border-[#EEDBC9] text-[#8FA87E]">
                  <th className="pb-3 font-bold">Judul Produk</th>
                  <th className="pb-3 font-bold">Usia</th>
                  <th className="pb-3 font-bold">Kategori</th>
                  <th className="pb-3 font-bold">Berat</th>
                  <th className="pb-3 font-bold">Harga</th>
                  <th className="pb-3 font-bold">Stok</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEDBC9]">
                {PRODUCTS.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 font-bold text-[#502E1E]">{p.title}</td>
                    <td className="py-3">{p.ageGroup}</td>
                    <td className="py-3">{p.category}</td>
                    <td className="py-3">{formatWeight(p.weightInGrams)}</td>
                    <td className="py-3 font-bold text-[#DA7A5B]">{formatIDR(p.price)}</td>
                    <td className="py-3">{p.stock} pcs</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#EBF2E0] text-[#709154] font-bold">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Semi-CMS Tab */}
        {activeTab === 'cms' && (
          <div className="bg-[#FFF9F0] border-2 border-[#EEDBC9] rounded-[28px] p-6 sm:p-8 shadow-card max-w-2xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EEDBC9]">
              <Edit3 className="w-5 h-5 text-[#DA7A5B]" />
              <h3 className="font-serif text-xl font-bold text-[#502E1E]">Semi-CMS: Pengaturan Banner & Teks Beranda</h3>
            </div>
            <p className="text-xs text-[#8FA87E] mb-6">
              Ubah teks banner promosi atas atau slogan headline beranda tanpa perlu menyentuh baris kode program.
            </p>

            <form onSubmit={handleSaveCMS} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#502E1E] mb-1">
                  Teks Announcement Bar Paling Atas (Kuning):
                </label>
                <input
                  type="text"
                  value={topBannerText}
                  onChange={(e) => setTopBannerText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#502E1E] mb-1">
                  Slogan Utama Hero Beranda:
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                />
              </div>

              {cmsSaved && (
                <div className="p-3 bg-[#EBF2E0] text-[#709154] text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Teks beranda berhasil disimpan dan langsung aktif!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs shadow-subtle transition-all"
              >
                Simpan Perubahan Teks
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

