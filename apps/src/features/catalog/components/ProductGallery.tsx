'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Store, X, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  title: string;
  galleryImages: string[];
  selectedImage: string;
  onSelectImage: (img: string) => void;
  discountPercent?: number;
  isOutOfStock: boolean;
  isPreloved: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  title,
  galleryImages,
  selectedImage,
  onSelectImage,
  discountPercent,
  isOutOfStock,
  isPreloved,
}) => {
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);

  useEffect(() => {
    if (!isImageZoomOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsImageZoomOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isImageZoomOpen]);

  const activeSrc = selectedImage || galleryImages[0] || '/images/prod-boardbook.jpg';
  const hasDiscount = Boolean(discountPercent && discountPercent > 0);

  return (
    <div className="w-full lg:w-[580px] shrink-0">
      <button
        type="button"
        onClick={() => setIsImageZoomOpen(true)}
        aria-label="Perbesar gambar produk"
        className="relative aspect-square w-full rounded-[2px] overflow-hidden bg-[#F0F0F0] mb-4 block cursor-zoom-in group"
      >
        <Image
          src={activeSrc}
          alt={title}
          fill
          priority
          className="object-cover object-center transition-transform duration-300 group-hover:scale-103"
          sizes="(max-width: 1024px) 100vw, 580px"
        />
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#C0392B] text-white text-xs font-semibold px-2.5 py-1 rounded-[2px]">
              -{discountPercent}%
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="w-24 h-24 rounded-full bg-black/65 text-white text-base font-medium flex items-center justify-center shadow-sm">
              Habis
            </span>
          </div>
        )}
        <span className="absolute bottom-3 right-3 z-10 bg-black/55 text-white text-[11px] px-2.5 py-1.5 rounded-[2px] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Perbesar</span>
        </span>
      </button>

      {/* Thumbnail Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectImage(img)}
            className={`relative w-20 h-20 rounded-[2px] overflow-hidden bg-[#F0F0F0] shrink-0 border-2 transition-all cursor-pointer ${
              selectedImage === img
                ? 'border-[#B05A26] opacity-100'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${title} view ${idx + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {isPreloved && (
        <div className="mt-4 p-3 bg-[#FFFBF7] border border-[#E6D2C0] rounded-[2px] text-xs text-[#7A5644] flex items-center gap-2">
          <Store className="w-4 h-4 text-[#B05A26] shrink-0" />
          <span>
            <strong>Foto Asli Buku Preloved:</strong> Buku ini adalah koleksi preloved yang telah lolos kurasi kebersihan dan kelayakan baca tim BabyShalls.
          </span>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {isImageZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setIsImageZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau gambar produk"
        >
          <button
            type="button"
            onClick={() => setIsImageZoomOpen(false)}
            aria-label="Tutup pratinjau gambar"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = galleryImages.indexOf(selectedImage);
                  const prevIdx = (idx - 1 + galleryImages.length) % galleryImages.length;
                  onSelectImage(galleryImages[prevIdx]);
                }}
                aria-label="Gambar sebelumnya"
                className="absolute left-3 sm:left-6 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = galleryImages.indexOf(selectedImage);
                  const nextIdx = (idx + 1) % galleryImages.length;
                  onSelectImage(galleryImages[nextIdx]);
                }}
                aria-label="Gambar berikutnya"
                className="absolute right-3 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeSrc}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
};

