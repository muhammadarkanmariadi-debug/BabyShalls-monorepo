'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface HeroSlideCms {
  id: number;
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
    label: '01 Buku & Mainan Kurasi',
    title: 'Buku & mainan\npilihan untuk si kecil',
    subtitle:
      'Dari newborn sampai 6+ tahun, dipilih tim kami di Malang. Kirim ke seluruh Indonesia atau ambil langsung di toko.',
    ctaLabel: 'Belanja Sekarang',
    ctaHref: '/shop',
    image: '/images/hero/slide-1.jpg',
    imageAlt: 'Koleksi buku dan mainan pilihan BabyShalls Malang',
  },
  {
    id: 2,
    label: '02 Gift Hampers Baru',
    title: 'Gift Hampers Lahiran & Ulang Tahun',
    subtitle:
      'Kemasan kotak kain cantik, pita satin, dan kartu ucapan tulis tangan gratis. Siap kirim ke seluruh Indonesia.',
    ctaLabel: 'Pilih Hampers',
    ctaHref: '/hampers',
    image: '/images/hero/slide-2.jpg',
    imageAlt: 'Koleksi Gift Hampers BabyShalls Malang',
  },
  {
    id: 3,
    label: '03 Workshop Akhir Pekan',
    title: 'Little Explorers: Nature Craft & Storytime',
    subtitle:
      'Sesi bermain & bercerita akhir pekan di Citraland Puncak Tidar Blok HH-26, Malang. Kuota terbatas per sesi.',
    ctaLabel: 'Lihat Event',
    ctaHref: '/events',
    image: '/images/hero/slide-3.jpg',
    imageAlt: 'Workshop seni dan cerita anak di BabyShalls Malang',
  },
  {
    id: 4,
    label: '04 Preloved Berkualitas',
    title: 'Buku Preloved Bersih & Steril UV-C',
    subtitle:
      'Kurasi buku anak impor kondisi 90–98% seperti baru, sudah disterilisasi sinar UV-C dan siap menemani waktu baca.',
    ctaLabel: 'Lihat Preloved',
    ctaHref: '/preloved',
    image: '/images/hero/slide-4.jpg',
    imageAlt: 'Koleksi buku preloved steril UV-C di BabyShalls Malang',
  },
];

export const DEFAULT_CMS_VALUES: Record<string, string> = {
  announcement_text_1: 'Gratis Bungkus Kado & Kartu Ucapan',
  announcement_text_2: 'Pengiriman Terverifikasi Kota Malang (KiriminAja)',
  announcement_wa_url: 'https://wa.me/6281234567890',
  announcement_wa_label: 'WhatsApp CS',
  hampers_title: 'HAMPERS UNTUK SETIAP MOMEN',
  hampers_description:
    'Paket buku dan mainan siap kado, dipilih sesuai usia si kecil. Gratis bungkus dan kartu ucapan.',
  hampers_image: '/images/hampers-gift.jpg',
  about_banner_title: 'Toko Buku Anak & Mainan Edukasi di Malang Sejak 2020',
  about_intro_1:
    'BabyShalls bermula dari kecintaan seorang ibu di Malang yang kesulitan menemukan buku anak berkualitas, ramah sensori, dan kurasi bermakna untuk tumbuh kembang buah hatinya. Didirikan pada tahun 2020 di Citraland Puncak Tidar, BabyShalls hadir sebagai butik buku independen dan ruang belajar hangat bagi keluarga.',
  about_intro_2:
    'BabyShalls adalah butik toko buku anak dan mainan edukatif di Malang. Didirikan dengan misi menghadirkan buku cerita bergambar berkualitas internasional dan mainan sensorik ramah anak yang dapat dinikmati bersama keluarga tercinta.',
  about_block_1_title: 'The Shop:',
  about_block_1_p1:
    'Berada di kawasan Citraland Puncak Tidar Blok HH-26, Kota Malang, butik BabyShalls dirancang hangat, terang, dan ramah anak. Sementara orang tua memilih buku dan kado, anak-anak bebas menggambar, bermain balok kayu, dan membaca di pojok baca kami.',
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
  about_block_3_email: 'halo@babyshalls.com',
  about_block_3_image: '/images/event-craft.jpg',
  about_visit_title: 'Visit us at BabyShalls Malang',
  about_visit_address: 'Citraland Puncak Tidar Blok HH-26, Kota Malang, Jawa Timur 65146',
  about_hours_weekday: 'Setiap hari 10.00 – 17.00 WIB',
  about_hours_weekend: 'Setiap hari 10.00 – 17.00 WIB',
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

