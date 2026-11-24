'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
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
import { AdminConfirmDialog } from './ui/AdminConfirmDialog';
import { CsvExportButton } from './ui/CsvExportButton';
import { CsvImportPreviewModal } from './ui/CsvImportPreviewModal';

const CATEGORY_OPTIONS = [
  'Board Books',
  'Picture Books',
  'Sound & Sensory',
  'Wooden Toys',
  'Gift Hampers',
  'Early Readers',
  'Preloved Kurasi',
].map((c) => ({ label: c, value: c }));

function getCategoryBadge(category: string) {
  const c = category.toLowerCase();
  if (c.includes('board') || c.includes('picture') || c.includes('reader')) {
    return 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/60';
  }
  if (c.includes('toy') || c.includes('sensory') || c.includes('sound')) {
    return 'bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]/60';
  }
  if (c.includes('hamper')) {
    return 'bg-[#F3E6F2] text-[#7E4A84] border border-[#BA7EB8]/60';
  }
  if (c.includes('preloved')) {
    return 'bg-[#FDE3E8] text-[#B83246] border border-[#FBA6B2]/60';
  }
  return 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/60';
}

function getStockBadge(stock: number) {
  if (stock > 5) {
    return 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/60';
  }
  if (stock > 0) {
    return 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/60';
  }
  return 'bg-[#FDE3E8] text-[#C0392B] border border-[#FBA6B2]/60';
}

export function AdminCatalogSection({ enabled }: { enabled: boolean }) {
  const { data: products = [], isLoading } = useAdminProducts(enabled);
  const updateMutation = useUpdateAdminProduct();
  const deleteMutation = useDeleteAdminProduct();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);

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
      toast.success('Stock updated.');
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to update stock.'));
    }
  };

  return (
    <div className="bg-white border border-[#E6D2C0] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-[#4A2A1C]">
            SKU Catalog Management ({filteredProducts.length}/{products.length})
          </h2>
          <p className="text-xs text-[#7A5644]">
            Manage curated books, Montessori wooden toys, hampers &amp; store inventory in Malang.
          </p>
        </div>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search product name, author/brand..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={CATEGORY_OPTIONS}
        filterLabel="All Categories"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Newest', value: 'newest' },
          { label: 'Name (A-Z)', value: 'name_asc' },
          { label: 'Lowest Price', value: 'price_asc' },
          { label: 'Highest Price', value: 'price_desc' },
          { label: 'Lowest Stock', value: 'stock_asc' },
        ]}
        rightAction={
          <div className="flex flex-wrap items-center gap-2">
            <CsvImportPreviewModal />
            <CsvExportButton
              endpoint="/admin/import-export/products/export"
              filename="babyshalls-products.csv"
            />
            <Link
              href="/admin/products/new"
              className="h-[38px] px-4 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">Loading products from database...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">No products match the filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#E6D2C0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8EF] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
              <tr>
                <th className="py-3 px-3.5">Product</th>
                <th className="py-3 px-3.5">Category &amp; Age</th>
                <th className="py-3 px-3.5">Price</th>
                <th className="py-3 px-3.5">Weight</th>
                <th className="py-3 px-3.5">Stock &amp; Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E4D6]">
              {filteredProducts.map((p) => {
                const thumb = Array.isArray(p.images) && p.images[0] ? p.images[0] : '/images/placeholder-book.jpg';
                return (
                  <tr key={p.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={thumb}
                          alt={p.name}
                          className="w-10 h-10 rounded-md object-cover border border-[#E6D2C0] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#4A2A1C] line-clamp-1">{p.name}</div>
                          {p.authorOrBrand && (
                            <div className="text-[11px] text-[#7A5644]">{p.authorOrBrand}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${getCategoryBadge(p.category)}`}>
                        {p.category}
                      </span>
                      <div className="text-[11px] text-[#7A5644] mt-1">{p.ageGroup}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-[#4A2A1C]">{formatIDR(p.price)}</div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[10px] line-through text-[#C9B3A5]">
                          {formatIDR(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-[#7A5644]">{p.weight || 300}g</td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 rounded bg-[#FFFDF9] border border-[#E6D2C0] p-0.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p.id, p.stock - 1)}
                            className="w-5 h-5 rounded flex items-center justify-center font-bold text-[#4A2A1C] hover:bg-[#FFF6EA] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold w-6 text-center text-xs text-[#4A2A1C]">{p.stock}</span>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p.id, p.stock + 1)}
                            className="w-5 h-5 rounded flex items-center justify-center font-bold text-[#4A2A1C] hover:bg-[#FFF6EA] cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStockBadge(p.stock)}`}>
                          {p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-[4px] border border-[#92B2F3]/60 text-[#3F5FA0] hover:bg-[#E4ECFB] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-[4px] border border-[#FBA6B2]/60 text-[#C0392B] hover:bg-[#FDE3E8] transition-colors cursor-pointer"
                          title="Delete Product"
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

      <AdminConfirmDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        title="Delete this product?"
        description={`Product "${deletingProduct?.name || ''}" will be permanently removed from the BabyShalls catalog. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deletingProduct) return;
          deleteMutation.mutate(deletingProduct.id, {
            onSuccess: () => {
              toast.success(`Product "${deletingProduct.name}" deleted.`);
              setDeletingProduct(null);
            },
            onError: (err) => toast.error(extractApiError(err, 'Failed to delete product.')),
          });
        }}
      />
    </div>
  );
}
