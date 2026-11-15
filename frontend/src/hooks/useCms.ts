'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface HeroSlideCms {
  id: number;
  badge: string;
  label: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}

export type HomeSectionId =
  | 'hero'
  | 'shop_by_age'
  | 'voucher_promo'
  | 'new_arrivals'
  | 'hampers'
  | 'events'
  | 'reviews';

export const DEFAULT_HOME_SECTION_ORDER: HomeSectionId[] = [
  'hero',
  'shop_by_age',
  'voucher_promo',
  'new_arrivals',
  'hampers',
  'events',
  'reviews',
];

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Hero Carousel',
  shop_by_age: 'Shop by Age',
  voucher_promo: 'Voucher & Flash Sale',
  new_arrivals: 'New In / Terlaris / Preloved',
  hampers: 'Gift Hampers',
  events: 'Workshops & Events',
  reviews: 'Ulasan Orang Tua',
};

export type AboutSectionId =
  | 'banner'
  | 'intro'
  | 'block_1'
  | 'block_2'
  | 'block_3'
  | 'visit';

export const DEFAULT_ABOUT_SECTION_ORDER: AboutSectionId[] = [
  'banner',
  'intro',
  'block_1',
  'block_2',
  'block_3',
  'visit',
];

export const ABOUT_SECTION_LABELS: Record<AboutSectionId, string> = {
  banner: 'Banner Judul Utama',
  intro: 'Paragraf Pengantar',
  block_1: 'Blok Editorial 1 (The Shop)',
  block_2: 'Blok Editorial 2 (The Books & Toys)',
  block_3: 'Blok Editorial 3 (The Community)',
  visit: 'Info Kunjungan & Jam Buka',
};

export interface FaqItemCms {
  id: string;
  q: string;
  a: string;
}

export const DEFAULT_FAQ_ITEMS: FaqItemCms[] = [
  {
    id: 'faq-1',
    q: 'Dari mana pesanan buku dan mainan BabyShalls dikirim?',
    a: 'Seluruh pesanan dikemas dan dikirim langsung dari butik kami di Jl. Cempaka No. 12, Kota Malang menggunakan kurir terintegrasi KiriminAja (JNE, J&T, SiCepat, Pos Indonesia).',
  },
  {
    id: 'faq-2',
    q: 'Apakah layanan bungkus kado (Free Gift Wrapping) benar-benar gratis?',
    a: 'Ya, 100% gratis! Anda dapat mencentang opsi Free Gift Wrapping saat checkout dan menuliskan pesan untuk kartu ucapan tanpa biaya tambahan.',
  },
  {
    id: 'faq-3',
    q: 'Apakah mainan kayu BabyShalls aman jika digigit balita?',
    a: 'Aman. Mainan kayu kami menggunakan kayu solid halus bebas serpihan dan cat water-based non-toxic bersertifikasi SNI dan EN71.',
  },
  {
    id: 'faq-4',
    q: 'Bagaimana proses sanitasi buku dan mainan Preloved Kurasi?',
    a: 'Setiap barang preloved melalui kurasi fisik ketat, dibersihkan dengan cairan food-grade, dan disterilkan menggunakan sinar UV-C sebelum dikemas.',
  },
];

export const DEFAULT_GMAPS_EMBED_URL =
  'https://maps.google.com/maps?q=Jl.%20Cempaka%20No.%2012%2C%20Lowokwaru%2C%20Kota%20Malang&t=&z=15&ie=UTF8&iwloc=&output=embed';

export const DEFAULT_HERO_SLIDES: HeroSlideCms[] = [
  {
    id: 1,
    badge: 'PROMO MINGGU INI • 01 / 03',
    label: '01 Promo Board Book',
    title: 'Diskon 15% Board Book & Mainan Kayu',
    subtitle: 'Gratis bungkus kado & kartu ucapan personal dari BabyShalls Malang. Gunakan kupon BABY15 saat checkout.',
    ctaLabel: 'Lihat Promo →',
    ctaHref: '/catalog',
    image: '/hero-child-reading.jpg',
    imageAlt: 'Anak membaca buku cerita kurasi BabyShalls Malang',
  },
  {
    id: 2,
    badge: 'HAMPERS KURASI • 02 / 03',
    label: '02 Gift Hampers Baru',
    title: 'Gift Hampers Lahiran & Ulang Tahun',
    subtitle: 'Kemasan kotak kain cantik, pita satin, dan kartu ucapan tulis tangan gratis. Siap kirim ke seluruh Indonesia.',
    ctaLabel: 'Pilih Hampers →',
    ctaHref: '/catalog?category=Gift+Hampers',
    image: '/images/hampers-gift.jpg',
    imageAlt: 'Koleksi Gift Hampers BabyShalls Malang',
  },
  {
    id: 3,
    badge: 'WORKSHOP MALANG • 03 / 03',
    label: '03 Workshop Akhir Pekan',
    title: 'Little Explorers: Nature Craft & Storytime',
    subtitle: 'Sesi bermain & bercerita akhir pekan di Jl. Cempaka No. 12, Malang. Kuota terbatas 12 anak per sesi.',
    ctaLabel: 'Beli Tiket Event →',
    ctaHref: '/events',
    image: '/images/event-craft.jpg',
    imageAlt: 'Workshop seni dan cerita anak di BabyShalls Malang',
  },
];

export const DEFAULT_CMS_VALUES: Record<string, string> = {
  announcement_text_1: 'Gratis Bungkus Kado & Kartu Ucapan',
  announcement_text_2: 'Pengiriman Terverifikasi Kota Malang (KiriminAja)',
  announcement_wa_url: 'https://wa.me/6281234567890',
  announcement_wa_label: 'WhatsApp CS',
  home_shop_age_title: 'Shop by Age',
  home_flash_sale_title: 'Flash Sale BabyShalls',
  home_flash_sale_cta: 'Lihat Semua Promo →',
  home_new_tab_new: 'New In!',
  home_new_tab_bestseller: 'Produk Terlaris',
  home_new_tab_preloved: 'Preloved Kurasi',
  home_new_cta: 'Lihat Semua Katalog →',
  hampers_title: 'Gift Hampers',
  hampers_description:
    'Kado kelahiran, ulang tahun, atau acara spesial anak — dirangkai rapi dengan pita katun dan kartu ucapan personal.',
  hampers_image: '/images/hampers-gift.jpg',
  home_events_badge: 'KOMUNITAS MALANG',
  home_events_title: 'Workshops & Events',
  home_events_cta: 'Lihat Semua Jadwal',
  home_reviews_badge: '5.0 / 5.0 dari 500+ Orang Tua',
  home_reviews_title: 'Kata Mereka Tentang BabyShalls',
  about_banner_title: 'Welcome to BabyShalls!',
  about_intro_1:
    'BabyShalls adalah butik kurasi buku anak berbahasa Inggris & Indonesia serta mainan kayu edukasi Montessori yang berlokasi di jantung Kota Malang. Kami menyediakan koleksi baru, preloved higienis bersanitasi UV, hingga paket hampers untuk segala usia anak.',
  about_intro_2:
    'Sedang mencari kado kelahiran atau ulang tahun? Ingin menambah koleksi buku cerita keluarga? Mampir ke butik kami atau jelajahi katalog online untuk menemukan harta karun bacaan si kecil.',
  about_block_1_title: 'The Shop:',
  about_block_1_p1:
    'Berada di kawasan rindang Jl. Cempaka No. 12, Kota Malang, butik BabyShalls dirancang hangat, terang, dan ramah anak. Sementara orang tua memilih buku dan kado, anak-anak bebas menggambar, bermain balok kayu, dan membaca di pojok baca kami.',
  about_block_1_p2: 'Keluarga juga dapat duduk santai bersama mencoba board book sebelum dibawa pulang.',
  about_block_1_image: '/images/store-boutique.jpg',
  about_block_2_title: 'The Books & Toys:',
  about_block_2_p1:
    'Tim kurator kami menghadirkan pilihan board book tebal, picture book klasik, buku sensorik, hingga mainan kayu Montessori bersertifikasi SNI dan EN71.',
  about_block_2_p2:
    'Koleksi kami mencakup tema alam, sains dini, emosi anak, serta barang preloved pilihan yang telah disterilkan dengan sinar UV-C. Mencari judul khusus? Gunakan layanan Request a Book kami.',
  about_block_2_image: '/images/prod-boardbook.jpg',
  about_block_3_title: 'The Community:',
  about_block_3_p1:
    'BabyShalls lebih dari sekadar toko buku. Kami rutin mengadakan sesi storytime akhir pekan, workshop prakarya alam, dan diskusi read-aloud bersama orang tua di Malang.',
  about_block_3_p2: 'Ingin berkolaborasi atau mengadakan kunjungan sekolah? Hubungi kami melalui',
  about_block_3_email: 'hello@babyshalls.id',
  about_block_3_image: '/images/event-craft.jpg',
  about_visit_title: 'Visit us at BabyShalls Malang',
  about_visit_address: 'Jl. Cempaka No. 12, Lowokwaru, Kota Malang, Jawa Timur 65141',
  about_hours_weekday: 'Senin – Jumat: 09:00 – 17:00 WIB',
  about_hours_weekend: 'Sabtu – Minggu: 09:00 – 18:00 WIB',
  footer_gmaps_embed_url: DEFAULT_GMAPS_EMBED_URL,
  social_whatsapp_url: 'https://wa.me/6281234567890',
  social_instagram_url: 'https://instagram.com/babyshalls.id',
  social_tiktok_url: 'https://tiktok.com/@babyshalls.id',
  social_email: 'hello@babyshalls.id',
  faq_page_title: 'Tanya Jawab (FAQ)',
  faq_page_subtitle: 'Informasi seputar pengiriman dari Malang, gift wrapping, dan keamanan mainan anak.',
  faq_wa_title: 'Masih ada pertanyaan lain?',
  faq_wa_subtitle: 'Tim CS BabyShalls Malang siap membantu via WhatsApp.',
  faq_wa_url: 'https://wa.me/6281234567890',
};

export function usePublicCms() {
  return useQuery<Record<string, string>>({
    queryKey: ['public-cms'],
    staleTime: 60_000,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Record<string, string> }>('/cms');
      return res.data.data || {};
    },
  });
}

export function parseHeroSlides(rawJson?: string): HeroSlideCms[] {
  if (!rawJson) return DEFAULT_HERO_SLIDES;
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_HERO_SLIDES;
}

export function parseSectionOrder<T extends string>(rawJson: string | undefined, defaults: T[]): T[] {
  if (!rawJson) return defaults;
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed)) {
      const validSet = new Set(defaults);
      const filtered = parsed.filter((item): item is T => typeof item === 'string' && validSet.has(item as T));
      const missing = defaults.filter((item) => !filtered.includes(item));
      const merged = [...filtered, ...missing];
      if (merged.length > 0) return merged;
    }
  } catch {
    // fallback
  }
  return defaults;
}

export function parseFaqItems(rawJson?: string): FaqItemCms[] {
  if (!rawJson) return DEFAULT_FAQ_ITEMS;
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(
        (item): item is FaqItemCms =>
          item &&
          typeof item === 'object' &&
          typeof item.q === 'string' &&
          typeof item.a === 'string' &&
          item.q.trim().length > 0
      );
      if (valid.length > 0) return valid;
    }
  } catch {
    // fallback
  }
  return DEFAULT_FAQ_ITEMS;
}

/**
 * Extract a safe Google Maps embed URL from either a direct URL or a pasted <iframe src="..."> snippet.
 */
export function extractGmapsEmbedUrl(raw?: string): string {
  const value = (raw || '').trim();
  if (!value) return DEFAULT_GMAPS_EMBED_URL;

  const iframeMatch = value.match(/src=["']([^"']+)["']/i);
  const candidate = (iframeMatch ? iframeMatch[1] : value).trim();

  if (/^https:\/\/(www\.)?(google\.com|maps\.google\.com)\/maps/i.test(candidate)) {
    return candidate;
  }
  return DEFAULT_GMAPS_EMBED_URL;
}
