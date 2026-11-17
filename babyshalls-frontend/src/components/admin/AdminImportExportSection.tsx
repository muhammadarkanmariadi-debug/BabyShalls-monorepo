'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ADMIN_TOKEN_STORAGE_KEY, apiClient, extractApiError } from '../../lib/axios';
import { formatIDR } from '../../lib/utils';

interface ParsedCsvRow {
  rowIndex: number;
  name: string;
  sku?: string;
  category: string;
  subCategory?: string;
  ageGroup: 'NEWBORN_PLUS' | 'AGES_1_3' | 'AGES_3_PLUS' | 'AGES_6_PLUS' | 'ALL_AGES';
  condition: 'NEW' | 'PRELOVED';
  price: number;
  originalPrice?: number | null;
  stock: number;
  weight: number;
  authorOrBrand?: string;
  description?: string;
  error?: string;
}

const VALID_AGE_GROUPS = new Set(['NEWBORN_PLUS', 'AGES_1_3', 'AGES_3_PLUS', 'AGES_6_PLUS', 'ALL_AGES']);

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function AdminImportExportSection() {
  const qc = useQueryClient();
  const [previewRows, setPreviewRows] = useState<ParsedCsvRow[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      toast.error('File CSV kosong atau tidak memiliki baris data.');
      return;
    }

    const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
    const idx = (key: string) => headers.indexOf(key.toLowerCase());

    const parsed: ParsedCsvRow[] = lines.slice(1).map((line, i) => {
      const cols = splitCsvLine(line);
      const get = (key: string) => {
        const pos = idx(key);
        return pos >= 0 ? (cols[pos] || '').trim() : '';
      };

      const name = get('name');
      const price = Number(get('price'));
      const originalPriceRaw = get('originalPrice');
      const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
      const stock = get('stock') ? Number(get('stock')) : 10;
      const weight = get('weight') ? Number(get('weight')) : 300;
      const rawAge = get('ageGroup') || 'ALL_AGES';
      const ageGroup = (VALID_AGE_GROUPS.has(rawAge) ? rawAge : 'ALL_AGES') as ParsedCsvRow['ageGroup'];
      const condition = get('condition').toUpperCase() === 'PRELOVED' ? 'PRELOVED' : 'NEW';
      const category = get('category') || 'Board Books';

      let error: string | undefined;
      if (!name || name.length < 2) error = 'Nama produk wajib diisi';
      else if (!Number.isFinite(price) || price <= 0) error = 'Harga tidak valid';

      return {
        rowIndex: i + 2,
        name,
        sku: get('sku') || undefined,
        category,
        subCategory: get('subCategory') || undefined,
        ageGroup,
        condition,
        price: Number.isFinite(price) ? price : 0,
        originalPrice: originalPrice && Number.isFinite(originalPrice) ? originalPrice : null,
        stock: Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : 0,
        weight: Number.isFinite(weight) && weight > 0 ? Math.floor(weight) : 300,
        authorOrBrand: get('authorOrBrand') || undefined,
        description: get('description') || undefined,
        error,
      };
    });

    setPreviewRows(parsed);
  };

  const validRows = previewRows.filter((r) => !r.error);
  const errorRows = previewRows.filter((r) => Boolean(r.error));

  const handleConfirmImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>(
        '/admin/import-export/products',
        { rows: validRows }
      );
      toast.success(res.data.message || 'Import produk berhasil.');
      setPreviewRows([]);
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengimpor produk.'));
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadExport = async () => {
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) : '';
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/admin/import-export/products/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal mengunduh CSV');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'babyshalls-products.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('File CSV produk berhasil diunduh.');
    } catch {
      toast.error('Gagal mengekspor data produk.');
    }
  };

  const handleDownloadTemplate = () => {
    const csv =
      'name,sku,category,subCategory,ageGroup,condition,price,originalPrice,stock,weight,authorOrBrand,description\n' +
      'Little Bear Board Book,BS-DEMO-01,Board Books,Nature,AGES_1_3,NEW,165000,195000,12,350,Eric Carle,Buku cerita anak kurasi Malang\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-import-produk.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Import Card */}
        <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Import dari CSV</h2>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="text-xs font-semibold text-[#B05A26] hover:underline cursor-pointer"
            >
              Unduh Template CSV
            </button>
          </div>
          <p className="text-[#7A5644]">
            Unggah file <code>.csv</code> untuk menambah atau memperbarui produk massal berdasarkan SKU.
          </p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E6D2C0] rounded-[6px] p-6 bg-[#FFFDF9] hover:bg-[#FFF6EA] cursor-pointer">
            <Upload className="w-6 h-6 text-[#B05A26] mb-2" />
            <span className="font-semibold text-[#4A2A1C]">Pilih file CSV produk</span>
            <span className="text-[11px] text-[#7A5644] mt-0.5">Maksimal 500 baris per unggahan</span>
            <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Export Card */}
        <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Export ke CSV</h2>
            <p className="text-[#7A5644]">
              Unduh seluruh katalog produk aktif beserta SKU, harga, stok, dan berat pengiriman.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadExport}
            className="h-10 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold inline-flex items-center justify-center gap-2 cursor-pointer w-fit"
          >
            <Download className="w-4 h-4" /> Export Katalog Produk (.CSV)
          </button>
        </div>
      </div>

      {/* Preview & Validation Table (Figma 218:8250) */}
      {previewRows.length > 0 && (
        <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-semibold text-[#4A2A1C]">
                <FileSpreadsheet className="w-4 h-4 text-[#B05A26]" />
                <span>Pratinjau Import ({previewRows.length} baris)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#E9F3E4] text-[#1E543B] font-bold">
                Valid: {validRows.length}
              </span>
              {errorRows.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-[2px] bg-red-100 text-red-700 font-bold">
                  Error: {errorRows.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewRows([])}
                className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#7A5644] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={importing || validRows.length === 0}
                onClick={handleConfirmImport}
                className="h-9 px-5 rounded-[4px] bg-[#1E543B] hover:bg-[#163F2C] text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {importing ? 'Mengimpor...' : `Import ${validRows.length} Baris Valid`}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead className="bg-[#FFF6EA] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
                <tr>
                  <th className="py-2.5 px-3">Baris</th>
                  <th className="py-2.5 px-3">Nama Produk</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Harga</th>
                  <th className="py-2.5 px-3">Stok</th>
                  <th className="py-2.5 px-3">Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E4D6]">
                {previewRows.map((row) => (
                  <tr key={row.rowIndex} className={row.error ? 'bg-red-50/70' : ''}>
                    <td className="py-2.5 px-3 font-mono">{row.rowIndex}</td>
                    <td className="py-2.5 px-3 font-semibold">{row.name || '-'}</td>
                    <td className="py-2.5 px-3 font-mono">{row.sku || '-'}</td>
                    <td className="py-2.5 px-3">{row.category}</td>
                    <td className="py-2.5 px-3">{formatIDR(row.price)}</td>
                    <td className="py-2.5 px-3">{row.stock}</td>
                    <td className="py-2.5 px-3">
                      {row.error ? (
                        <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> {row.error}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#1E543B] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Siap import
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

