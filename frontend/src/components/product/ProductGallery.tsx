'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ShoppingBag,
  Share2,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { AgeBadge } from './AgeBadge';
import { AgeGroup } from '../../types';

interface ProductGalleryProps {
  initialImages: string[];
  title: string;
  category: string;
  ageGroup: AgeGroup;
  discountPercent?: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  initialImages,
  title,
  category,
  ageGroup,
  discountPercent,
}) => {
  const images =
    initialImages && initialImages.length > 0
      ? initialImages
      : ['/images/products/nature-book.svg'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* 1. Main Square Image Viewport (Shopee Style Clean Layout) */}
      <div
        onClick={() => setIsZoomOpen(true)}
        className="group relative w-full aspect-square bg-[#FDFBF7] border border-[#EEDBC9]/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-subtle transition-all cursor-zoom-in flex items-center justify-center p-3"
      >
        {/* Render Image or SVG */}
        {currentImage.endsWith('.svg') ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center bg-[#FFF8EF] rounded-lg">
            <div className="w-20 h-20 rounded-full bg-[#FFE4D0] flex items-center justify-center mb-2 shadow-2xs">
              <ShoppingBag className="w-10 h-10 text-[#DA7A5B]" />
            </div>
            <span className="font-serif text-base font-bold text-[#502E1E] px-4 line-clamp-1">
              {title}
            </span>
            <span className="text-[11px] text-[#8FA87E] font-bold uppercase tracking-wider mt-0.5">
              {category}
            </span>
          </div>
        ) : (
          <img
            src={currentImage}
            alt={`${title} - Foto ${activeIndex + 1}`}
            className="w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-300 ease-out"
          />
        )}

        {/* Overlaid Badges */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <AgeBadge ageGroup={ageGroup} size="sm" />
        </div>

        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded bg-[#DA7A5B] text-white text-[11px] font-black shadow-2xs">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Hover Zoom Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          title="Perbesar Gambar"
          aria-label="Perbesar Gambar"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next Buttons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Foto Berikutnya"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </>
        )}
      </div>

      {/* 2. Shopee-Style Thumbnail Carousel (Thumbnails only, customer browsing) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
        {images.map((img, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                isActive
                  ? 'border-[#DA7A5B] ring-1 ring-[#DA7A5B] scale-102 bg-white'
                  : 'border-[#EEDBC9] bg-[#FFF8EF] opacity-75 hover:opacity-100 hover:border-[#DA7A5B]/70'
              }`}
              aria-label={`Lihat foto ${index + 1}`}
            >
              {img.endsWith('.svg') ? (
                <div className="w-full h-full bg-[#FFE4D0] flex flex-col items-center justify-center p-1 text-center">
                  <ShoppingBag className="w-5 h-5 text-[#DA7A5B]" />
                  <span className="text-[8px] font-bold text-[#502E1E] mt-0.5">Cover</span>
                </div>
              ) : (
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Shopee-Style Footer Actions (Bagikan & Favoritkan) */}
      <div className="flex items-center justify-between text-xs text-[#6B3F2A] pt-2 px-1">
        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A68A78] font-medium">Bagikan:</span>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : ''
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            title="Bagikan ke WhatsApp"
            aria-label="Bagikan ke WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleShare}
            className="px-2.5 py-1 rounded bg-[#FCF6EC] border border-[#EEDBC9] hover:bg-[#FFE4D0] text-[11px] font-bold text-[#6B3F2A] transition-colors flex items-center gap-1"
            title="Salin Tautan"
          >
            <Share2 className="w-3 h-3 text-[#DA7A5B]" />
            <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
        </div>

        {/* Favorite wishlist */}
        <button
          type="button"
          onClick={() => setIsFavorited(!isFavorited)}
          className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#DA7A5B] transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#DA7A5B] text-[#DA7A5B]' : 'text-[#A68A78]'
            }`}
          />
          <span>Favorit ({isFavorited ? 129 : 128})</span>
        </button>
      </div>

      {/* 4. Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200"
          />

          <div className="relative max-w-3xl max-h-[90vh] z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              aria-label="Tutup Zoom"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-xl overflow-hidden bg-white shadow-2xl p-1.5">
              {currentImage.endsWith('.svg') ? (
                <div className="w-[300px] sm:w-[420px] aspect-square flex flex-col items-center justify-center bg-[#FFE4D0] p-6 text-center">
                  <ShoppingBag className="w-16 h-16 text-[#DA7A5B] mb-2" />
                  <span className="font-serif text-xl font-bold text-[#502E1E]">{title}</span>
                  <span className="text-xs text-[#8FA87E] font-bold mt-1">{category}</span>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt={title}
                  className="max-h-[78vh] w-auto object-contain rounded-lg"
                />
              )}
            </div>

            <div className="mt-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
              {activeIndex + 1} dari {images.length} Foto
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
