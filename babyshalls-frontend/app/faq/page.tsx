'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';
import { CampaignBanner } from '@/components/home/CampaignBanner';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Pemesanan & Pembayaran',
      q: 'Bagaimana cara berbelanja di website BabyShalls?',
      a: 'Pilih buku atau mainan yang kamu inginkan di menu Shop/Katalog, tentukan jumlahnya, lalu klik "+ Tambah ke Keranjang" atau "Beli Sekarang". Pada halaman checkout, isi alamat tujuan pengiriman dan pilih metode pembayaran (QRIS Instan atau Transfer Bank). Pembayaran terkonfirmasi otomatis dan pesanan langsung diproses tim kurator di Malang.',
    },
    {
      category: 'Pemesanan & Pembayaran',
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami mendukung pembayaran instan via QRIS (dapat di-scan dengan GoPay, OVO, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, dll.) serta Virtual Account Bank BCA, Mandiri, dan Kartu Kredit/Debit melalui Midtrans Payment Gateway.',
    },
    {
      category: 'Pengiriman & Ambil di Toko',
      q: 'Apakah pesanan bisa diambil langsung di toko fisik Malang?',
      a: 'Bisa banget! Pada langkah checkout bagian pengiriman, pilih opsi "Ambil Sendiri di Toko (Self Pick-up)" (GRATIS tanpa ongkir). Pesanan akan disiapkan dalam 1 jam dan bisa langsung diambil di Butik BabyShalls Citraland Puncak Tidar Blok HH-26, Kota Malang.',
    },
    {
      category: 'Pengiriman & Ambil di Toko',
      q: 'Berapa lama estimasi pengiriman pesanan ke luar kota?',
      a: 'Pengiriman reguler via JNE, J&T, dan SiCepat membutuhkan waktu 1–3 hari kerja untuk area Jawa Timur, dan 2–4 hari kerja untuk luar pulau Jawa. Seluruh buku dibungkus dengan kardus tebal dan bubble wrap berlapis untuk memastikan tiba dalam kondisi mulus.',
    },
    {
      category: 'Event & Workshop Gratis',
      q: 'Apakah sesi Event dan Workshop akhir pekan berbayar?',
      a: 'TIDAK SAMA SEKALI. Seluruh sesi mendongeng (Story Time) dan workshop kreasi sensorik di butik BabyShalls Citraland Malang bersifat 100% GRATIS untuk umum. Cukup daftarkan diri di halaman Event & Workshop untuk mendapatkan e-tiket QR pendaftaran.',
    },
    {
      category: 'Kurasi & Buku Preloved',
      q: 'Bagaimana standar kelayakan buku Preloved di BabyShalls?',
      a: 'Seluruh koleksi preloved BabyShalls telah melalui inspeksi ketat: halaman lengkap tanpa coretan merusak, jilid kokoh, serta disterilisasi dengan sinar UV-C dan pembersih organik khusus yang aman bagi balita.',
    },
    {
      category: 'Layanan Request Buku',
      q: 'Bagaimana jika buku impor yang saya cari belum ada di katalog?',
      a: 'Kamu bisa memanfaatkan fitur "Request Buku". Tulis judul buku atau unggah foto cover, dan tim kurator BabyShalls akan mencarikan dari jaringan penerbit serta distributor luar negeri dengan penawaran harga terbaik.',
    },
    {
      category: 'Kado & Hampers',
      q: 'Apakah bisa request bungkus kado dan kartu ucapan?',
      a: 'Tentu saja! Kami menyediakan bungkus kado spesial BabyShalls dan kartu ucapan gratis pada setiap pembelian di halaman checkout. Cukup aktifkan toggle "Bungkus Kado" dan tuliskan pesanmu.',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

      {/* Hero Header */}
      <section className="bg-[#FFF6EA] py-12 sm:py-16 border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26] block mb-2">
            PUSAT BANTUAN
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4A2A1C] tracking-tight mb-4">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p className="text-sm sm:text-base text-[#7A5644] max-w-xl mx-auto leading-relaxed">
            Temukan jawaban cepat seputar pemesanan buku, pengiriman kurir, workshop gratis anak di Malang, dan layanan kurasi BabyShalls.
          </p>
        </div>
      </section>

      {/* Main FAQ Accordion */}
      <section className="py-12 sm:py-16 bg-[#FFFDF9]">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8">
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FFFBF7] transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-[#B05A26] uppercase tracking-wider block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-[#4A2A1C]">
                        {faq.q}
                      </h3>
                    </div>

                    <div className="p-1 rounded-full text-[#7A5644] shrink-0 mt-1">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#B05A26]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#7A5644] leading-relaxed border-t border-[#F9EAE1]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need More Help Box */}
          <div className="mt-12 p-6 sm:p-8 bg-[#FFF6EA] border border-[#F2E4D6] rounded-[2px] text-center flex flex-col items-center">
            <HelpCircle className="w-8 h-8 text-[#B05A26] mb-2" />
            <h3 className="text-lg font-medium text-[#4A2A1C] mb-1">
              Masih Ada Pertanyaan Lain?
            </h3>
            <p className="text-xs sm:text-sm text-[#7A5644] max-w-md mb-6 leading-relaxed">
              Tim kurator dan customer support BabyShalls siap membantumu via WhatsApp setiap hari pukul 09.00 – 19.00 WIB.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20BabyShalls,%20saya%20ingin%20bertanya%20seputar%20layanan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#964B1F] transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Tim Kami di WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      <CampaignBanner />
      <Footer />
    </div>
  );
}
