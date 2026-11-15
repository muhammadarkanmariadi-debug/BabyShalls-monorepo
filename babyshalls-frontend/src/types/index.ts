export type AgeGroup =
  | 'All Ages'
  | '0–2 Years'
  | '3–5 Years'
  | '6+ Years'
  | '0–1 Years'
  | '1–3 Years'
  | '0-2 Years'
  | '3-5 Years'
  | '0–2 tahun'
  | '3–5 tahun'
  | '6+ tahun'
  | '3+ tahun'
  | 'Newborn+'
  | 'Ages 1-3'
  | 'Ages 3+'
  | 'Ages 6+'
  | (string & {});

export type ProductCategory =
  | 'All Products'
  | 'Board Books'
  | 'Picture Books'
  | 'Educational Toys'
  | 'Hampers'
  | 'Gift Hampers'
  | 'Sound & Sensory'
  | 'Wooden Toys'
  | 'Early Readers'
  | 'Preloved Kurasi'
  | 'Preloved'
  | 'Preloved Item'
  | (string & {});

export interface Product {
  id: string;
  slug?: string;
  title: string;
  author?: string;
  authorOrBrand?: string;
  category: string;
  ageGroup: AgeGroup;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  coverImage?: string;
  images?: string[];
  description: string;
  inStock?: boolean;
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  weightInGrams?: number;
  featured?: boolean;
  badge?: string; // e.g. "New", "Bestseller", "Staff Pick"
  condition?: 'baru' | 'preloved' | string;
  isPreloved?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  features?: string[];
  tags?: string[];
  pages?: string;
  publisher?: string;
  staffNote?: string;
  excerpt?: string;
  language?: string;
  moralTheme?: string;
  format?: string;
  isbn?: string;
  dimensions?: string;
  weight?: string;
  publicationYear?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'curator' | 'store_manager' | 'superadmin' | 'USER' | 'ADMIN';
  token?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GiftWrappingState {
  birthdayCard: boolean;
  cardMessage: string;
  customRibbon: boolean;
  signatureBox: boolean;
}

export interface WorkshopEvent {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  location: string;
  ageRecommendation?: string;
  price: number;
  capacity?: number;
  quota?: number;
  remainingQuota?: number;
  seatsLeft?: number;
  speaker?: string;
  facilitator?: string;
  description?: string;
  image: string;
  bannerUrl?: string;
  category?: string;
  includes?: string[];
  status?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  childAgeInfo: string;
  rating: number;
  comment: string;
  date: string;
  productPurchased?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  receiverName: string;
  receiverPhone: string;
  streetAddress: string;
  subdistrict: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface DiscountVoucher {
  code: string;
  title: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  description: string;
}
