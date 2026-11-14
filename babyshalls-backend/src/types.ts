export type AgeGroup = 'All Ages' | '0–2 Years' | '3–5 Years' | '6+ Years';

export type ProductCategory =
  | 'Board Books'
  | 'Picture Books'
  | 'Educational Toys'
  | 'Hampers';

export interface Product {
  id: string;
  title: string;
  author: string;
  category: ProductCategory;
  ageGroup: AgeGroup;
  price: number;
  coverImage: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  badge?: string;
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
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'curator' | 'store_manager' | 'superadmin';
  token?: string;
}

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  price: number;
  slotsAvailable: number;
  image: string;
  description: string;
  highlights: string[];
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface GiftWrappingOptions {
  birthdayCard: boolean;
  cardMessage?: string;
  customRibbon: boolean;
  signatureBox: boolean;
}

export interface OrderRequest {
  customerName: string;
  phoneNumber?: string;
  deliveryMethod: 'pickup' | 'gosend' | 'shipping';
  deliveryAddress?: string;
  items: OrderItem[];
  giftOptions: GiftWrappingOptions;
  notes?: string;
}

export interface OrderResponse extends OrderRequest {
  id: string;
  subtotal: number;
  giftWrappingCost: number;
  total: number;
  status: 'pending_whatsapp' | 'confirmed' | 'fulfilled';
  createdAt: string;
}

