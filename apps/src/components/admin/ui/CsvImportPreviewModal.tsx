'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileSpreadsheet, Trash2, Upload, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient, extractApiError } from '../../../lib/axios';

export interface CsvImportProductRow {
  rowIndex: number;
  name: string;
  sku: string;
  category: string;
  subCategory: string;
  ageGroup: 'NEWBORN_PLUS' | 'AGES_1_3' | 'AGES_3_PLUS' | 'AGES_6_PLUS' | 'ALL_AGES';
  condition: 'NEW' | 'PRELOVED';
  price: number;
  originalPrice: number | null;
  stock: number;
  weight: number;
  authorOrBrand: string;
  description: string;
}

const VALID_AGE_GROUPS = new Set(['NEWBORN_PLUS', 'AGES_1_3', 'AGES_3_PLUS', 'AGES_6_PLUS', 'ALL_AGES']);
const CATEGORIES = [
  'Board Books',
  'Picture Books',
  'Sound & Sensory',
  'Wooden Toys',
  'Gift Hampers',
  'Early Readers',
  'Preloved Kurasi',
];

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

function getRowError(row: CsvImportProductRow): string | null {
  if (!row.name.trim() || row.name.trim().length < 2) return 'Nama minimal 2 karakter';
  if (!Number.isFinite(row.price) || row.price <= 0) return 'Harga harus > 0';
  if (!Number.isFinite(row.stock) || row.stock < 0) return 'Stok tidak valid';
  if (!Number.isFinite(row.weight) || row.weight <= 0) return 'Berat harus > 0';
  return null;
}

export function CsvImportPreviewModal() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<CsvImportProductRow[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
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

    const parsed: CsvImportProductRow[] = lines.slice(1).map((line, i) => {
      const cols = splitCsvLine(line);
      const get = (key: string) => {
        const pos = idx(key);
        return pos >= 0 ? (cols[pos] || '').trim() : '';
      };

      const rawPrice = Number(get('price'));
      const rawOrig = Number(get('originalPrice'));
      const rawStock = get('stock') ? Number(get('stock')) : 10;
      const rawWeight = get('weight') ? Number(get('weight')) : 300;
      const rawAge = get('ageGroup') || 'ALL_AGES';

      return {
        rowIndex: i + 2,
        name: get('name'),
        sku: get('sku'),
        category: get('category') || 'Board Books',
        subCategory: get('subCategory'),
        ageGroup: (VALID_AGE_GROUPS.has(rawAge) ? rawAge : 'ALL_AGES') as CsvImportProductRow['ageGroup'],
        condition: get('condition').toUpperCase() === 'PRELOVED' ? 'PRELOVED' : 'NEW',
        price: Number.isFinite(rawPrice) ? rawPrice : 0,
        originalPrice: Number.isFinite(rawOrig) && rawOrig > 0 ? rawOrig : null,
        stock: Number.isFinite(rawStock) ? Math.floor(rawStock) : 0,
        weight: Number.isFinite(rawWeight) ? Math.floor(rawWeight) : 300,
        authorOrBrand: get('authorOrBrand'),
        description: get('description'),
      };
    });

    setRows(parsed);
    setIsOpen(true);
  };

  const updateRow = <K extends keyof CsvImportProductRow>(
    index: number,
    key: K,
    value: CsvImportProductRow[K]
  ) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  };

  const { validRows, errorCount } = useMemo(() => {
    const valid: CsvImportProductRow[] = [];
    let errors = 0;
    for (const r of rows) {
      if (getRowError(r)) errors += 1;
      else valid.push(r);
    }
    return { validRows: valid, errorCount: errors };
  }, [rows]);

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

  const handleSubmit = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    try {
      const payloadRows = validRows.map((r) => ({
        name: r.name,
        sku: r.sku || null,
        category: r.category,
        subCategory: r.subCategory || null,
        ageGroup: r.ageGroup,
        condition: r.condition,
        price: Number(r.price),
        originalPrice: r.originalPrice,
        stock: Number(r.stock),
        weight: Number(r.weight),
        authorOrBrand: r.authorOrBrand || null,
        description: r.description || undefined,
      }));
      const res = await apiClient.post<{ success: boolean; message?: string }>(
        '/admin/import-export/products',
        { rows: payloadRows }
      );
      toast.success(res.data.message || 'Import produk berhasil.');
      setRows([]);
      setIsOpen(false);
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengimpor produk.'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="h-[38px] px-3.5 rounded-[4px] border border-[#E6D2C0] bg-white hover:bg-[#FFF6EA] text-[#4A2A1C] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5" /> Import CSV
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A2A1C]/50 backdrop-blur-[1px]">
          <div className="bg-white border border-[#E6D2C0] rounded-[6px] w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
            <div className="px-6 py-4 border-b border-[#E6D2C0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#4A2A1C] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#B05A26]" />
                  <span>Pratinjau &amp; Direct Edit Import CSV ({rows.length} baris)</span>
                </h2>
                <p className="text-[11px] text-[#7A5644] mt-0.5">
                  Edit langsung sel tabel di bawah bila ada data yang perlu diperbaiki sebelum disimpan.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs font-semibold text-[#B05A26] hover:underline cursor-pointer"
                >
                  Unduh Template
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-[4px] text-[#7A5644] hover:bg-[#FFF6EA] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-6 py-2.5 bg-[#FFF6EA] border-b border-[#E6D2C0] flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#E9F3E4] text-[#1E543B] font-bold">
                Valid: {validRows.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-[2px] bg-red-100 text-red-700 font-bold">
                Perlu Perbaikan: {errorCount}
              </span>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FFFDF9] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2 min-w-[200px]">Nama Produk *</th>
                    <th className="py-2 px-2 min-w-[110px]">SKU</th>
                    <th className="py-2 px-2 min-w-[130px]">Kategori</th>
                    <th className="py-2 px-2 min-w-[100px]">Kondisi</th>
                    <th className="py-2 px-2 min-w-[100px]">Harga *</th>
                    <th className="py-2 px-2 min-w-[75px]">Stok</th>
                    <th className="py-2 px-2 min-w-[80px]">Berat (g)</th>
                    <th className="py-2 px-2 min-w-[150px]">Status</th>
                    <th className="py-2 px-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2E4D6]">
                  {rows.map((row, idx) => {
                    const err = getRowError(row);
                    return (
                      <tr key={row.rowIndex} className={err ? 'bg-red-50/60' : ''}>
                        <td className="py-2 px-2 font-mono text-[#7A5644]">{row.rowIndex}</td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => updateRow(idx, 'name', e.target.value)}
                            className="w-full h-8 px-2 rounded-[4px] border border-[#E6D2C0] bg-white"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.sku}
                            onChange={(e) => updateRow(idx, 'sku', e.target.value)}
                            className="w-full h-8 px-2 rounded-[4px] border border-[#E6D2C0] bg-white font-mono"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={CATEGORIES.includes(row.category) ? row.category : 'Board Books'}
                            onChange={(e) => updateRow(idx, 'category', e.target.value)}
                            className="w-full h-8 px-1.5 rounded-[4px] border border-[#E6D2C0] bg-white"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={row.condition}
                            onChange={(e) =>
                              updateRow(idx, 'condition', e.target.value as 'NEW' | 'PRELOVED')
                            }
                            className="w-full h-8 px-1.5 rounded-[4px] border border-[#E6D2C0] bg-white"
                          >
                            <option value="NEW">NEW</option>
                            <option value="PRELOVED">PRELOVED</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={row.price}
                            onChange={(e) => updateRow(idx, 'price', Number(e.target.value))}
                            className="w-full h-8 px-2 rounded-[4px] border border-[#E6D2C0] bg-white"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={row.stock}
                            onChange={(e) => updateRow(idx, 'stock', Number(e.target.value))}
                            className="w-full h-8 px-2 rounded-[4px] border border-[#E6D2C0] bg-white"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={row.weight}
                            onChange={(e) => updateRow(idx, 'weight', Number(e.target.value))}
                            className="w-full h-8 px-2 rounded-[4px] border border-[#E6D2C0] bg-white"
                          />
                        </td>
                        <td className="py-2 px-2">
                          {err ? (
                            <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {err}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#1E543B] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Siap import
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <button
                            type="button"
                            onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-[4px] cursor-pointer"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-[#E6D2C0] bg-[#FFFDF9] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#7A5644] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={importing || validRows.length === 0}
                onClick={handleSubmit}
                className="h-9 px-5 rounded-[4px] bg-[#1E543B] hover:bg-[#163F2C] text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {importing ? 'Mengimpor...' : `Import ${validRows.length} Baris Valid`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

