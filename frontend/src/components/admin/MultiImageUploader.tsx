'use client';

import React, { useState } from 'react';
import { ImagePlus, Link2, Star, Trash2 } from 'lucide-react';
import { CloudinaryUploadButton } from '../ui/CloudinaryUploadButton';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (nextImages: string[]) => void;
  folder?: string;
  maxImages?: number;
  label?: string;
}

function normalizeImageUrl(raw: string): string {
  const clean = raw.trim();
  if (!clean) return '';
  // Convert Google Drive share URLs to direct renderable image URLs
  const fileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }
  const openMatch = clean.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/);
  if (openMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }
  return clean;
}

export function MultiImageUploader({
  images,
  onChange,
  folder = 'babyshalls/products',
  maxImages = 6,
  label = 'Gambar',
}: MultiImageUploaderProps) {
  const [manualUrl, setManualUrl] = useState('');

  const handleAddUrl = (url: string) => {
    const clean = normalizeImageUrl(url);
    if (!clean) return;
    if (images.includes(clean)) return;
    if (maxImages === 1) {
      onChange([clean]);
    } else if (images.length < maxImages) {
      onChange([...images, clean]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    onChange([selected, ...images.filter((_, idx) => idx !== index)]);
  };

  const canAddMore = maxImages === 1 || images.length < maxImages;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#502E1E]">
          {label} ({images.length}/{maxImages})
        </span>
        {canAddMore && (
          <CloudinaryUploadButton
            folder={folder}
            resourceType="image"
            buttonLabel={maxImages === 1 && images.length > 0 ? 'Ganti Gambar (Cloudinary)' : 'Upload Gambar (Cloudinary)'}
            onUploaded={(url) => handleAddUrl(url)}
          />
        )}
      </div>

      {canAddMore && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="w-3.5 h-3.5 text-[#6B3F2A]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl(manualUrl);
                  setManualUrl('');
                }
              }}
              placeholder="Atau tempel URL gambar / link share Google Drive..."
              className="w-full h-[38px] pl-8 pr-3 text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              handleAddUrl(manualUrl);
              setManualUrl('');
            }}
            className="h-[38px] px-3.5 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] text-xs font-bold text-[#502E1E] hover:bg-[#F5E9D9] inline-flex items-center gap-1 cursor-pointer"
          >
            <ImagePlus className="w-3.5 h-3.5 text-[#D9744A]" /> Tambah URL
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className={`relative group aspect-square rounded-xl overflow-hidden border bg-[#F8FAFC] ${idx === 0 ? 'border-[#D9744A] ring-2 ring-[#D9744A]/20' : 'border-[#E5E7EB]'
                }`}
            >
              <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && maxImages > 1 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#D9744A] text-white text-[9px] font-bold">
                  Utama
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {idx > 0 && maxImages > 1 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Jadikan gambar utama"
                    className="w-7 h-7 rounded-full bg-white text-[#D9744A] flex items-center justify-center cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Hapus gambar"
                  className="w-7 h-7 rounded-full bg-white text-red-600 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

