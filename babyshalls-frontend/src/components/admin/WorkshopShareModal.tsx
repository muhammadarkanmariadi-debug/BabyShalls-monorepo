'use client';

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminModal } from './AdminModal';
import { AdminEventDto } from '../../hooks/useAdminEvents';

interface WorkshopShareModalProps {
  event: AdminEventDto | null;
  onClose: () => void;
}

export function WorkshopShareModal({ event, onClose }: WorkshopShareModalProps) {
  const qrWrapRef = useRef<HTMLDivElement>(null);

  if (!event) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://babyshalls.id';
  const shortUrl = event.shortCode
    ? `${origin}/w/${event.shortCode}`
    : `${origin}/events/register?event=${event.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Shortlink workshop disalin!');
    } catch {
      toast.error('Gagal menyalin link.');
    }
  };

  const handleDownloadQr = () => {
    const canvas = qrWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `qr-workshop-${event.shortCode || event.slug}.png`;
    link.click();
    toast.success('QR Code diunduh (PNG).');
  };

  return (
    <AdminModal
      isOpen={Boolean(event)}
      onClose={onClose}
      title="Shortlink & QR Share Workshop"
      subtitle={event.title}
      size="md"
    >
      <div className="space-y-5 text-center text-xs">
        <div
          ref={qrWrapRef}
          className="inline-flex flex-col items-center justify-center p-5 rounded-3xl bg-[#FCF6EC] border border-[#EBDCCB]"
        >
          <QRCodeCanvas
            value={shortUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#502E1E"
            level="H"
            includeMargin
          />
          <span className="mt-2 font-mono font-bold text-[#502E1E]">
            {event.shortCode ? `Kode: ${event.shortCode}` : event.slug}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={shortUrl}
            className="flex-1 bg-transparent px-2 text-xs font-mono font-semibold text-[#1A1A1A] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="h-8 px-3 rounded-lg bg-[#D9744A] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Salin
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="h-[40px] px-5 rounded-xl bg-[#1E543B] text-white font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Unduh QR Code (PNG)
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="h-[40px] px-5 rounded-xl border border-[#EBDCCB] bg-white text-[#502E1E] font-bold inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Buka Halaman Daftar
          </a>
        </div>
      </div>
    </AdminModal>
  );
}

