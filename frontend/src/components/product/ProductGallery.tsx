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
      : ['/images/prod-boardbook.jpg'];

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
      {/* Main Viewport */}
      <div
        onClick={() => setIsZoomOpen(true)}
        className="group relative w-full aspect-square bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden cursor-zoom-in flex items-center justify-center"
      >
        {currentImage.endsWith('.svg') ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center bg-[#FAF4E8]">
            <ShoppingBag className="w-12 h-12 text-[#1E543B] mb-2" />
            <span className="text-base font-bold text-[#1A1A1A] px-4 line-clamp-1">
              {title}
            </span>
            <span className="text-xs text-[#6B7280] mt-0.5">{category}</span>
          </div>
        ) : (
          <img
            src={currentImage}
            alt={`${title} - Foto ${activeIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <AgeBadge ageGroup={ageGroup} size="sm" />
        </div>

        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#F5B7A1] text-[#1A1A1A] text-xs font-extrabold">
              -{discountPercent}%
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center border border-[#E5E7EB] hover:bg-white transition-colors"
          aria-label="Perbesar gambar"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center border border-[#E5E7EB] opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center border border-[#E5E7EB] opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                activeIndex === idx
                  ? 'border-[#1A1A1A]'
                  : 'border-[#E5E7EB] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${title} thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Share & Favorite */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-xs">
        <button
          type="button"
          onClick={() => setIsFavorited((v) => !v)}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full hover:bg-[#F8FAFC] text-[#4A4A4A] font-semibold transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#F5B7A1] text-[#1A1A1A]' : ''}`} />
          <span>{isFavorited ? 'Tersimpan di Favorit' : 'Simpan Favorit'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full hover:bg-[#F8FAFC] text-[#4A4A4A] font-semibold transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedLink ? 'Tautan Disalin!' : 'Bagikan'}</span>
        </button>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center"
            aria-label="Tutup zoom"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={currentImage}
            alt={title}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
