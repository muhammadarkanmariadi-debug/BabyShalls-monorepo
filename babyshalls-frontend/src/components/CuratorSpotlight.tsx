'use client';

import React from 'react';
import { MessageCircle, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { mockProducts, formatIDR } from '../data/mockProducts';

export const CuratorSpotlight: React.FC = () => {
  const { setQuickViewProduct } = useCart();

  const spotlightBook1 = mockProducts.find((p) => p.id === 'prod-04') || mockProducts[3];
  const spotlightBook2 = mockProducts.find((p) => p.id === 'prod-03') || mockProducts[2];

  return (
    <section className="py-16 md:py-24 bg-[#FAF5EC] border-b border-[#EADBCA] relative" id="kurasi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="library-stamp">
              <span>★</span>
              <span>Rekomendasi Meja Baca Kurator</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3B2820]">
            Buku Pilihan Bulan Ini
          </h2>
          
          <p className="mt-3 text-sm sm:text-base text-[#4A332A]/80 leading-relaxed font-normal">
            Dua buku yang paling sering kami bacakan saat sesi dongeng di butik Citraland Puncak Tidar. Penuh kehangatan dan dialog berharga untuk si kecil.
          </p>

          <div className="font-handwriting text-xl text-[#C86D51] mt-2">
            &ldquo;Dibaca pelan-pelan bersama secangkir susu hangat ☕&rdquo;
          </div>
        </div>

        {/* 2-Column Curated Bookshelf Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Spotlight Book 1 */}
          <div className="paper-card p-6 sm:p-8 flex flex-col justify-between group hover:border-[#C4A482] transition-all">
            
            {/* Hanging Bookmark Ribbon */}
            <div className="bookmark-ribbon"></div>

            <div>
              {/* Badge & Category */}
              <div className="flex items-center justify-between mb-5 pr-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C86D51] bg-[#FFEBDC] px-3 py-1 rounded-full border border-[#EADBCA]">
                  <Award className="w-3.5 h-3.5" />
                  Mahakarya Klasik Modern
                </span>
                
                <span className="text-xs font-bold text-[#5E7D63] bg-[#EBF2EC] px-3 py-1 rounded-full border border-[#DCE6C6]">
                  Usia 6+ Tahun &amp; Orang Tua
                </span>
              </div>

              {/* Book Presentation with 3D Spine */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-6">
                
                {/* 3D Book Cover */}
                <div className="sm:col-span-5 flex justify-center sm:justify-start">
                  <div
                    onClick={() => setQuickViewProduct(spotlightBook1)}
                    className="book-cover-3d aspect-3/4 w-44 sm:w-full rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={spotlightBook1.coverImage}
                      alt={spotlightBook1.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Editorial Content */}
                <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#3B2820] leading-snug">
                      {spotlightBook1.title}
                    </h3>
                    <p className="text-xs text-[#4A332A]/70 mt-1">
                      Karya <strong className="text-[#3B2820]">{spotlightBook1.author}</strong>
                    </p>
                  </div>

                  {/* Handwritten Quote Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#EADBCA] relative">
                    <div className="italic text-sm text-[#4A332A] leading-relaxed">
                      &ldquo;Apa hal paling berani yang pernah kamu ucapkan? tanya sang anak laki-laki. Tolong, jawab sang kuda.&rdquo;
                    </div>
                  </div>

                  <p className="text-xs text-[#4A332A]/85 leading-relaxed">
                    Buku bergambar puitis yang mengajarkan anak bahwa tidak apa-apa jika merasa lelah atau takut. Meminta bantuan adalah tanda keberanian terbesar.
                  </p>

                  <div className="font-handwriting text-base text-[#C86D51]">
                    ~ Kak Maya: &ldquo;Buku wajib untuk disimpan seumur hidup!&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="pt-4 border-t border-[#EADBCA] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#4A332A]/60 block font-semibold uppercase tracking-wider">
                  Harga Katalog:
                </span>
                <span className="text-xl font-bold text-[#C86D51]">
                  {formatIDR(spotlightBook1.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewProduct(spotlightBook1)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#4A332A] bg-[#FFF8EF] hover:bg-[#FFEBDC] border border-[#EADBCA] transition cursor-pointer"
                >
                  Intip Sinopsis &amp; Review
                </button>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Babyshalls,%20saya%20tertarik%20dengan%20buku%20${encodeURIComponent(spotlightBook1.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Tanya WA</span>
                </a>
              </div>
            </div>

          </div>

          {/* Spotlight Book 2 */}
          <div className="paper-card p-6 sm:p-8 flex flex-col justify-between group hover:border-[#C4A482] transition-all">
            
            {/* Hanging Bookmark Ribbon */}
            <div className="bookmark-ribbon" style={{ background: '#5E7D63' }}></div>

            <div>
              {/* Badge & Category */}
              <div className="flex items-center justify-between mb-5 pr-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E7D63] bg-[#EBF2EC] px-3 py-1 rounded-full border border-[#DCE6C6]">
                  <span>🍃</span>
                  Kisah Asli Puncak Tidar Malang
                </span>
                
                <span className="text-xs font-bold text-[#C86D51] bg-[#FFEBDC] px-3 py-1 rounded-full border border-[#EADBCA]">
                  Usia 3–5 Tahun
                </span>
              </div>

              {/* Book Presentation with 3D Spine */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-6">
                
                {/* 3D Book Cover */}
                <div className="sm:col-span-5 flex justify-center sm:justify-start">
                  <div
                    onClick={() => setQuickViewProduct(spotlightBook2)}
                    className="book-cover-3d aspect-3/4 w-44 sm:w-full rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={spotlightBook2.coverImage}
                      alt={spotlightBook2.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Editorial Content */}
                <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#3B2820] leading-snug">
                      {spotlightBook2.title}
                    </h3>
                    <p className="text-xs text-[#4A332A]/70 mt-1">
                      Karya <strong className="text-[#3B2820]">{spotlightBook2.author}</strong>
                    </p>
                  </div>

                  {/* Handwritten Quote Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#EADBCA] relative">
                    <div className="italic text-sm text-[#4A332A] leading-relaxed">
                      &ldquo;Di hutan yang teduh ini, cahaya sekecil apa pun akan menjadi penuntun bagi mereka yang tersesat.&rdquo;
                    </div>
                  </div>

                  <p className="text-xs text-[#4A332A]/85 leading-relaxed">
                    Kisah orisinal tentang kunang-kunang di lereng Puncak Tidar Malang. Membantu anak balita menumbuhkan rasa percaya diri bahwa setiap anak memiliki keistimewaannya sendiri.
                  </p>

                  <div className="font-handwriting text-base text-[#5E7D63]">
                    ~ &ldquo;Ilustrasi cat airnya sangat sejuk khas perbukitan Malang 🎨&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="pt-4 border-t border-[#EADBCA] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#4A332A]/60 block font-semibold uppercase tracking-wider">
                  Harga Katalog:
                </span>
                <span className="text-xl font-bold text-[#C86D51]">
                  {formatIDR(spotlightBook2.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewProduct(spotlightBook2)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#4A332A] bg-[#FFF8EF] hover:bg-[#FFEBDC] border border-[#EADBCA] transition cursor-pointer"
                >
                  Intip Sinopsis &amp; Review
                </button>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Babyshalls,%20saya%20tertarik%20dengan%20buku%20${encodeURIComponent(spotlightBook2.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Tanya WA</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
