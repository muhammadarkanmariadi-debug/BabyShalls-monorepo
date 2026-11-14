export type AgeGroup = 'All Ages' | '0–2 Years' | '3–5 Years' | '6+ Years';

export type ProductCategory =
  | 'All Products'
  | 'Board Books'
  | 'Picture Books'
  | 'Educational Toys'
  | 'Hampers'
  | 'Preloved Item';

export interface Product {
  id: string;
  title: string;
  author: string;
  category: Exclude<ProductCategory, 'All Products'>;
  ageGroup: AgeGroup;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  coverImage: string;
  images?: string[];
  description: string;
  inStock: boolean;
  featured?: boolean;
  badge?: string; // e.g. "New", "Bestseller", "Staff Pick"
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
  role: 'curator' | 'store_manager' | 'superadmin';
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
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  image: string;
}
