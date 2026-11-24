'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  Truck,
  Package,
  Gift,
  Store,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Share2,
  X,
  ZoomIn,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { WireProductCard } from '@/components/common/WireProductCard';
import { BannerHampers } from '@/components/home/BannerHampers';
import { ProductGallery } from '@/features/catalog/components/ProductGallery';
import { formatIDR } from '@/lib/utils';
import { useProductBySlug, useStorefrontProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export function ProductDetailView() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const id = typeof params?.id === 'string' ? params.id : '';

  const { data: detailData, isLoading: isDetailLoading } = useProductBySlug(id);
  const { products: storefrontProducts } = useStorefrontProducts();

  const product: Product | undefined = useMemo(() => {
    if (detailData?.product) return detailData.product;
    return storefrontProducts.find(
      (p) => p.id === id || p.slug === id || p.id.toLowerCase() === id.toLowerCase()
    );
  }, [detailData, storefrontProducts, id]);

  const [selectedImage, setSelectedImage] = useState<string>(product?.coverImage || product?.images?.[0] || '/images/prod-boardbook.jpg');
  const [selectedFormat, setSelectedFormat] = useState<string>('Board Book');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState<boolean>(false);

  // Accordions open/close state
  const [openSection, setOpenSection] = useState<'desc' | 'specs' | 'shipping'>('desc');

  useEffect(() => {
    if (!isImageZoomOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsImageZoomOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isImageZoomOpen]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.coverImage || product.images?.[0] || '/images/prod-boardbook.jpg');
    }
  }, [product]);

  if (isDetailLoading && !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center text-[#7A5644]">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-2xl font-medium text-[#4A2A1C]">Product Not Found</p>
          <Link href="/shop" className="mt-4 inline-block text-sm text-[#B05A26] underline">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Thumbnails gallery (from DB images / galleryImages)
  const galleryImages: string[] = Array.from(
    new Set(
      [
        product.coverImage,
        ...(Array.isArray(product.images) ? product.images : []),
      ].filter((img): img is string => Boolean(img && img.trim().length > 0))
    )
  );
  if (galleryImages.length === 0) {
    galleryImages.push('/images/prod-boardbook.jpg');
  }

  // Age label mapping
  const getAgeBadge = (age?: string) => {
    if (!age || age === 'All' || age === 'All Ages') return { label: 'All ages', bg: 'bg-[#FFF0E0]', text: 'text-[#B05A26]' };
    if (age.includes('0–1') || age.includes('0–2') || age.toLowerCase().includes('newborn')) {
      return { label: 'Newborn (0–1 yr)', bg: 'bg-[#FEECE8]', text: 'text-[#C0392B]' };
    }
    if (age.includes('1–3') || age.includes('1-3')) {
      return { label: '1–3 yrs', bg: 'bg-[#FFF3D6]', text: 'text-[#9A6500]' };
    }
    if (age.includes('3–5') || age.includes('3+')) {
      return { label: '3+ yrs', bg: 'bg-[#DDF1E5]', text: 'text-[#2A6E37]' };
    }
    if (age.includes('6+')) {
      return { label: '6+ yrs', bg: 'bg-[#E3EDF9]', text: 'text-[#2C5282]' };
    }
    return { label: age, bg: 'bg-[#DDF1E5]', text: 'text-[#2A6E37]' };
  };

  const ageBadge = getAgeBadge(product.ageGroup);
  const isPreloved = product.category === 'Preloved Item' || product.condition === 'preloved';
  const hasDiscount = Boolean(product.discountPercent && product.discountPercent > 0);
  const isOutOfStock = product.stock !== undefined ? product.stock <= 0 : product.inStock === false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const relatedProducts = storefrontProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TombolKembali fallbackUrl="/shop" label="Back to Catalog" />

      {/* Breadcrumb Navigation (Figma #135:898) */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 py-5">
        <nav className="flex items-center gap-2 text-[13px] text-[#7A5644] overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:underline">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:underline">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#4A2A1C] truncate max-w-xs">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section (Figma #135:900) */}
      <section className="pb-16 max-w-[1200px] w-full mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery + Lightbox */}
          <ProductGallery
            title={product.title}
            galleryImages={galleryImages}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            discountPercent={product.discountPercent}
            isOutOfStock={isOutOfStock}
            isPreloved={isPreloved}
          />

          {/* Right Column: Product Information (Figma #135:917, 552px width) */}
          <div className="flex-1 w-full flex flex-col">
            
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`${ageBadge.bg} ${ageBadge.text} text-xs font-semibold px-2.5 py-1 rounded-[2px]`}>
                {ageBadge.label}
              </span>
              <span className="bg-[#FFF6EA] text-[#7A5644] border border-[#E6D2C0] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                {product.category}
              </span>
              {isPreloved ? (
                <span className="border border-[#2A6E37] text-[#2A6E37] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                  Preloved · Like New
                </span>
              ) : (
                <span className="bg-[#EBF7EE] text-[#2A6E37] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                  Brand New
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] leading-tight mb-2 tracking-tight">
              {product.title}
            </h1>

            {/* Author / Subtitle */}
            {(product.author || product.publisher || product.publicationYear) && (
              <p className="text-sm text-[#7A5644] mb-3">
                {product.author && (
                  <>
                    by <span className="font-medium text-[#4A2A1C]">{product.author}</span>
                  </>
                )}
                {product.publisher && ` · ${product.publisher}`}
                {product.publicationYear && ` (${product.publicationYear})`}
              </p>
            )}

            {/* Stock Info */}
            <div className="flex items-center gap-2 text-xs text-[#7A5644] mb-5">
              <span>Stock: {product.stock ?? (product.inStock ? 'Available' : 'Sold Out')}</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#F2E4D6] mb-6">
              <span className="text-3xl font-bold text-[#4A2A1C]">
                {formatIDR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#C9B3A5] line-through font-normal">
                  {formatIDR(product.originalPrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-[#C0392B] text-white text-xs font-semibold px-2 py-0.5 rounded-[2px]">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Format Selection (hanya tampil jika produk memiliki data format dari DB) */}
            {product.format && (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#4A2A1C] mb-2 uppercase tracking-wider">
                  Select Format:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.format
                    .split(',')
                    .map((fmt) => fmt.trim())
                    .filter(Boolean)
                    .map((fmt) => {
                      const isActive = selectedFormat === fmt;
                      return (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setSelectedFormat(fmt)}
                          className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#B05A26] text-white border border-[#B05A26]'
                              : 'bg-white text-[#4A2A1C] border border-[#E6D2C0] hover:border-[#B05A26]'
                          }`}
                        >
                          {fmt}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Stock Alert (dinamis dari DB) */}
            {product.stock !== undefined && product.stock <= 0 ? (
              <div className="flex items-center gap-2 text-xs text-[#C0392B] font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-[#C0392B]"></span>
                <span>Currently out of stock at Citraland Malang Boutique</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#2A6E37] font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-[#2A6E37] animate-pulse"></span>
                <span>
                  In stock at Citraland Malang Boutique
                  {typeof product.stock === 'number' ? ` (${product.stock} items left)` : ''}
                </span>
              </div>
            )}

            {/* Quantity Stepper & CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#E6D2C0] rounded-[2px] bg-white h-12 w-28 sm:w-36 shrink-0 justify-between px-2 sm:px-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-lg text-[#7A5644] hover:text-[#B05A26] font-medium px-1.5 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-[#4A2A1C] min-w-[20px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-lg text-[#7A5644] hover:text-[#B05A26] font-medium px-1.5 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-12 bg-[#B05A26] hover:bg-[#964B1F] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm rounded-[2px] transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm px-3 sm:px-4"
                >
                  {isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <span>+ Add to Bag</span>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist"
                  className={`h-12 w-12 border rounded-[2px] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isWishlisted
                      ? 'border-[#C0392B] bg-[#FFF0F0] text-[#C0392B]'
                      : 'border-[#E6D2C0] text-[#7A5644] hover:text-[#B05A26] hover:border-[#B05A26]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Full-Width */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full h-12 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed font-medium text-sm rounded-[2px] transition-colors cursor-pointer flex items-center justify-center"
              >
                {isOutOfStock ? 'Sold Out' : 'Buy Now'}
              </button>
            </div>

            {/* Benefit Highlights List (Figma Benefits) */}
            <div className="bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] p-4 flex flex-col gap-3 mb-8 text-xs text-[#4A2A1C]">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Shipped directly from <strong>Citraland Puncak Tidar, Malang</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Product weight: <strong>± {product.weightInGrams || 300} grams</strong> (secure dual-layer bubble wrap)</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Complimentary <strong>gift wrapping & custom greeting card</strong> available at checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span><strong>Store Pick-up (Self Pick-up)</strong> option with zero shipping fee</span>
              </div>
            </div>

            {/* Accordions (Description, Specs, Shipping) */}
            <div className="border-t border-[#F2E4D6]">
              {/* Accordion 1: Description */}
              <div className="border-b border-[#F2E4D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'desc' ? ('' as any) : 'desc')}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                >
                  <span>Product Description &amp; Benefits</span>
                  {openSection === 'desc' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A5644]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A5644]" />
                  )}
                </button>
                {openSection === 'desc' && (
                  <div className="pb-5 text-sm text-[#7A5644] leading-relaxed space-y-3">
                    <p className="whitespace-pre-line">{product.description}</p>
                    {Array.isArray(product.features) && product.features.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1">
                        {product.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Specs */}
              <div className="border-b border-[#F2E4D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'specs' ? ('' as any) : 'specs')}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                >
                  <span>Details &amp; Specifications</span>
                  {openSection === 'specs' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A5644]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A5644]" />
                  )}
                </button>
                {openSection === 'specs' && (
                  <div className="pb-5 text-xs text-[#4A2A1C]">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644] w-1/3">Product Name</td>
                          <td className="py-2 font-medium">{product.title}</td>
                        </tr>
                        {product.author && (
                          <tr className="border-b border-[#F9EAE1]">
                            <td className="py-2 text-[#7A5644]">Author / Brand</td>
                            <td className="py-2 font-medium">{product.author}</td>
                          </tr>
                        )}
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Category</td>
                          <td className="py-2 font-medium">{product.category}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Age Group</td>
                          <td className="py-2 font-medium">{ageBadge.label}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Weight</td>
                          <td className="py-2 font-medium">{product.weightInGrams || 300} grams</td>
                        </tr>
                        {product.publisher && (
                          <tr className="border-b border-[#F9EAE1]">
                            <td className="py-2 text-[#7A5644]">Publisher</td>
                            <td className="py-2 font-medium">{product.publisher}</td>
                          </tr>
                        )}
                        {product.publicationYear && (
                          <tr className="border-b border-[#F9EAE1]">
                            <td className="py-2 text-[#7A5644]">Publication Year</td>
                            <td className="py-2 font-medium">{product.publicationYear}</td>
                          </tr>
                        )}
                        {(product.format || product.pages) && (
                          <tr className="border-b border-[#F9EAE1]">
                            <td className="py-2 text-[#7A5644]">Format / Pages</td>
                            <td className="py-2 font-medium">
                              {[product.format, product.pages].filter(Boolean).join(' · ')}
                            </td>
                          </tr>
                        )}
                        {product.language && (
                          <tr className="border-b border-[#F9EAE1]">
                            <td className="py-2 text-[#7A5644]">Language</td>
                            <td className="py-2 font-medium">{product.language}</td>
                          </tr>
                        )}
                        {product.isbn && (
                          <tr className="border-b border-[#F9EAE1]">
                            <td className="py-2 text-[#7A5644]">ISBN</td>
                            <td className="py-2 font-medium">{product.isbn}</td>
                          </tr>
                        )}
                        {product.dimensions && (
                          <tr>
                            <td className="py-2 text-[#7A5644]">Dimensions</td>
                            <td className="py-2 font-medium">{product.dimensions}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping */}
              <div className="border-b border-[#F2E4D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'shipping' ? ('' as any) : 'shipping')}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                >
                  <span>Shipping &amp; Store Policies</span>
                  {openSection === 'shipping' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A5644]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A5644]" />
                  )}
                </button>
                {openSection === 'shipping' && (
                  <div className="pb-5 text-sm text-[#7A5644] leading-relaxed space-y-2">
                    <p>
                      Orders placed before 3:00 PM WIB are dispatched on the same day. We provide nationwide delivery across Indonesia via JNE, J&amp;T, SiCepat, and instant couriers (GoSend/Grab) for the Greater Malang area.
                    </p>
                    <p>
                      <strong>BabyShalls Guarantee:</strong> If the item received has printing defects or arrives damaged, we provide a replacement or 100% refund with an unboxing video submitted within 48 hours.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Rekomendasi Section (Figma #135:1031) */}
      <section className="bg-[#FFFBF7] py-14 border-t border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-[#4A2A1C] tracking-tight">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-[#B05A26] hover:underline"
            >
              View All Products →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map((rel) => (
              <WireProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Hampers (Figma #150:1337) */}
      <BannerHampers />
    </div>
  );
}

