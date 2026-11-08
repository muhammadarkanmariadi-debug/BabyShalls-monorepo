export type AgeGroup = 'Newborn+' | 'Ages 1-3' | 'Ages 3+' | 'Ages 6+';

export type ProductCategory = 
  | 'Board Books' 
  | 'Picture Books' 
  | 'Sound & Sensory' 
  | 'Wooden Toys' 
  | 'Gift Hampers' 
  | 'Early Readers'
  | 'Preloved Kurasi'
  | 'Preloved';

export interface Product {
  id: string;
  slug: string;
  title: string;
  authorOrBrand?: string;
  price: number;
  originalPrice?: number;
  weightInGrams: number;
  ageGroup: AgeGroup;
  category: ProductCategory;
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  features?: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isPreloved?: boolean;
  condition?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WorkshopEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  ageRecommendation: string;
  price: number;
  quota: number;
  remainingQuota: number;
  speaker: string;
  description: string;
  image: string;
  category?: 'Storytelling & Art' | 'Sensory & Wooden Play' | 'Parenting & Read-Aloud' | 'Special Weekend';
  includes?: string[];
  status?: 'OPEN' | 'LIMITED' | 'FULL';
  bannerUrl?: string;
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

