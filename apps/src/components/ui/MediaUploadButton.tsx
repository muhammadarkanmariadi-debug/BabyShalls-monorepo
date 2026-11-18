'use client';

import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';

interface MediaUploadButtonProps {
  onUploaded: (publicUrl: string) => void;
  buttonLabel?: string;
  folder?: string;
  maxFileSizeBytes?: number;
  className?: string;
  disabled?: boolean;
}

export function MediaUploadButton({
  onUploaded,
  buttonLabel = 'Upload / Import Media',
  folder = 'babyshalls',
  maxFileSizeBytes = 5_000_000,
  className = '',
  disabled = false,
}: MediaUploadButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC] text-xs font-bold text-[#6B3F2A] hover:bg-[#F5E9D9] transition-colors cursor-pointer disabled:opacity-50 ${className}`}
      >
        <UploadCloud className="w-4 h-4 text-[#D9744A]" />
        <span>{buttonLabel}</span>
      </button>

      <MediaPickerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onUploaded={onUploaded}
        folder={folder}
        maxFileSizeBytes={maxFileSizeBytes}
      />
    </>
  );
}
