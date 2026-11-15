'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Gift } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';
import { BannerHampers } from '@/components/home/BannerHampers';
import { useCart } from '@/context/CartContext';
import { formatIDR } from '@/data/mockProducts';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    grandTotal,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/shop" label="Lanjut Belanja" />

      {/* Main Cart Area (Figma Node #137:1087) */}
      <main className="py-10 sm:py-14 flex-1 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          {/* Page Heading */}
          <div className="flex items-baseline gap-3 mb-8 pb-4 border-b border-[#F2E4D6]">
            <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
              Keranjang Belanja
            </h1>
            <span className="text-sm text-[#7A5644]">
              ({items.reduce((acc, i) => acc + i.quantity, 0)} produk)
            </span>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Cart Items List */}
              <div className="flex-1 w-full bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-xs">
                <div className="divide-y divide-[#F2E4D6]">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
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

                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.product.id}`}
                            className="font-medium text-sm text-[#4A2A1C] hover:text-[#B05A26] transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          <span className="text-xs text-[#7A5644] block mt-0.5">
                            {item.product.category} · Board Book
                          </span>
                          <span className="text-xs font-semibold text-[#B05A26] block mt-1">
                            {formatIDR(item.product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#E6D2C0] rounded-[2px] bg-white h-9 px-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="text-base text-[#7A5644] hover:text-[#B05A26] px-2 font-medium cursor-pointer"
                            aria-label="Kurang satu"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold text-[#4A2A1C] px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="text-base text-[#7A5644] hover:text-[#B05A26] px-2 font-medium cursor-pointer"
                            aria-label="Tambah satu"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="text-sm font-semibold text-[#4A2A1C] min-w-[90px] text-right">
                          {formatIDR(item.product.price * item.quantity)}
                        </span>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label="Hapus item"
                          className="text-gray-400 hover:text-[#C0392B] p-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free gift promo note */}
                <div className="mt-6 pt-4 border-t border-[#F2E4D6] flex items-center gap-2.5 text-xs text-[#2A6E37] bg-[#FFFBF7] p-3 rounded-[2px]">
                  <Gift className="w-4 h-4 text-[#B05A26] shrink-0" />
                  <span>
                    <strong>Promo Spesial:</strong> Dapatkan gratis bungkus kado & kartu ucapan untuk setiap pesanan. Aktifkan di langkah checkout!
                  </span>
                </div>
              </div>

              {/* Right Column: Ringkasan Belanja (Figma 384px width) */}
              <aside className="w-full lg:w-[380px] shrink-0 sticky top-24">
                <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
                  <h2 className="text-lg font-medium text-[#4A2A1C] pb-2 border-b border-[#F2E4D6]">
                    Ringkasan Belanja
                  </h2>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between text-[#7A5644]">
                      <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} barang)</span>
                      <span className="font-semibold text-[#4A2A1C]">{formatIDR(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#7A5644]">
                      <span>Estimasi Pengiriman</span>
                      <span className="font-medium text-[#4A2A1C]">Dihitung di checkout</span>
                    </div>

                    <div className="flex items-center justify-between text-[#7A5644]">
                      <span>Bungkus Kado & Kartu</span>
                      <span className="font-semibold text-[#2A6E37]">GRATIS</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F2E4D6] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#4A2A1C]">Total Tagihan</span>
                    <span className="text-2xl font-bold text-[#B05A26]">
                      {formatIDR(subtotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Lanjut ke Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A5644] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2A6E37]" />
                    <span>Garansi buku aman & asli 100%</span>
                  </div>
                </div>
              </aside>

            </div>
          ) : (
            /* Empty State (Figma Node #137:1290) */
            <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-12 sm:p-16 text-center max-w-xl mx-auto flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
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
                className="px-8 py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-sm"
              >
                Mulai Belanja Sekarang
              </Link>
            </div>
          )}

        </div>
      </main>

      <BannerHampers />
      <Footer />
    </div>
  );
}

