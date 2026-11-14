'use client';

import React from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

interface CloudinaryUploadButtonProps {
  onUploaded: (secureUrl: string) => void;
  buttonLabel?: string;
  folder?: string;
  resourceType?: 'image' | 'auto' | 'raw' | 'video';
  maxFileSizeBytes?: number;
  className?: string;
  disabled?: boolean;
}

export function CloudinaryUploadButton({
  onUploaded,
  buttonLabel = 'Upload via Cloudinary',
  folder = 'babyshalls',
  resourceType = 'image',
  maxFileSizeBytes = 5_000_000,
  className = '',
  disabled = false,
}: CloudinaryUploadButtonProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC] opacity-50 text-xs font-bold text-[#502E1E] ${className}`}
      >
        <UploadCloud className="w-4 h-4 text-[#D9744A]" />
        <span>{buttonLabel}</span>
      </button>
    );
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return (
      <button
        type="button"
        onClick={() =>
          toast.error(
            'Konfigurasi Cloudinary belum lengkap. Tambahkan NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di frontend/.env.local.'
          )
        }
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#D9744A]/50 bg-[#FCF6EC] text-xs font-bold text-[#6B3F2A] hover:bg-[#F5E9D9] transition-colors cursor-pointer ${className}`}
      >
        <UploadCloud className="w-4 h-4 text-[#D9744A]" />
        <span>{buttonLabel}</span>
      </button>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset={CLOUDINARY_UPLOAD_PRESET}
      options={{
        cloudName: CLOUDINARY_CLOUD_NAME,
        folder,
        resourceType,
        multiple: false,
        maxFiles: 1,
        maxFileSize: maxFileSizeBytes,
        sources: ['local', 'url', 'camera', 'google_drive', 'dropbox', 'unsplash'],
        clientAllowedFormats:
          resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'webp', 'avif'] : undefined,
      }}
      onSuccess={(results: CloudinaryUploadWidgetResults) => {
        const info = results.info;
        if (info && typeof info === 'object' && 'secure_url' in info && typeof info.secure_url === 'string') {
          onUploaded(info.secure_url);
          toast.success('File berhasil diunggah ke Cloudinary!');
        }
      }}
      onError={() => {
        toast.error('Gagal mengunggah file ke Cloudinary.');
      }}
    >
      {({ open }) => (
        <button
          type="button"
          disabled={disabled}
          onClick={() => open()}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC] hover:bg-[#F5E9D9] disabled:opacity-50 text-xs font-bold text-[#502E1E] transition-colors cursor-pointer ${className}`}
        >
          <UploadCloud className="w-4 h-4 text-[#D9744A]" />
          <span>{buttonLabel}</span>
        </button>
      )}
    </CldUploadWidget>
  );
}

