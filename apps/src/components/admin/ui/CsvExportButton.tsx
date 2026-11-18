'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { ADMIN_TOKEN_STORAGE_KEY } from '../../../lib/axios';

interface CsvExportButtonProps {
  endpoint: string;
  filename: string;
  label?: string;
}

export function CsvExportButton({
  endpoint,
  filename,
  label = 'Export CSV',
}: CsvExportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) : '';
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal mengunduh CSV');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${filename} berhasil diunduh.`);
    } catch {
      toast.error('Gagal mengekspor data CSV.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={downloading}
      onClick={handleExport}
      className="h-[38px] px-3.5 rounded-[4px] border border-[#E6D2C0] bg-white hover:bg-[#FFF6EA] text-[#4A2A1C] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
    >
      <Download className="w-3.5 h-3.5" />
      <span>{downloading ? 'Mengunduh...' : label}</span>
    </button>
  );
}

