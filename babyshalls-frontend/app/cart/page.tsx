'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShieldCheck, Gift, Check, Heart, X } from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { BannerHampers } from '@/components/home/BannerHampers';
import { useCart } from '@/context/CartContext';
import { formatIDR } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const itemToDelete = items.find((i) => i.product.id === deletingProductId);

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      removeFromCart(deletingProductId);
      setDeletingProductId(null);
      showToast('Barang berhasil dihapus dari keranjang');
    }
  };

  const handleMoveToWishlist = () => {
    if (deletingProductId) {
      removeFromCart(deletingProductId);
      setDeletingProductId(null);
      showToast('Barang dipindahkan ke Wishlist');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TombolKembali fallbackUrl="/shop" label="Lanjut Belanja" />

      {/* Main Cart Area (Figma Node #137:1087) */}
      <main className="py-6 sm:py-10 flex-1 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          {/* Page Heading (Figma #137:1123) */}
          <div className="flex items-baseline gap-3 mb-6 sm:mb-8 pb-4 border-b border-[#F2E4D6]">
            <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
              Keranjang Belanja
            </h1>
            <span className="text-sm text-[#7A5644]">
              {totalCount} {totalCount === 1 ? 'barang' : 'barang'}
            </span>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Cart Items List (Figma #137:1127, 720px width) */}
              <div className="flex-1 w-full bg-white border border-[#F2E4D6] rounded-[2px] p-5 sm:p-7 shadow-xs">
                
                {/* Table Header (Figma #137:1128) */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F2E4D6] text-xs">
                  <span className="font-semibold text-[#4A2A1C]">Barang ({totalCount})</span>
                  <span className="text-[#7A5644] bg-[#FFF6EA] px-2.5 py-1 rounded-[2px] font-medium">
                    📦 Dikirim dari Butik Citraland Malang
                  </span>
                </div>

                <div className="divide-y divide-[#F2E4D6]">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-5 first:pt-3 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="relative w-20 h-20 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0 border border-[#E6D2C0]"
                        >
                          <Image
                            src={item.product.coverImage || item.product.images?.[0] || '/images/prod-boardbook.jpg'}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          {/* Tag Kategori / Kondisi */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="bg-[#FFF1C7] text-[#8A5A00] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                              {item.product.category || 'Board Book'}
                            </span>
                            {item.product.condition === 'preloved' && (
                              <span className="bg-[#FDE3E8] text-[#B83246] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                                Preloved Steril UV
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/product/${item.product.id}`}
                            className="font-medium text-sm text-[#4A2A1C] hover:text-[#B05A26] transition-colors line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          
                          <span className="text-xs text-[#7A5644] block mt-0.5">
                            {item.product.authorOrBrand ? `Oleh ${item.product.authorOrBrand}` : 'Format: Board Book'}
                          </span>

                          <span className="text-xs font-semibold text-[#B05A26] block sm:hidden mt-1.5">
                            {formatIDR(item.product.price)}
                          </span>

                          {/* Quick Actions (Figma #137:1140) */}
                          <div className="flex items-center gap-3 pt-2 text-[11px] text-[#7A5644]">
                            <button
                              type="button"
                              onClick={() => {
                                showToast('Disimpan ke Wishlist');
                              }}
                              className="hover:text-[#B05A26] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Heart size={12} />
                              <span>Simpan ke Wishlist</span>
                            </button>
                            <span>&bull;</span>
                            <button
                              type="button"
                              onClick={() => setDeletingProductId(item.product.id)}
                              className="hover:text-[#C0392B] hover:underline flex items-center gap-1 text-[#C0392B] cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Stepper & Subtotal (Desktop & Tablet) */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2E4D6]">
                        {/* Stepper (Figma #137:1143) */}
                        <div className="flex items-center border border-[#E6D2C0] rounded-[2px] bg-white h-9 px-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.product.id, -1);
                              } else {
                                setDeletingProductId(item.product.id);
                              }
                            }}
                            className="text-base text-[#7A5644] hover:text-[#B05A26] px-2.5 font-medium cursor-pointer"
                            aria-label="Kurang satu"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold text-[#4A2A1C] px-2 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="text-base text-[#7A5644] hover:text-[#B05A26] px-2.5 font-medium cursor-pointer"
                            aria-label="Tambah satu"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total (Figma #137:1153) */}
                        <span className="text-sm font-semibold text-[#4A2A1C] min-w-[100px] text-right">
                          {formatIDR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free gift promo note */}
                <div className="mt-6 pt-4 border-t border-[#F2E4D6] flex items-center gap-2.5 text-xs text-[#2A6E37] bg-[#FFFBF7] p-3 rounded-[2px]">
                  <Gift className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>
                    <strong>Gratis Bungkus Kado:</strong> Setiap pembelian buku anak dan mainan bisa diberi ucapan kado spesial tanpa biaya tambahan saat checkout.
                  </span>
                </div>
              </div>

              {/* Right Column: Ringkasan Belanja (Figma Node #137:1218, 380px width) */}
              <aside className="w-full lg:w-[380px] shrink-0 sticky top-24 space-y-4">
                <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 shadow-xs flex flex-col gap-5">
                  <h2 className="text-lg font-medium text-[#4A2A1C] pb-2 border-b border-[#F2E4D6]">
                    Ringkasan Belanja
                  </h2>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between text-[#7A5644]">
                      <span>Subtotal ({totalCount} barang)</span>
                      <span className="font-semibold text-[#4A2A1C]">{formatIDR(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#7A5644]">
                      <span>Estimasi Pengiriman</span>
                      <span className="font-medium text-[#4A2A1C]">Dihitung di checkout</span>
                    </div>

                    <div className="flex items-center justify-between text-[#7A5644]">
                      <span>Bungkus Kado &amp; Kartu Ucapan</span>
                      <span className="font-semibold text-[#2A6E37]">GRATIS</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F2E4D6] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#4A2A1C]">Total sementara</span>
                    <span className="text-2xl font-bold text-[#B05A26]">
                      {formatIDR(subtotal)}
                    </span>
                  </div>

                  {/* Tombol Lanjut ke Checkout (Figma #137:1226) */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold text-xs rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Lanjut ke Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Jaminan Pembayaran Aman (Figma #137:1228) */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-[#7A5644]">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2A6E37] shrink-0" />
                      <span>Pembayaran aman via Midtrans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2A6E37] shrink-0" />
                      <span>QRIS, kartu kredit/debit, virtual account</span>
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          ) : (
            /* Empty State (Figma Node #137:1290) */
            <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-10 sm:p-16 text-center max-w-xl mx-auto flex flex-col items-center">
              <div className="relative w-44 h-44 mb-4">
                <Image
                  src="/images/mascot/maskot-keranjang-kosong.png"
                  alt="Keranjang Kosong"
                  fill
                  className="object-contain"
                />
              </div>

              <h2 className="text-xl font-medium text-[#4A2A1C] mb-2 tracking-tight">
                Keranjang belanjamu masih kosong
              </h2>

              <p className="text-xs sm:text-sm text-[#7A5644] mb-6 leading-relaxed max-w-sm">
                Yuk temukan buku bergambar, mainan montessori, dan paket hampers terbaik untuk menemani tumbuh kembang si kecil.
              </p>

              <Link
                href="/shop"
                className="px-8 py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-sm"
              >
                Mulai Belanja Sekarang
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* Dialog Hapus Barang (Figma Node #137:1337) */}
      {deletingProductId && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] max-w-md w-full p-6 shadow-xl border border-[#E6D2C0] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F2E4D6] pb-3">
              <h3 className="font-semibold text-base text-[#4A2A1C]">
                Hapus barang dari keranjang?
              </h3>
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="p-1 text-[#7A5644] hover:text-[#4A2A1C]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#7A5644] leading-relaxed">
              Apakah kamu yakin ingin menghapus <strong>{itemToDelete.product.title}</strong>? Kamu juga bisa memindahkannya ke Wishlist agar mudah ditemukan lagi nanti.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="w-full sm:w-auto px-4 py-2 bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#7A5644] text-xs font-semibold rounded-[2px] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleMoveToWishlist}
                className="w-full sm:w-auto px-4 py-2 bg-[#FFF6EA] hover:bg-[#FBE6D8] text-[#B05A26] border border-[#E6D2C0] text-xs font-semibold rounded-[2px] transition-colors"
              >
                Pindahkan ke Wishlist
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-4 py-2 bg-[#C0392B] hover:bg-[#a5281b] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4A2A1C] text-white text-xs px-4 py-3 rounded-[4px] shadow-lg animate-in slide-in-from-bottom duration-200 flex items-center gap-2">
          <Check size={16} className="text-[#82BC85]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BannerHampers />
    </div>
  );
}

