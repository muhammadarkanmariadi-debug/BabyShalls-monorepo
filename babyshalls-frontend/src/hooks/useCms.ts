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
  hampers_title: 'Gift Hampers',
  hampers_description:
    'Kado kelahiran, ulang tahun, atau acara spesial anak — dirangkai rapi dengan pita katun dan kartu ucapan personal.',
  hampers_image: '/images/hampers-gift.jpg',
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

