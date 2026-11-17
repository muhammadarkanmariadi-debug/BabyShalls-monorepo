'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCms } from '@/context/CmsContext';

export const RequestAndVisitSection: React.FC = () => {
  const { cms } = useCms();
  const home = cms.home;
  const store = cms.store;
  const waVisitUrl = `https://wa.me/${store.whatsappNumber || '6281234567890'}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin berkunjung dan konsultasi buku di toko.'
  )}`;

  return (
    <section className="py-16 sm:py-20 bg-white w-full">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Request Buku (Figma #143:1239 - height: 280px) */}
          <div className="flex flex-col sm:flex-row bg-white border border-[#E6D2C0] rounded-[2px] overflow-hidden min-h-[280px]">
            {/* Teks Kiri */}
            <div className="flex-1 p-7 sm:p-8 flex flex-col justify-center space-y-3.5">
              <h3 className="text-[22px] sm:text-[24px] font-medium text-[#4A2A1C] leading-[1.25] whitespace-pre-line">
                {home.requestCardTitle || 'Buku yang kamu\ncari belum ada?'}
              </h3>
              <p className="text-[14px] text-[#7A5644] font-normal leading-[1.5]">
                {home.requestCardSubtitle || 'Tulis judul atau penulisnya, kami bantu carikan dan kabari lewat WhatsApp.'}
              </p>
              <div className="pt-1">
                <Link
                  href="/request-a-book"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] font-medium rounded-[2px] transition-colors shadow-xs"
                >
                  {home.requestCardButtonText || 'Request Buku'}
                </Link>
              </div>
            </div>

            {/* Gambar Maskot Menulis Surat (288x280) */}
            <div className="relative w-full sm:w-[288px] h-[220px] sm:h-auto shrink-0 bg-[#FFF6EA]">
              <Image
                src="/images/prod-storybook.jpg"
                alt="Rak Buku Kurasi BabyShalls Malang"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 288px"
              />
            </div>
          </div>

          {/* Card 2: Kunjungi Toko (Figma #143:1248 - height: 280px) */}
          <div className="flex flex-col sm:flex-row bg-white border border-[#E6D2C0] rounded-[2px] overflow-hidden min-h-[280px]">
            {/* Teks Kiri */}
            <div className="flex-1 p-7 sm:p-8 flex flex-col justify-center space-y-3.5">
              <h3 className="text-[22px] sm:text-[24px] font-medium text-[#4A2A1C] leading-[1.25]">
                {home.storeVisitTitle || 'Kunjungi toko kami'}
              </h3>
              <p className="text-[14px] text-[#7A5644] font-normal leading-[1.5]">
                {home.storeVisitSubtitle || 'Citraland Puncak Tidar HH-26, Malang. Ada area bermain gratis untuk si kecil.'}
              </p>
              <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={store.googleMapsUrl || 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] font-medium rounded-[2px] transition-colors shadow-xs"
                >
                  {home.storeVisitButtonText || 'Petunjuk Arah'}
                </a>
                <a
                  href={waVisitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-[#FFFBF5] text-[#4A2A1C] border border-[#C9B3A5] hover:border-[#B05A26] text-[16px] font-medium rounded-[2px] transition-colors"
                >
                  Chat WhatsApp
                </a>
              </div>
            </div>

            {/* Gambar Toko Tampak Depan (288x280) */}
            <div className="relative w-full sm:w-[288px] h-[220px] sm:h-auto shrink-0 bg-[#FFF6EA]">
              <Image
                src="/images/products/toko-tampak-depan.png"
                alt="Toko BabyShalls Citraland Malang"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 288px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
