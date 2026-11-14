'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gift,
  Check,
  Sparkles,
  ArrowRight,
  Package,
  Heart,
  Store,
  Truck
} from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';
import { useCart } from '../../src/context/CartContext';
import { formatIDR } from '../../src/data/mockProducts';

export default function HampersPage() {
  const { addToCart, setIsCartOpen } = useCart();

  // Hamper Builder State
  const [boxType, setBoxType] = useState('pinus');
  const [theme, setTheme] = useState('newborn');
  const [bookCount, setBookCount] = useState(3);
  const [includeToy, setIncludeToy] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [customCardMessage, setCustomCardMessage] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const boxOptions = [
    {
      id: 'pinus',
      title: 'Kotak Kayu Pinus Alami',
      desc: 'Kotak kayu pinus estetik dengan tutup geser akrilik bening, diikat pita linen katun alami.',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'hardcover',
      title: 'Hardbox Pastel Keepsake',
      desc: 'Kotak kaku kokoh warna pastel sage/peach dengan emboss emas, dapat dijadikan wadah memori bayi.',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'rotan',
      title: 'Keranjang Anyaman Rotan',
      desc: 'Keranjang rotan handmade pengrajin lokal dengan kain pelapis linen lembut, multifungsi di kamar bayi.',
      price: 145000,
      image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const selectedBox = boxOptions.find((b) => b.id === boxType) || boxOptions[0];
  const bookEstimate = bookCount * 145000;
  const toyEstimate = includeToy ? 125000 : 0;
  const estimatedTotal = selectedBox.price + bookEstimate + toyEstimate;

  const handleAddHamperToBag = () => {
    const hamperProduct: any = {
      id: `hamper-${Date.now()}`,
      title: `Custom Gift Hamper (${selectedBox.title})`,
      author: 'Kurasi Khusus Butik BabyShalls',
      price: estimatedTotal,
      coverImage: selectedBox.image,
      category: 'Hampers',
      ageGroup: theme === 'newborn' ? '0–1 Years' : '1–3 Years',
      inStock: true,
      description: `Paket kado hampers kustom: ${selectedBox.title}, ${bookCount} buku cerita pilihan, ${includeToy ? 'termasuk mainan Montessori kayu' : 'hanya buku'}. Untuk ${recipientName || 'Buah Hati'} dari ${senderName || 'Keluarga'}.`
    };

    addToCart(hamperProduct, 1);
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      setIsCartOpen(true);
    }, 800);
  };

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
            <span className="text-[#2C2725] font-semibold">Custom Gift Hampers</span>
          </nav>

          {/* Editorial Banner */}
          <div className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg p-6 sm:p-10 mb-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block">
                Bespoke Gifting Service
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2725] leading-tight">
                Buat Paket Hampers Kado Spesial Bayi &amp; Anak
              </h1>
              <p className="text-xs sm:text-sm text-[#68625D] leading-relaxed">
                Hadiah bermakna untuk menyambut kelahiran buah hati sahabat, perayaan ulang tahun pertama, atau hampers hari raya. Pilih kotak estetik, jumlah buku cerita kurasi kurator kami, serta mainan kayu alami dengan kartu ucapan bertuliskan pesan hangat.
              </p>
            </div>
          </div>

          {/* Hamper Builder Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left 7 Columns: Interactive Options */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Step 1: Pilih Jenis Kotak / Kemasan */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                  <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-[#2C2725]">Pilih Wadah &amp; Kotak Hampers</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {boxOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setBoxType(opt.id)}
                      className={`p-3.5 border rounded-md cursor-pointer transition-all flex flex-col justify-between ${
                        boxType === opt.id
                          ? 'border-[#E07A5F] bg-[#FBE7E3]/30 ring-1 ring-[#E07A5F]'
                          : 'border-[#EDE8E1] hover:border-[#E07A5F] bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="aspect-[4/3] rounded-sm overflow-hidden bg-neutral-100 border border-[#EDE8E1]">
                          <img src={opt.image} alt={opt.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xs font-bold text-[#2C2725] leading-snug">{opt.title}</h3>
                        <p className="text-[11px] text-[#68625D] leading-tight line-clamp-2">{opt.desc}</p>
                      </div>
                      <div className="pt-2 text-xs font-bold text-[#E07A5F]">
                        {formatIDR(opt.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Tema & Kombinasi Isi */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                  <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-[#2C2725]">Tema &amp; Kombinasi Buku</h2>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2725] mb-2">
                      Fase Usia / Momen Penerima:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'newborn', label: 'Newborn (0–1 Th)' },
                        { id: 'toddler', label: 'Toddler (1–3 Th)' },
                        { id: 'preschool', label: 'Balita (3–5 Th)' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTheme(t.id)}
                          className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors border cursor-pointer ${
                            theme === t.id
                              ? 'bg-[#E07A5F] text-white border-[#E07A5F]'
                              : 'bg-white border-[#EDE8E1] text-[#68625D] hover:border-[#E07A5F]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jumlah Buku */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2725] mb-2">
                      Jumlah Buku Cerita / Board Book Impor:
                    </label>
                    <div className="flex items-center gap-3">
                      {[2, 3, 4, 5].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setBookCount(count)}
                          className={`w-12 h-10 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                            bookCount === count
                              ? 'bg-[#E2ECE0] text-[#3A5C37] border-[#C7DAC3]'
                              : 'bg-white border-[#EDE8E1] text-[#68625D] hover:border-[#3A5C37]'
                          }`}
                        >
                          {count} Buku
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tambahan Mainan Montessori */}
                  <label className="flex items-center gap-2.5 pt-2 text-xs font-semibold text-[#2C2725] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeToy}
                      onChange={(e) => setIncludeToy(e.target.checked)}
                      className="rounded border-[#EDE8E1] text-[#E07A5F] focus:ring-0 accent-[#E07A5F] cursor-pointer"
                    />
                    <span>Sertakan 1 Mainan Kayu Montessori Alami (+Rp 125.000)</span>
                  </label>
                </div>
              </div>

              {/* Step 3: Kartu Ucapan Kaligrafi */}
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EDE8E1]">
                  <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-[#2C2725]">Kartu Ucapan Tulisan Tangan</h2>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                        Nama Penerima / Si Kecil
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Baby Arka &amp; Mama"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                        Dari (Pengirim)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Tante Dina &amp; Om Randy"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C2725] mb-1">
                      Pesan Ucapan Hangat
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Selamat datang ke dunia, Baby Arka! Semoga tumbuh menjadi anak yang sehat, bahagia, dan gemar membaca..."
                      value={customCardMessage}
                      onChange={(e) => setCustomCardMessage(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Summary & Add to Cart */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 text-left">
              <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-base font-bold text-[#2C2725] pb-3 border-b border-[#EDE8E1] flex items-center gap-2">
                  <Gift size={18} className="text-[#E07A5F]" />
                  <span>Estimasi Paket Hampers</span>
                </h2>

                <div className="aspect-[4/3] rounded-md overflow-hidden bg-neutral-100 border border-[#EDE8E1]">
                  <img src={selectedBox.image} alt={selectedBox.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2 text-xs text-[#68625D]">
                  <div className="flex justify-between">
                    <span>{selectedBox.title}</span>
                    <span className="font-semibold text-[#2C2725]">{formatIDR(selectedBox.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{bookCount} Judul Buku Cerita Kurasi</span>
                    <span className="font-semibold text-[#2C2725]">{formatIDR(bookEstimate)}</span>
                  </div>
                  {includeToy && (
                    <div className="flex justify-between">
                      <span>1 Mainan Kayu Montessori</span>
                      <span className="font-semibold text-[#2C2725]">{formatIDR(toyEstimate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Pita Linen &amp; Kartu Ucapan Tangan</span>
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">GRATIS</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#2C2725] pt-3 border-t border-[#EDE8E1]">
                    <span>Estimasi Total</span>
                    <span className="text-[#E07A5F]">{formatIDR(estimatedTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddHamperToBag}
                  className="w-full py-4 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {isOrdered ? (
                    <>
                      <Check size={16} strokeWidth={2} />
                      <span>Dimasukkan ke Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <Package size={16} />
                      <span>Pesan &amp; Masukkan Keranjang</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-[11px] text-[#68625D] space-y-1.5 border-t border-[#EDE8E1]">
                  <p className="flex items-center gap-1.5">
                    <Store size={13} className="text-[#E07A5F]" />
                    <span>Bisa diambil langsung di butik Citraland Malang</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Truck size={13} className="text-[#E07A5F]" />
                    <span>Atau dikirim langsung ke alamat keluarga penerima</span>
                  </p>
                </div>
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

