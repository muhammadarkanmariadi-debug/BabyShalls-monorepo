'use client';

import React, { useMemo, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminProduct,
  useAdminProducts,
  useDeleteAdminProduct,
  useUpdateAdminProduct,
} from '../../hooks/useAdminDashboard';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { ProductFormModal } from './ProductFormModal';

const CATEGORY_OPTIONS = [
  'Board Books',
  'Picture Books',
  'Sound & Sensory',
  'Wooden Toys',
  'Gift Hampers',
  'Early Readers',
  'Preloved Kurasi',
].map((c) => ({ label: c, value: c }));

export function AdminCatalogSection({ enabled }: { enabled: boolean }) {
  const { data: products = [], isLoading } = useAdminProducts(enabled);
  const updateMutation = useUpdateAdminProduct();
  const deleteMutation = useDeleteAdminProduct();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          (p.authorOrBrand || '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock_asc') return a.stock - b.stock;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, search, categoryFilter, sortBy]);

  const handleAdjustStock = async (id: string, nextStock: number) => {
    try {
      await updateMutation.mutateAsync({ id, stock: Math.max(0, nextStock) });
      toast.success('Stok diperbarui.');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui stok.'));
    }
  };

  return (
    <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-[#502E1E]">
            Manajemen Katalog SKU ({filteredProducts.length}/{products.length})
          </h2>
          <p className="text-xs text-[#6B3F2A]">Kelola buku kurasi, mainan kayu, hampers &amp; stok.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama produk, penulis/brand..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={CATEGORY_OPTIONS}
        filterLabel="Semua Kategori"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Terbaru', value: 'newest' },
          { label: 'Nama (A-Z)', value: 'name_asc' },
          { label: 'Harga Termurah', value: 'price_asc' },
          { label: 'Harga Termahal', value: 'price_desc' },
          { label: 'Stok Terkecil', value: 'stock_asc' },
        ]}
        rightAction={
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="h-[38px] px-4 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Produk
          </button>
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#6B7280]">Memuat produk dari PostgreSQL...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-xs text-[#6B7280] py-6 text-center">Tidak ada produk yang cocok dengan filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF6EC] text-[#6B3F2A] font-bold border-b border-[#EBDCCB]">
              <tr>
                <th className="py-3 px-3">Produk</th>
                <th className="py-3 px-3">Kategori &amp; Usia</th>
                <th className="py-3 px-3">Harga</th>
                <th className="py-3 px-3">Berat</th>
                <th className="py-3 px-3">Stok</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3ECE2]">
              {filteredProducts.map((p) => {
                const thumb = Array.isArray(p.images) && p.images[0] ? p.images[0] : '/images/placeholder-book.jpg';
                return (
                  <tr key={p.id} className="hover:bg-[#FCF6EC]/40">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={thumb}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#EBDCCB] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#1A1A1A] line-clamp-1">{p.name}</div>
                          {p.authorOrBrand && (
                            <div className="text-[11px] text-[#6B7280]">{p.authorOrBrand}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#502E1E]">{p.category}</div>
                      <div className="text-[11px] text-[#6B7280]">{p.ageGroup}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1A1A1A]">{formatIDR(p.price)}</div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[10px] line-through text-[#9CA3AF]">
                          {formatIDR(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#6B7280]">{p.weight || 300}g</td>
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p.id, p.stock - 1)}
                          className="w-6 h-6 rounded border border-[#EBDCCB] font-bold hover:bg-[#FCF6EC] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold w-6 text-center">{p.stock}</span>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p.id, p.stock + 1)}
                          className="w-6 h-6 rounded border border-[#EBDCCB] font-bold hover:bg-[#FCF6EC] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-[#EBDCCB] text-[#502E1E] hover:bg-[#FCF6EC] cursor-pointer"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Hapus produk "${p.name}"?`)) return;
                            deleteMutation.mutate(p.id, {
                              onSuccess: () => toast.success(`Produk "${p.name}" dihapus.`),
                              onError: (err) => toast.error(extractApiError(err, 'Gagal menghapus produk.')),
                            });
                          }}
                          className="p-1.5 rounded-lg border border-[#EBDCCB] text-[#6B7280] hover:text-red-600 cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingProduct={editingProduct}
      />
    </div>
  );
}
