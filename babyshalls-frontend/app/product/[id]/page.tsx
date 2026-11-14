'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, ShoppingBag, BookOpen, Share2, MapPin, Sparkles } from 'lucide-react';
import { Header } from '../../../src/components/Header';
import { Footer } from '../../../src/components/Footer';
import { OrderDrawer } from '../../../src/components/OrderDrawer';
import { mockProducts, formatIDR } from '../../../src/data/mockProducts';
import { useCart } from '../../../src/context/CartContext';
import { Product } from '../../../src/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const id = typeof params?.id === 'string' ? params.id : '';

  // Get active product (support both mock and localStorage if synced)
  const product: Product | undefined = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('babyshalls_catalog_data');
        if (saved) {
          const list: Product[] = JSON.parse(saved);
          const found = list.find((p) => p.id === id);
          if (found) return found;
        }
      } catch {
        // fallback
      }
    }
    return mockProducts.find((p) => p.id === id) || mockProducts[0];
  }, [id]);

  const [selectedImage, setSelectedImage] = useState<string>(product?.coverImage || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.coverImage);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#221F1F] flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-2xl font-bold">Title not found</p>
          <Link href="/" className="mt-4 inline-block text-sm text-[#C86D51] underline underline-offset-4">
            Return to bookstore catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.ageGroup === product.ageGroup))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full">
      <Header />

      <main className="flex-grow w-full">
        {/* Breadcrumb Navigation */}
        <div className="w-full px-4 sm:px-6 lg:px-12 pt-6 pb-4">
          <nav className="flex items-center space-x-2 text-xs text-[#68625D]">
            <Link href="/" className="hover:text-[#E07A5F] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#E07A5F] transition-colors">
              Toko
            </Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#E07A5F] transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#2C2725] font-semibold truncate max-w-xs">{product.title}</span>
          </nav>
        </div>

        {/* 2-Column Editorial Product Layout */}
        <div className="w-full px-4 sm:px-6 lg:px-12 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left: Product Gallery */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
              {product.images && product.images.length > 1 && (
                <div className="order-2 sm:order-1 flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-20 sm:w-20 sm:h-26 shrink-0 bg-white overflow-hidden border rounded-md transition-all cursor-pointer ${
                        selectedImage === img ? 'border-[#E07A5F] ring-1 ring-[#E07A5F]' : 'border-[#EDE8E1] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main 3:4 Book Cover */}
              <div className="order-1 sm:order-2 flex-1 relative aspect-[3/4] bg-[#FAF8F5] rounded-md overflow-hidden border border-[#EDE8E1] shadow-xs">
                <img
                  src={selectedImage || product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />

                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#FFFDF9]/95 text-[#E07A5F] border border-[#EDE8E1] text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-xs shadow-xs">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Title & Metadata */}
              <div className="space-y-2.5 border-b border-[#EDE8E1] pb-6">
                <div className="text-xs uppercase tracking-widest text-[#E07A5F] font-semibold">
                  {product.category} • {product.ageGroup}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#2C2725] leading-tight">
                  {product.title}
                </h1>

                <p className="text-sm text-[#68625D]">
                  Oleh <span className="text-[#2C2725] font-medium">{product.author}</span>
                  {product.publisher && ` • Penerbit: ${product.publisher}`}
                </p>

                <div className="pt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#2C2725]">
                    {formatIDR(product.price)}
                  </span>
                  <span className="text-xs text-[#68625D]">
                    (Termasuk kurasi)
                  </span>
                </div>
              </div>

              {/* Physical Store Availability Notice */}
              <div className="flex items-center gap-2 text-xs text-[#2C2725] bg-white border border-[#EDE8E1] p-3.5 rounded-md">
                <span className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-red-500'}`} />
                <span>
                  {product.inStock ? 'Stok Tersedia' : 'Stok Habis'} • Dapat diambil langsung di butik Citraland Puncak Tidar Malang atau dikirim ke seluruh Indonesia
                </span>
              </div>

              {/* Quantity & Add to Bag Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#EDE8E1] bg-white rounded-md h-12 px-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-base text-[#68625D] hover:text-[#2C2725] px-2 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-[#2C2725]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-base text-[#68625D] hover:text-[#2C2725] px-2 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 h-12 bg-[#E07A5F] hover:bg-[#cc654b] text-white disabled:bg-neutral-300 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors rounded-md flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} strokeWidth={2} />
                        <span>Berhasil Ditambahkan</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} strokeWidth={1.5} />
                        <span>Tambah ke Keranjang</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary Request or Custom Hamper */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <Link
                    href={`/checkout?productId=${product.id}&qty=${quantity}`}
                    onClick={() => addToCart(product, quantity)}
                    className="h-11 border border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white font-semibold flex items-center justify-center transition-colors rounded-md"
                  >
                    Beli Sekarang
                  </Link>
                  <Link
                    href={`/request-a-book?title=${encodeURIComponent(product.title)}`}
                    className="h-11 border border-[#EDE8E1] bg-white hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] font-semibold flex items-center justify-center transition-colors rounded-md"
                  >
                    Tanya Stok Toko
                  </Link>
                </div>
              </div>

              {/* Editorial Description / Synopsis */}
              <div className="space-y-3 border-t border-[#EDE8E1] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2725]">
                  Sinopsis &amp; Manfaat Belajar
                </h3>
                <p className="text-sm text-[#68625D] leading-relaxed font-normal">
                  {product.description}
                </p>
                {product.excerpt && (
                  <blockquote className="border-l-2 border-[#E07A5F] pl-4 py-1 text-xs text-[#2C2725] italic mt-3 bg-[#FBE7E3]/30 rounded-r-sm">
                    “{product.excerpt}”
                  </blockquote>
                )}
              </div>

              {/* Specifications Table */}
              <div className="space-y-3 border-t border-[#EDE8E1] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2725]">
                  Spesifikasi Buku
                </h3>
                <dl className="divide-y divide-[#EDE8E1] text-xs">
                  {product.format && (
                    <div className="py-2 flex justify-between">
                      <dt className="text-[#68625D]">Format</dt>
                      <dd className="font-semibold text-[#2C2725]">{product.format}</dd>
                    </div>
                  )}
                  {product.pages && (
                    <div className="py-2 flex justify-between">
                      <dt className="text-[#68625D]">Jumlah Halaman</dt>
                      <dd className="font-semibold text-[#2C2725]">{product.pages}</dd>
                    </div>
                  )}
                  {product.language && (
                    <div className="py-2 flex justify-between">
                      <dt className="text-[#68625D]">Bahasa</dt>
                      <dd className="font-semibold text-[#2C2725]">{product.language}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="py-2 flex justify-between">
                      <dt className="text-[#68625D]">Dimensi</dt>
                      <dd className="font-semibold text-[#2C2725]">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.moralTheme && (
                    <div className="py-2 flex justify-between">
                      <dt className="text-[#68625D]">Fokus Tema</dt>
                      <dd className="font-semibold text-[#2C2725]">{product.moralTheme}</dd>
                    </div>
                  )}
                </dl>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#EDE8E1] py-14 sm:py-20 bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-12">
              <div className="mb-8 pb-4 border-b border-[#EDE8E1] text-left">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block mb-1">
                  Rekomendasi Kurator
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#2C2725]">
                  Buku &amp; Mainan Serupa
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10">
                {relatedProducts.map((item) => (
                  <div key={item.id} className="group flex flex-col text-left">
                    <Link
                      href={`/product/${item.id}`}
                      className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] rounded-md border border-[#EDE8E1] block shadow-xs group-hover:border-[#E07A5F] transition-colors"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    <div className="mt-3 space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-[#E07A5F] font-semibold">
                        {item.category}
                      </div>
                      <Link href={`/product/${item.id}`} className="block">
                        <h3 className="text-sm font-semibold text-[#2C2725] line-clamp-1 group-hover:text-[#E07A5F] transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#68625D] line-clamp-1">
                        {item.author}
                      </p>
                      <p className="text-sm font-bold text-[#2C2725] pt-0.5">
                        {formatIDR(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}
