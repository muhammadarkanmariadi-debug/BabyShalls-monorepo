'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminProduct,
  AdminProductPayload,
  PrismaAgeGroup,
  ProductCondition,
  ProductVariant,
  useCreateAdminProduct,
  useUpdateAdminProduct,
} from '../../hooks/useAdminDashboard';
import { extractApiError } from '../../lib/axios';
import { CurrencyInput } from '../ui/CurrencyInput';
import { MultiImageUploader } from './MultiImageUploader';

const STOREFRONT_CATEGORIES = [
  'Board Books',
  'Picture Books',
  'Sound & Sensory',
  'Wooden Toys',
  'Gift Hampers',
  'Early Readers',
  'Preloved Kurasi',
];

const AGE_GROUPS: { label: string; value: PrismaAgeGroup }[] = [
  { label: 'Newborn+ (0-12 mos)', value: 'NEWBORN_PLUS' },
  { label: 'Ages 1-3', value: 'AGES_1_3' },
  { label: 'Ages 3+', value: 'AGES_3_PLUS' },
  { label: 'Ages 6+', value: 'AGES_6_PLUS' },
  { label: 'All Ages', value: 'ALL_AGES' },
];

const PRELOVED_GRADES = ['Like New', 'Very Good', 'Good'];

interface ProductEditorViewProps {
  editingProduct?: AdminProduct | null;
}

export function ProductEditorView({ editingProduct }: ProductEditorViewProps) {
  const router = useRouter();
  const createMutation = useCreateAdminProduct();
  const updateMutation = useUpdateAdminProduct();

  const [name, setName] = useState('');
  const [authorOrBrand, setAuthorOrBrand] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [condition, setCondition] = useState<ProductCondition>('NEW');
  const [prelovedGrade, setPrelovedGrade] = useState('Seperti Baru');
  const [conditionNote, setConditionNote] = useState('');
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');
  const [category, setCategory] = useState('Board Books');
  const [subCategory, setSubCategory] = useState('');
  const [ageGroup, setAgeGroup] = useState<PrismaAgeGroup>('ALL_AGES');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [weight, setWeight] = useState('350');
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);

  useEffect(() => {
    if (!editingProduct) return;
    setName(editingProduct.name);
    setAuthorOrBrand(editingProduct.authorOrBrand || '');
    setSku(editingProduct.sku || '');
    setDescription(editingProduct.description || '');
    setImages(Array.isArray(editingProduct.images) ? editingProduct.images : []);
    setCondition(editingProduct.condition || 'NEW');
    setPrelovedGrade(editingProduct.prelovedGrade || 'Seperti Baru');
    setConditionNote(editingProduct.conditionNote || '');
    const nextVars = Array.isArray(editingProduct.variants) ? editingProduct.variants : [];
    setHasVariants(nextVars.length > 0);
    setVariants(nextVars);
    setPublisher(editingProduct.publisher || '');
    setIsbn(editingProduct.isbn || '');
    setPages(editingProduct.pages ? String(editingProduct.pages) : '');
    setCategory(editingProduct.category || 'Board Books');
    setSubCategory(editingProduct.subCategory || '');
    setAgeGroup(editingProduct.ageGroup || 'ALL_AGES');
    setPrice(String(editingProduct.price));
    setOriginalPrice(editingProduct.originalPrice ? String(editingProduct.originalPrice) : '');
    setStock(String(editingProduct.stock));
    setWeight(String(editingProduct.weight || 300));
    setLengthCm(editingProduct.dimensions?.lengthCm ? String(editingProduct.dimensions.lengthCm) : '');
    setWidthCm(editingProduct.dimensions?.widthCm ? String(editingProduct.dimensions.widthCm) : '');
    setHeightCm(editingProduct.dimensions?.heightCm ? String(editingProduct.dimensions.heightCm) : '');
    setFeaturesText(
      Array.isArray(editingProduct.features) ? editingProduct.features.join('\n') : ''
    );
    setIsFeatured(Boolean(editingProduct.isFeatured));
    setIsNewArrival(Boolean(editingProduct.isNewArrival));
    setIsBestSeller(Boolean(editingProduct.isBestSeller));
  }, [editingProduct]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: '', price: Number(price) || 0, stock: Number(stock) || 1, weight: Number(weight) || 300 },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    if (!name.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      toast.error('Product name and selling price are required.');
      return;
    }

    const parsedDimensions =
      lengthCm || widthCm || heightCm
        ? {
            lengthCm: lengthCm ? Number(lengthCm) : null,
            widthCm: widthCm ? Number(widthCm) : null,
            heightCm: heightCm ? Number(heightCm) : null,
          }
        : null;

    const payload: AdminProductPayload = {
      name: name.trim(),
      sku: sku.trim() || null,
      authorOrBrand: authorOrBrand.trim() || null,
      description: description.trim() || `${name.trim()} — curated by BabyShalls Malang.`,
      images: images.length > 0 ? images : ['/images/placeholder-book.jpg'],
      condition,
      prelovedGrade: condition === 'PRELOVED' ? prelovedGrade : null,
      conditionNote: condition === 'PRELOVED' ? conditionNote.trim() || null : null,
      variants: hasVariants ? variants.filter((v) => v.name.trim()) : null,
      publisher: publisher.trim() || null,
      isbn: isbn.trim() || null,
      pages: pages ? Number(pages) : null,
      category: category.trim(),
      subCategory: subCategory.trim() || null,
      ageGroup,
      price: numericPrice,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      stock: condition === 'PRELOVED' ? 1 : Math.max(0, Number(stock) || 0),
      weight: Math.max(1, Number(weight) || 300),
      dimensions: parsedDimensions,
      features: featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      isFeatured,
      isNewArrival,
      isBestSeller,
    };

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, ...payload });
        toast.success(`Product "${payload.name}" updated.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`Product "${payload.name}" created.`);
      }
      router.push('/admin');
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save product.'));
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A2A1C] font-sans">
      <header className="h-[68px] bg-white border-b border-[#E6D2C0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5644] hover:text-[#B05A26]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <span className="text-[#E6D2C0]">|</span>
          <h1 className="text-lg sm:text-xl font-semibold text-[#4A2A1C]">
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </h1>
        </div>
        <button
          type="submit"
          form="product-editor-form"
          disabled={isSaving}
          className="h-9 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
        </button>
      </header>

      <form
        id="product-editor-form"
        onSubmit={handleSubmit}
        className="max-w-[1200px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs"
      >
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Info Dasar */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Basic Information</h2>
            <div>
              <label className="block font-semibold text-[#4A2A1C] mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: The Very Hungry Caterpillar (Board Book)"
                className="w-full h-10 px-3.5 rounded-[4px] border border-[#E6D2C0] focus:outline-none focus:border-[#B05A26]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">Author / Brand</label>
                <input
                  type="text"
                  value={authorOrBrand}
                  onChange={(e) => setAuthorOrBrand(e.target.value)}
                  placeholder="Eric Carle / Melissa & Doug"
                  className="w-full h-10 px-3.5 rounded-[4px] border border-[#E6D2C0] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="BS-BK-0192"
                  className="w-full h-10 px-3.5 rounded-[4px] border border-[#E6D2C0] font-mono focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-[#4A2A1C] mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write description for curated book or educational toy..."
                className="w-full p-3.5 rounded-[4px] border border-[#E6D2C0] focus:outline-none focus:border-[#B05A26]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#4A2A1C] mb-1">
                Product Highlights (1 line per point)
              </label>
              <textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Thick tear-resistant board book pages&#10;Non-toxic child-safe paint"
                className="w-full p-3.5 rounded-[4px] border border-[#E6D2C0] focus:outline-none focus:border-[#B05A26]"
              />
            </div>
          </section>

          {/* Foto Produk */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6">
            <MultiImageUploader
              images={images}
              onChange={setImages}
              folder="babyshalls/products"
              maxImages={8}
              label="Product Photos (Max. 8 photos)"
            />
          </section>

          {/* Kondisi Barang */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Item Condition</h2>
            <div className="inline-flex gap-2">
              {(['NEW', 'PRELOVED'] as ProductCondition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`px-4 py-2 rounded-[4px] font-semibold border cursor-pointer ${
                    condition === c
                      ? 'bg-[#FBE6D8] border-[#B05A26] text-[#B05A26]'
                      : 'bg-white border-[#E6D2C0] text-[#7A5644]'
                  }`}
                >
                  {c === 'NEW' ? 'New' : 'Preloved'}
                </button>
              ))}
            </div>

            {condition === 'PRELOVED' && (
              <div className="p-4 rounded-[4px] bg-[#FFF6EA] border border-[#E6D2C0] space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#4A2A1C]">Grade:</span>
                  {PRELOVED_GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPrelovedGrade(g)}
                      className={`px-3 py-1 rounded-[4px] font-medium border cursor-pointer ${
                        prelovedGrade === g
                          ? 'bg-[#B05A26] text-white border-[#B05A26]'
                          : 'bg-white text-[#4A2A1C] border-[#E6D2C0]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block font-semibold text-[#4A2A1C] mb-1">Condition Notes</label>
                  <textarea
                    rows={2}
                    value={conditionNote}
                    onChange={(e) => setConditionNote(e.target.value)}
                    placeholder="Example: Previous owner name on front page, internal pages 95% pristine."
                    className="w-full p-3 rounded-[4px] bg-white border border-[#E6D2C0]"
                  />
                </div>
                <p className="text-[11px] text-[#7A5644]">
                  Preloved product inventory is automatically locked to 1 unit.
                </p>
              </div>
            )}
          </section>

          {/* Varian */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#4A2A1C]">Product Variants</h2>
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                />
                <span>Product has variants</span>
              </label>
            </div>

            {hasVariants && (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                        )
                      }
                      placeholder="Board Book / Hardcover"
                      className="col-span-4 h-9 px-3 rounded-[4px] border border-[#E6D2C0]"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, price: Number(e.target.value) } : item
                          )
                        )
                      }
                      placeholder="Price"
                      className="col-span-3 h-9 px-3 rounded-[4px] border border-[#E6D2C0]"
                    />
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, stock: Number(e.target.value) } : item
                          )
                        )
                      }
                      placeholder="Stock"
                      className="col-span-2 h-9 px-3 rounded-[4px] border border-[#E6D2C0]"
                    />
                    <input
                      type="number"
                      value={v.weight}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, weight: Number(e.target.value) } : item
                          )
                        )
                      }
                      placeholder="Weight (g)"
                      className="col-span-2 h-9 px-3 rounded-[4px] border border-[#E6D2C0]"
                    />
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                      className="col-span-1 p-2 text-red-600 hover:bg-red-50 rounded-[4px] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="h-9 px-3.5 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#4A2A1C] hover:bg-[#FFF6EA] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Variant
                </button>
              </div>
            )}
          </section>

          {/* Detail Buku */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Book Details (Optional)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">Publisher</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">ISBN</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#4A2A1C] mb-1">Number of Pages</label>
                <input
                  type="number"
                  min={1}
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Visibilitas */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Status &amp; Visibility</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              <span>Show on Home (Featured)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
              <span>Badge New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
              <span>Badge Best Seller</span>
            </label>
          </section>

          {/* Kategori & Usia */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Category &amp; Age Group</h2>
            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              >
                {STOREFRONT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Sub-Category</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Example: Lift-the-flap, Wooden Blocks"
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as PrismaAgeGroup)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              >
                {AGE_GROUPS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Harga & Stok */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Pricing &amp; Stock</h2>
            <div>
              <label className="block font-semibold mb-1">Selling Price (IDR) *</label>
              <CurrencyInput value={price} onChange={setPrice} placeholder="165.000" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Original Price (Optional)</label>
              <CurrencyInput value={originalPrice} onChange={setOriginalPrice} placeholder="195.000" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stock</label>
              <input
                type="number"
                min={0}
                disabled={condition === 'PRELOVED'}
                value={condition === 'PRELOVED' ? '1' : stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0] disabled:bg-gray-100"
              />
            </div>
          </section>

          {/* Pengiriman */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Shipping (Malang Origin)</h2>
            <div>
              <label className="block font-semibold mb-1">Weight (grams) *</label>
              <input
                type="number"
                min={1}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Dimensions L × W × H (cm)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={0}
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  placeholder="L"
                  className="h-10 px-2.5 rounded-[4px] border border-[#E6D2C0]"
                />
                <input
                  type="number"
                  min={0}
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                  placeholder="W"
                  className="h-10 px-2.5 rounded-[4px] border border-[#E6D2C0]"
                />
                <input
                  type="number"
                  min={0}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="H"
                  className="h-10 px-2.5 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

