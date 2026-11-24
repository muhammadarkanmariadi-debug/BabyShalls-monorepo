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
    label: '01 Curated Books & Toys',
    title: 'Curated books & toys\nfor your little ones',
    subtitle:
      'From newborn to 6+ years, handpicked by our team in Malang. Shipped nationwide or available for in-store pickup.',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
    image: '/images/hero/slide-1.jpg',
    imageAlt: 'Curated collection of books and toys by BabyShalls Malang',
  },
  {
    id: 2,
    label: '02 Special Gift Hampers',
    title: 'Delightful Hampers for Precious Moments',
    subtitle:
      'Beautiful keepsake boxes with satin ribbons and handwritten greeting cards. Ready to ship nationwide.',
    ctaLabel: 'Explore Hampers',
    ctaHref: '/shop?category=Hampers',
    image: '/images/hero/slide-2.jpg',
    imageAlt: 'Curated Gift Hampers Collection by BabyShalls Malang',
  },
  {
    id: 3,
    label: '03 Weekend Workshops',
    title: 'Little Explorers: Nature Craft & Storytime',
    subtitle:
      'Weekend play & storytelling sessions at Citraland Puncak Tidar Blok HH-26, Malang. Limited spots per session.',
    ctaLabel: 'View Events',
    ctaHref: '/events',
    image: '/images/hero/slide-3.jpg',
    imageAlt: 'Children arts and storytelling workshop at BabyShalls Malang',
  },
  {
    id: 4,
    label: '04 Curated Preloved',
    title: 'UV-C Sanitized Curated Preloved Books',
    subtitle:
      'Handpicked imported children’s books in 90–98% like-new condition, thoroughly UV-C sanitized and ready for reading time.',
    ctaLabel: 'Shop Preloved',
    ctaHref: '/shop?category=Preloved',
    image: '/images/hero/slide-4.jpg',
    imageAlt: 'UV-C sanitized preloved books collection at BabyShalls Malang',
  },
];

export const DEFAULT_CMS_VALUES: Record<string, string> = {
  announcement_text_1: 'Complimentary Gift Wrap & Handwritten Card',
  announcement_text_2: 'Verified Malang Courier Shipping (KiriminAja)',
  announcement_wa_url: 'https://wa.me/6281234567890',
  announcement_wa_label: 'WhatsApp CS',
  hampers_title: 'HAMPERS FOR EVERY SPECIAL MOMENT',
  hampers_description:
    'Ready-to-gift book and wooden toy sets, customized for each age milestone. Complimentary gift wrapping and handwritten card included.',
  hampers_image: '/images/hampers-gift.jpg',
  about_banner_title: 'Children’s Bookstore & Educational Toys in Malang Since 2020',
  about_intro_1:
    'BabyShalls began from a mother’s search in Malang for quality, sensory-friendly children’s books and meaningful curation to support her child’s growth. Founded in 2020 at Citraland Puncak Tidar, BabyShalls stands as an independent boutique bookstore and cozy learning haven for families.',
  about_intro_2:
    'BabyShalls is a curated boutique bookstore and educational toy shop in Malang. We are dedicated to bringing world-class illustrated picture books and non-toxic sensory toys for families to cherish together.',
  about_block_1_title: 'The Shop:',
  about_block_1_p1:
    'Located at Citraland Puncak Tidar Blok HH-26, Malang, our boutique is designed to be warm, bright, and child-friendly. While parents browse books and gift sets, children are welcome to draw, play with wooden blocks, and read in our cozy reading corner.',
  about_block_1_p2: 'Families can relax together on our story rug and explore board books before taking them home.',
  about_block_1_image: '/images/store-boutique.jpg',
  about_block_2_title: 'The Books & Toys:',
  about_block_2_p1:
    'Our curation team selects thick board books, classic picture books, sound & sensory titles, and SNI/EN71-certified Montessori wooden toys.',
  about_block_2_p2:
    'Our collection covers nature themes, early STEM, emotional literacy, and preloved titles sanitized with UV-C light. Looking for a rare title? Use our Request a Book service.',
  about_block_2_image: '/images/prod-boardbook.jpg',
  about_block_3_title: 'The Community:',
  about_block_3_p1:
    'BabyShalls is more than a bookstore. We host regular weekend storytime sessions, nature craft workshops, and read-aloud circles for parents in Malang.',
  about_block_3_p2: 'Interested in collaborations or school visits? Reach out to us at',
  about_block_3_email: 'halo@babyshalls.com',
  about_block_3_image: '/images/event-craft.jpg',
  about_visit_title: 'Visit us at BabyShalls Malang',
  about_visit_address: 'Citraland Puncak Tidar Blok HH-26, Malang City, East Java 65146',
  about_hours_weekday: 'Daily 10:00 AM – 5:00 PM WIB',
  about_hours_weekend: 'Daily 10:00 AM – 5:00 PM WIB',
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

