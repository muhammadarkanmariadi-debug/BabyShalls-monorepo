'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Truck,
  Gift,
  ShieldCheck,
  Calendar,
  BookOpen,
  CreditCard,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'shipping' | 'packaging' | 'safety' | 'workshop' | 'jastip' | 'payment';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Pengiriman & Ongkir
  {
    id: 'faq-1',
    category: 'shipping',
    categoryLabel: 'Pengiriman & Ongkir',
    question: 'Dari mana pesanan buku dan mainan BabyShalls dikirim?',
    answer:
      'Seluruh pesanan dikemas dan dikirim langsung dari butik kami di Kota Malang (Jl. Cempaka No. 12, Klojen, Malang, Jawa Timur). Kami menggunakan sistem kurir otomatis terintegrasi KiriminAja (JNE, J&T Express, SiCepat, dan Anteraja) dengan ongkos kirim real-time dan nomor resi otomatis.',
  },
  {
    id: 'faq-2',
    category: 'shipping',
    categoryLabel: 'Pengiriman & Ongkir',
    question: 'Berapa lama estimasi pengiriman paket sampai ke alamat tujuan?',
    answer:
      'Untuk wilayah Malang Raya dapat menggunakan kurir instan / sameday (hitungan jam). Untuk area Jawa Timur lainnya (Surabaya, Sidoarjo, dll.) rata-rata 1–2 hari kerja. Wilayah Jabodetabek dan kota besar Pulau Jawa 2–3 hari kerja. Sedangkan untuk luar Pulau Jawa estimasi 3–5 hari kerja tergantung ekspedisi yang dipilih.',
  },
  {
    id: 'faq-3',
    category: 'shipping',
    categoryLabel: 'Pengiriman & Ongkir',
    question: 'Bagaimana standar pengemasan (packing) paket agar buku tidak terlipat?',
    answer:
      'Setiap buku dan mainan dibungkus kardus tebal khusus pesanan (*corrugated box* berkualitas) serta dilapisi bubble wrap berlapis. Sudut-sudut buku board book dilindungi pelindung sudut (*corner protector*) agar tiba dalam kondisi sempurna tanpa ada lekukan atau benturan.',
  },

  // 2. Kemasan & Free Gift Wrap
  {
    id: 'faq-4',
    category: 'packaging',
    categoryLabel: 'Kemasan Kado & Hampers',
    question: 'Apakah layanan bungkus kado (Free Gift Wrapping) benar-benar gratis?',
    answer:
      'Ya, 100% Gratis tanpa biaya tambahan! Setiap pesanan hadiah untuk kerabat, sepupu, atau rekan kerja dapat meminta bungkus kertas kado bernuansa estetik, pita satin manis, dan kartu ucapan personal yang kami tulis dengan tangan (*handwritten card*). Cukup cantumkan pesan di catatan checkout atau kirimkan via WhatsApp.',
  },
  {
    id: 'faq-5',
    category: 'packaging',
    categoryLabel: 'Kemasan Kado & Hampers',
    question: 'Bisakah paket kado langsung dikirimkan ke alamat si penerima tanpa label harga?',
    answer:
      'Tentu bisa! Kami memiliki opsi "Kirim sebagai Hadiah". Struk harga akan kami simpan secara digital dan tidak disertakan di dalam paket fisik, sehingga penerima kado menerima bingkisan yang rapi, elegan, dan penuh kejutan manis.',
  },

  // 3. Keamanan & Kurasi Produk
  {
    id: 'faq-6',
    category: 'safety',
    categoryLabel: 'Keamanan Mainan & Buku',
    question: 'Apakah mainan kayu BabyShalls aman jika digigit atau dimasukkan ke mulut anak?',
    answer:
      'Sangat aman. Seluruh mainan kayu edukasi kami telah lulus sertifikasi SNI dan EN71 (standar uji keselamatan anak Uni Eropa). Kayu dihaluskan hingga bebas serpihan runcing, serta difinishing dengan cat berbasis air (*water-based non-toxic paint*) yang tidak berbau dan bebas logam berat berbahaya.',
  },
  {
    id: 'faq-7',
    category: 'safety',
    categoryLabel: 'Keamanan Mainan & Buku',
    question: 'Apakah buku board book tahan kunyah dan tidak mudah robek?',
    answer:
      'Betul. Koleksi board book kurasi kami menggunakan kertas karton tebal berlapis dengan tinta kedelai alami (*soy ink*). Bahan ini kokoh, tahan air liur balita yang sedang tumbuh gigi (*teething*), dan mudah dilap bersih dengan kain basah lembut jika terkena tumpahan susu atau makanan.',
  },

  // 4. Workshop & Event Offline
  {
    id: 'faq-8',
    category: 'workshop',
    categoryLabel: 'Workshop & Kegiatan Toko',
    question: 'Apakah orang tua wajib mendampingi anak saat workshop di toko Malang?',
    answer:
      'Untuk kelas balita (usia 1–4 tahun), wajib didampingi minimal satu orang tua/pengasuh demi kenyamanan bonding anak. Untuk kelas anak usia 5 tahun ke atas, orang tua dapat memilih mendampingi di dalam ruangan atau bersantai menikmati teh dan kopi hangat di reading lounge kami.',
  },
  {
    id: 'faq-9',
    category: 'workshop',
    categoryLabel: 'Workshop & Kegiatan Toko',
    question: 'Bagaimana jika si kecil berhalangan hadir atau sakit mendadak pada hari H?',
    answer:
      'Kesehatan si kecil selalu menjadi prioritas utama. Jika berhalangan hadir karena sakit, Ayah & Bunda cukup mengabari admin WhatsApp kami maksimal 24 jam sebelum acara untuk dialihkan ke sesi workshop bulan berikutnya (*reschedule*) tanpa hangus.',
  },

  // 5. Layanan Titip Buku (Jastip)
  {
    id: 'faq-10',
    category: 'jastip',
    categoryLabel: 'Jastip & Request Buku',
    question: 'Bagaimana cara menggunakan layanan Request a Book (Jastip Buku Impor)?',
    answer:
      'Bunda cukup membuka halaman "Request a Book" di website kami, masukkan judul buku atau nama penulis anak yang diinginkan, dan cantumkan nomor WhatsApp. Tim kurator kami akan mencarikan buku asli dari penerbit luar negeri dan mengirimkan penawaran harga beserta estimasi waktu tiba dalam 1x24 jam kerja.',
  },
  {
    id: 'faq-11',
    category: 'jastip',
    categoryLabel: 'Jastip & Request Buku',
    question: 'Berapa lama proses pemesanan buku titip impor sampai tiba?',
    answer:
      'Untuk buku yang tersedia di gudang distributor regional kami butuh waktu 3–7 hari kerja. Jika buku didatangkan langsung dari penerbit UK/US/Australia, proses pengiriman rata-rata 2–3 minggu. Bunda akan selalu menerima pembaruan berkala via WhatsApp.',
  },

  // 6. Pembayaran & Garansi
  {
    id: 'faq-12',
    category: 'payment',
    categoryLabel: 'Pembayaran & Garansi',
    question: 'Metode pembayaran apa saja yang didukung di website BabyShalls?',
    answer:
      'Kami terintegrasi resmi dengan Midtrans Payment Gateway. Anda dapat membayar instan melalui QRIS (GoPay, OVO, ShopeePay, Dana, LinkAja), Virtual Account (BCA, Mandiri, BNI, BRI, Permata), maupun transfer bank konfirmasi langsung via WhatsApp.',
  },
  {
    id: 'faq-13',
    category: 'payment',
    categoryLabel: 'Pembayaran & Garansi',
    question: 'Bagaimana prosedur klaim garansi jika barang cacat atau salah kirim?',
    answer:
      'Kami menerapkan Garansi Kepuasan 100%. Jika barang yang diterima rusak akibat kelalaian ekspedisi atau salah judul buku, kirimkan foto/video unboxing ke WhatsApp Care kami dalam 2x24 jam. Kami akan mengirimkan barang pengganti baru tanpa biaya ongkir tambahan, atau mengembalikan dana 100%.',
  },
  {
    id: 'faq-14',
    category: 'safety',
    categoryLabel: 'Keamanan Mainan & Buku',
    question: 'Bisakah berkunjung dan membaca langsung di toko offline Malang?',
    answer:
      'Tentu sangat boleh dan kami nantikan! Butik BabyShalls di Jl. Cempaka No. 12, Klojen, Malang buka setiap hari pukul 10.00 – 17.00 WIB. Anak-anak bebas mencoba mainan display dan duduk membaca di pojok lesehan kami.',
  },
];

type CategoryFilter = 'ALL' | 'shipping' | 'packaging' | 'safety' | 'workshop' | 'jastip' | 'payment';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-4', 'faq-6']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-[#FFF8EF] min-h-screen py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

        {/* 1. Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#8A6A55]">
          <Link href="/" className="hover:text-[#DA7A5B] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-[#3E2415] font-semibold">Tanya Jawab (FAQ)</span>
        </nav>

        {/* 2. Header & Live Search */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2E0] border border-[#709154]/20 text-[#709154] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#DA7A5B]" />
            <span>Pusat Bantuan & Tanya Jawab</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2415] leading-tight">
            Pertanyaan yang Sering Diajukan
          </h1>

          <p className="text-xs sm:text-sm text-[#6B3F2A]">
            Temukan jawaban lengkap seputar pengiriman dari Kota Malang, keamanan bahan kayu, bungkus kado gratis, hingga pendaftaran workshop si kecil.
          </p>

          {/* Search Input Bar */}
          <div className="pt-3 relative max-w-lg mx-auto">
            <Search className="w-4 h-4 text-[#8FA87E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan (contoh: ongkir, kado, kayu, workshop)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#EEDBC9] text-xs sm:text-sm text-[#3E2415] placeholder-[#A68A78] focus:outline-none focus:border-[#DA7A5B] focus:ring-2 focus:ring-[#DA7A5B]/15 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8A6A55] hover:text-[#DA7A5B]"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* 3. Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto px-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Semua ({FAQ_DATA.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('shipping')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'shipping'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pengiriman</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('packaging')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'packaging'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Kado & Hampers</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('safety')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'safety'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Keamanan & Uji SNI</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('workshop')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'workshop'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Workshop</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('jastip')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'jastip'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Titip Buku</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('payment')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'payment'
                ? 'bg-[#DA7A5B] text-white shadow-xs'
                : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pembayaran</span>
          </button>
        </div>

        {/* 4. Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#EEDBC9] overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FFFDF9] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#709154] tracking-wider block">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#3E2415]">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-[#FCF6EC] text-[#DA7A5B] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#FFE4D0]' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6B3F2A] leading-relaxed border-t border-[#F4E8DC] animate-in fade-in-0 duration-150">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#EEDBC9] p-6 space-y-3">
              <HelpCircle className="w-10 h-10 text-[#A68A78] mx-auto opacity-70" />
              <p className="text-xs sm:text-sm font-semibold text-[#502E1E]">
                Tidak ditemukan pertanyaan untuk kata kunci "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="text-xs font-bold text-[#DA7A5B] hover:underline"
              >
                Reset Filter Pencarian
              </button>
            </div>
          )}
        </div>

        {/* 5. Direct Helpdesk WhatsApp Callout */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF3E8] to-[#EBF2E0] border border-[#EEDBC9] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA7A5B]">
              Masih Punya Pertanyaan Lain?
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3E2415]">
              Kami Siap Membantu Ayah & Bunda
            </h3>
            <p className="text-xs text-[#6B3F2A]">
              Tim kurator BabyShalls di Malang dengan senang hati berdiskusi tentang rekomendasi buku atau keperluan pesanan Anda.
            </p>
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo%20BabyShalls,%20saya%20ada%20pertanyaan%20seputar%20produk%20dan%20layanan."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex-shrink-0 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat CS di WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}

