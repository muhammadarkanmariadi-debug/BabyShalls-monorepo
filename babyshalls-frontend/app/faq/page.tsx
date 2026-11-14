'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Pemesanan & Pembayaran',
      q: 'Bagaimana cara berbelanja di website BabyShalls?',
      a: 'Anda cukup memilih judul buku atau mainan di halaman Toko, tentukan jumlahnya, lalu klik "Tambah ke Keranjang" atau "Beli Sekarang". Pada halaman checkout, isi data penerima dan pilih metode pembayaran (QRIS Instan atau Transfer Bank BCA/Mandiri). Pesanan Anda akan langsung tercatat dan dapat dipantau di halaman Riwayat Pesanan.'
    },
    {
      category: 'Pemesanan & Pembayaran',
      q: 'Metode pembayaran apa saja yang diterima?',
      a: 'Kami menerima pembayaran melalui QRIS Instan (dapat di-scan dengan mobile banking BCA, Mandiri, BRI, serta e-wallet GoPay, OVO, ShopeePay) dan Transfer Manual ke rekening Bank BCA (816-123-9999 a.n. BabyShalls Official).'
    },
    {
      category: 'Pengiriman & Pickup Toko',
      q: 'Apakah bisa mengambil pesanan langsung di butik Malang?',
      a: 'Tentu saja! Pada saat checkout, pilih opsi "Ambil Sendiri di Toko Citraland Puncak Tidar, Malang" (GRATIS tanpa ongkir). Begitu pesanan Anda siap, Anda dapat langsung datang ke butik kami di Citraland Puncak Tidar Blok HH-26 Malang dengan menunjukkan nomor Invoice / Order ID.'
    },
    {
      category: 'Pengiriman & Pickup Toko',
      q: 'Apakah BabyShalls melayani pengiriman ke luar kota Malang?',
      a: 'Ya, kami melayani pengiriman ke seluruh kota di Indonesia melalui ekspedisi JNE dan SiCepat. Seluruh paket dibungkus dengan kardus tebal khusus dan bubble wrap pelindung ekstra sehingga buku aman dan tidak terlipat selama perjalanan.'
    },
    {
      category: 'Event & Workshop',
      q: 'Apakah sesi Event dan Workshop akhir pekan berbayar?',
      a: 'TIDAK, seluruh sesi dongeng (storytelling) dan workshop anak di BabyShalls Citraland Malang bersifat 100% GRATIS untuk umum. Kami menyelenggarakan ini sebagai wujud komitmen menumbuhkan kecintaan membaca sejak dini. Anda cukup mendaftarkan diri secara online melalui halaman Event & Workshop untuk mendapatkan E-Tiket QR Code.'
    },
    {
      category: 'Kurasi & Preloved',
      q: 'Bagaimana standar kurasi buku Preloved di BabyShalls?',
      a: 'Seluruh buku preloved di BabyShalls merupakan buku pilihan berkategori "Like New" (Seperti Baru) atau "Very Good". Sebelum masuk ke etalase, setiap buku melewati proses sterilisasi sinar UV-C dan disinfeksi higienis dengan cairan organik aman anak tanpa merusak halaman kertas.'
    },
    {
      category: 'Layanan Spesial',
      q: 'Bagaimana jika buku yang saya cari tidak ada di katalog?',
      a: 'Anda dapat menggunakan layanan "Request a Book". Isi judul buku atau pengarang yang Anda cari, dan tim kurator kami akan mengecek ketersediaan stok impor atau membantu memesankannya langsung dari penerbit internasional.'
    },
    {
      category: 'Layanan Spesial',
      q: 'Apakah BabyShalls menyediakan kartu ucapan dan bungkus kado?',
      a: 'Ya, kami menyediakan layanan Gift Packaging estetik dengan kotak kayu pinus atau hardbox pastel, pita linen katun, dan kartu ucapan yang ditulis tangan oleh tim kaligrafi kami.'
    }
  ];

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
            <span className="text-[#2C2725] font-semibold">Pertanyaan Umum (FAQ)</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block">
              Bantuan &amp; Panduan
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2725]">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xs sm:text-sm text-[#68625D]">
              Semua informasi penting seputar pemesanan buku, pengiriman ke rumah, event gratis, dan kunjungan butik di Malang.
            </p>
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white border border-[#EDE8E1] rounded-lg overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F] block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#2C2725] leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-[#68625D] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#E07A5F]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#68625D] leading-relaxed border-t border-[#EDE8E1] animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Need Help Box */}
          <div className="max-w-3xl mx-auto mt-12 p-6 sm:p-8 bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-center space-y-3">
            <h4 className="text-base font-bold text-[#2C2725]">
              Punya Pertanyaan Spesifik Lainnya?
            </h4>
            <p className="text-xs sm:text-sm text-[#68625D] max-w-md mx-auto">
              Tim kurator butik BabyShalls Citraland Malang siap membantu Anda menemukan buku dan kado yang paling pas untuk si kecil.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/request-a-book"
                className="px-5 py-2.5 bg-[#E07A5F] text-white rounded-md text-xs font-semibold hover:bg-[#cc654b] transition-colors"
              >
                Form Request Buku
              </Link>
              <Link
                href="/about"
                className="px-5 py-2.5 bg-white border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] rounded-md text-xs font-semibold transition-colors"
              >
                Kunjungi Butik Malang
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}

