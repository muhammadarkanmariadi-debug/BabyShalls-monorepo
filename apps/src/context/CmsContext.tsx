'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { DEFAULT_HERO_SLIDES, HeroSlideCms, parseHeroSlides, usePublicCms } from '@/hooks/useCms';

export interface CmsPillar {
  title: string;
  desc: string;
}

export interface CmsFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isActive?: boolean;
}

export interface CmsPrelovedStep {
  step: string;
  title: string;
  desc: string;
}

export interface CmsData {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryCtaText: string;
    heroSecondaryCtaText: string;
    heroImage?: string;
    heroBgColor?: string;
    heroSlides?: HeroSlideCms[];
    ageBannerTitle: string;
    ageBannerSubtitle: string;
    ageBannerButtonText: string;
    ageBannerBgColor?: string;
    ageBannerImage?: string;
    hampersBannerTitle: string;
    hampersBannerSubtitle: string;
    hampersBannerButtonText: string;
    hampersBannerImage?: string;
    hampersBannerBgColor?: string;
    requestCardTitle: string;
    requestCardSubtitle: string;
    requestCardButtonText: string;
    storeVisitTitle: string;
    storeVisitSubtitle: string;
    storeVisitButtonText: string;
  };
  about: {
    badge: string;
    title: string;
    heroImage?: string;
    heroBgColor?: string;
    storyParagraph1: string;
    storyParagraph2: string;
    storyParagraph3: string;
    vision: string;
    mission: string;
    galleryTitle?: string;
    gallerySubtitle?: string;
    description?: string;
    pillars: CmsPillar[];
  };
  faq: CmsFaqItem[];
  preloved: {
    guaranteeTitle: string;
    guaranteeSubtitle: string;
    sterilizationNotice: string;
    steps: CmsPrelovedStep[];
    badge?: string;
    title?: string;
    description?: string;
    uvNotice?: string;
    guarantees?: { title: string; desc: string }[];
  };
  store: {
    storeName: string;
    address: string;
    city: string;
    operatingHours: string;
    openingHours?: string;
    whatsappNumber: string;
    whatsappCommunityUrl: string;
    instagramHandle: string;
    instagramUrl: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
    googleMapsUrl: string;
    phone?: string;
    email?: string;
  };
}

export const initialCmsData: CmsData = {
  home: {
    heroTitle: 'Curated books & toys\nfor your little ones',
    heroSubtitle:
      'From newborn to 6+ years, handpicked by our team in Malang. Shipped nationwide or available for in-store pickup.',
    heroPrimaryCtaText: 'Shop Now',
    heroSecondaryCtaText: 'Explore Preloved',
    heroImage: '/images/hero/slide-1.jpg',
    heroBgColor: '#FFF6EA',
    heroSlides: DEFAULT_HERO_SLIDES,
    ageBannerTitle: 'Find books by age milestone',
    ageBannerSubtitle: 'From newborn to 6+ years, choose books and toys that fit perfectly.',
    ageBannerButtonText: 'SHOP BY AGE',
    ageBannerBgColor: '#B05A26',
    ageBannerImage: '',
    hampersBannerTitle: 'HAMPERS FOR EVERY MOMENT',
    hampersBannerSubtitle:
      'Ready-to-gift book and toy sets, selected for each milestone. Complimentary gift wrapping and handwritten greeting card included.',
    hampersBannerButtonText: 'EXPLORE HAMPERS',
    hampersBannerImage: '/images/hampers-gift.jpg',
    hampersBannerBgColor: '#FFFBF5',
    requestCardTitle: 'Looking for a title\nnot in our catalog?',
    requestCardSubtitle: 'Tell us the title or author, and our team will help source it and notify you via WhatsApp.',
    requestCardButtonText: 'Request a Book',
    storeVisitTitle: 'Visit our boutique',
    storeVisitSubtitle:
      'Citraland Puncak Tidar HH-26, Malang. Complimentary sensory play area and reading rug for little ones.',
    storeVisitButtonText: 'Get Directions',
  },
  about: {
    badge: 'About BabyShalls',
    title: 'Children’s Bookstore & Educational Toys in Malang Since 2020',
    storyParagraph1:
      'BabyShalls began from a mother’s search in Malang for quality, sensory-friendly children’s books and meaningful curation to support her child’s growth. Founded in 2020 at Citraland Puncak Tidar, BabyShalls stands as an independent boutique bookstore and cozy learning haven for families.',
    storyParagraph2:
      'More than a bookstore, BabyShalls is a house of imagination where children can read freely on soft rugs, explore non-toxic certified wooden toys, and join weekend sensory and storytelling workshops with their parents.',
    storyParagraph3:
      'We carefully curate every single title—from award-winning local literature to classic imported board books—ensuring gentle language, engaging illustrations, and meaningful moral themes that spark curiosity.',
    vision:
      'To be Indonesia’s trusted companion for parents in nurturing a lifelong love of reading and imagination from day one.',
    mission:
      'To provide the finest curation of children’s books and educational toys, create a family-friendly community space in Malang, and offer warm, reliable digital e-commerce services.',
    galleryTitle: 'Visit Our Physical Boutique in Citraland Malang',
    gallerySubtitle: 'Experience storytime together with your little one in our cozy reading corner and hygienic sensory play area.',
    description: 'BabyShalls is a boutique children’s bookstore and educational toy shop in Malang. Dedicated to bringing world-class illustrated picture books and non-toxic sensory toys for families to enjoy together.',
    pillars: [
      {
        title: 'Rigorous Child-Safe Curation',
        desc: 'Tear-resistant thick board pages, rounded safe corners for toddlers, and non-toxic water-based paints.',
      },
      {
        title: 'Complimentary In-Store Play Area',
        desc: 'Our Citraland Puncak Tidar boutique features a complimentary storybook reading rug and sensory play table.',
      },
      {
        title: 'Community & Regular Workshops',
        desc: 'Regular read-aloud classes, nature crafts, and tailored book curation guides by developmental stage.',
      },
    ],
  },
  faq: [
    {
      id: 'faq-1',
      category: 'shopping',
      question: 'How do I place an order at BabyShalls?',
      answer:
        'Select your favorite books or toys from the catalog, specify the quantity, and click "+ Add to Cart". On the checkout page, enter your delivery address and choose your payment method (QRIS, Virtual Account, or Credit Card). Our Malang team will carefully prepare and dispatch your package.',
    },
    {
      id: 'faq-2',
      category: 'shopping',
      question: 'Can I include a gift wrap and handwritten greeting card?',
      answer:
        'Absolutely! In the Cart and Checkout pages, check the gift packaging option. We provide custom handwritten greeting cards with your personal message and our signature BabyShalls gift box.',
    },
    {
      id: 'faq-3',
      category: 'shipping',
      question: 'What courier options are available?',
      answer:
        'We partner with verified couriers via KiriminAja (JNE, J&T, SiCepat) for nationwide shipping. For the Greater Malang area, instant same-day delivery via GoSend / GrabExpress is available. You can also choose "Self Pick-up at Citraland Malang Boutique" with zero shipping fee.',
    },
    {
      id: 'faq-4',
      category: 'shipping',
      question: 'Where can I track my shipment waybill number?',
      answer:
        'The waybill tracking number updates automatically under My Account > Order History as soon as the courier picks up the package. You will also receive dispatch status notifications.',
    },
    {
      id: 'faq-5',
      category: 'returns',
      question: 'What if a book arrives damaged or has printing defects?',
      answer:
        'We provide a 100% replacement guarantee for misprinted or transit-damaged books. Simply take a photo of the defect and contact our admin via WhatsApp within 48 hours of delivery.',
    },
    {
      id: 'faq-6',
      category: 'events',
      question: 'How does workshop registration and QR e-ticketing work?',
      answer:
        'Visit the Workshops & Events page, choose your desired session, and complete the registration form. An instant QR e-ticket will be generated in your account. On workshop day at our Citraland Malang boutique, simply show the QR code at the counter for quick check-in.',
    },
  ],
  preloved: {
    badge: 'CURATED PRELOVED SELECTION',
    title: 'Quality Preloved Children’s Books, Clean & UV-Sterilized',
    description:
      'Every preloved book undergoes a 5-step curation process: complete page inspection, child-friendly sanitization, UV-C lamp sterilization, and honest condition grading.',
    uvNotice: 'All preloved books are sterilized with medical-grade UV-C lamps & sanitized with child-safe cleaners.',
    guaranteeTitle: 'Preloved Cleanliness & Curation Guarantee',
    guaranteeSubtitle:
      'Every preloved book passes 3 stages of sterilization before reaching your child’s hands.',
    sterilizationNotice:
      'Every preloved book is sanitized using UV-C light and food-grade cleaners safe for toddlers.',
    guarantees: [
      { title: 'UV-C Sterilization', desc: 'Free from germs & bacteria' },
      { title: '100% Complete Pages', desc: 'No disruptive scribbles' },
      { title: 'Save Up to 60%', desc: '90–98% like-new condition' },
    ],
    steps: [
      {
        step: '01',
        title: 'Page Inspection',
        desc: 'Thoroughly checked for missing pages, excessive scribbles, or torn flaps.',
      },
      {
        step: '02',
        title: 'Food-Grade Cleansing',
        desc: 'Covers and board edges are cleaned with natural, child-friendly sanitizers.',
      },
      {
        step: '03',
        title: 'UV-C Light Sterilization',
        desc: 'Books are placed inside a UV-C cabinet to eliminate 99.9% of bacteria and germs.',
      },
    ],
  },
  store: {
    storeName: "Baby Shall's",
    address: 'Citraland Puncak Tidar Blok HH-26, Malang',
    city: 'Kota Malang, Jawa Timur 65146',
    operatingHours: 'Daily 10:00 AM – 5:00 PM WIB',
    openingHours: 'Daily 10:00 AM – 5:00 PM WIB',
    phone: '0812-3456-7890',
    email: 'halo@babyshalls.com',
    whatsappNumber: '6281234567890',
    whatsappCommunityUrl:
      'https://wa.me/6281234567890?text=Hello%20BabyShalls,%20I%20would%20like%20to%20join%20the%20community%20group%20for%20catalog%20and%20events.',
    instagramHandle: '@babyshalls',
    instagramUrl: 'https://instagram.com/babyshalls',
    youtubeUrl: 'https://youtube.com/@babyshalls',
    tiktokUrl: 'https://tiktok.com/@babyshalls',
    googleMapsUrl: 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang',
  },
};

interface CmsContextType {
  cms: CmsData;
  updateCms: (sectionOrFull: keyof CmsData | Partial<CmsData>, data?: any) => void;
  resetCmsToDefault: () => void;
  addFaqItem: (item: Omit<CmsFaqItem, 'id'>) => void;
  updateFaqItem: (id: string, updated: Partial<CmsFaqItem>) => void;
  deleteFaqItem: (id: string) => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

function mergeSiteContentToCmsData(base: CmsData, siteContent?: Record<string, string>): CmsData {
  if (!siteContent || Object.keys(siteContent).length === 0) return base;

  let nextBase = base;
  if (siteContent.cms_data_json) {
    try {
      const parsed = JSON.parse(siteContent.cms_data_json) as Partial<CmsData>;
      nextBase = {
        ...base,
        ...parsed,
        home: { ...base.home, ...(parsed.home || {}) },
        about: { ...base.about, ...(parsed.about || {}) },
        preloved: { ...base.preloved, ...(parsed.preloved || {}) },
        store: { ...base.store, ...(parsed.store || {}) },
        faq: Array.isArray(parsed.faq) ? parsed.faq : base.faq,
      };
    } catch {
      // ignore invalid json
    }
  }

  const slides = siteContent.hero_slides_json ? parseHeroSlides(siteContent.hero_slides_json) : null;
  const firstSlide = slides?.[0];
  const waMatch = siteContent.announcement_wa_url?.match(/wa\.me\/(\d+)/);

  return {
    ...nextBase,
    home: {
      ...nextBase.home,
      ...(slides ? { heroSlides: slides } : {}),
      ...(firstSlide
        ? {
            heroTitle: firstSlide.title || nextBase.home.heroTitle,
            heroSubtitle: firstSlide.subtitle || nextBase.home.heroSubtitle,
            heroPrimaryCtaText: firstSlide.ctaLabel || nextBase.home.heroPrimaryCtaText,
            heroImage: firstSlide.image || nextBase.home.heroImage,
          }
        : {}),
      ...(siteContent.hampers_title ? { hampersBannerTitle: siteContent.hampers_title } : {}),
      ...(siteContent.hampers_description ? { hampersBannerSubtitle: siteContent.hampers_description } : {}),
      ...(siteContent.hampers_image ? { hampersBannerImage: siteContent.hampers_image } : {}),
    },
    about: {
      ...nextBase.about,
      ...(siteContent.about_banner_title ? { title: siteContent.about_banner_title } : {}),
      ...(siteContent.about_intro_1 ? { storyParagraph1: siteContent.about_intro_1 } : {}),
      ...(siteContent.about_intro_2 ? { description: siteContent.about_intro_2 } : {}),
      ...(siteContent.about_block_1_p1 ? { storyParagraph2: siteContent.about_block_1_p1 } : {}),
      ...(siteContent.about_block_2_p1 ? { storyParagraph3: siteContent.about_block_2_p1 } : {}),
    },
    store: {
      ...nextBase.store,
      ...(siteContent.about_visit_address ? { address: siteContent.about_visit_address } : {}),
      ...(siteContent.about_hours_weekday
        ? { operatingHours: siteContent.about_hours_weekday, openingHours: siteContent.about_hours_weekday }
        : {}),
      ...(siteContent.about_block_3_email ? { email: siteContent.about_block_3_email } : {}),
      ...(waMatch?.[1] ? { whatsappNumber: waMatch[1] } : {}),
    },
  };
}

export const CmsProvider = ({ children }: { children: ReactNode }) => {
  const [cms, setCms] = useState<CmsData>(initialCmsData);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: publicSiteContent } = usePublicCms();

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('babyshalls_cms_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCms({
          ...initialCmsData,
          ...parsed,
          home: { ...initialCmsData.home, ...(parsed.home || {}) },
          about: { ...initialCmsData.about, ...(parsed.about || {}) },
          preloved: { ...initialCmsData.preloved, ...(parsed.preloved || {}) },
          store: { ...initialCmsData.store, ...(parsed.store || {}) },
          faq: parsed.faq && Array.isArray(parsed.faq) ? parsed.faq : initialCmsData.faq,
        });
      }
    } catch {
      // Fallback
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever updated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('babyshalls_cms_data', JSON.stringify(cms));
    } catch {
      // Fallback
    }
  }, [cms, isHydrated]);

  const updateCms = (sectionOrFull: keyof CmsData | Partial<CmsData>, data?: any) => {
    if (typeof sectionOrFull === 'string') {
      setCms((prev) => ({
        ...prev,
        [sectionOrFull]: {
          ...(prev[sectionOrFull] as any),
          ...data,
        },
      }));
    } else {
      setCms((prev) => ({
        ...prev,
        ...sectionOrFull,
      }));
    }
  };

  const resetCmsToDefault = () => {
    setCms(initialCmsData);
    try {
      localStorage.removeItem('babyshalls_cms_data');
    } catch {
      // Fallback
    }
  };

  const addFaqItem = (item: Omit<CmsFaqItem, 'id'>) => {
    const newItem: CmsFaqItem = {
      ...item,
      id: `faq-${Date.now()}`,
    };
    setCms((prev) => ({
      ...prev,
      faq: [...prev.faq, newItem],
    }));
  };

  const updateFaqItem = (id: string, updated: Partial<CmsFaqItem>) => {
    setCms((prev) => ({
      ...prev,
      faq: prev.faq.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFaqItem = (id: string) => {
    setCms((prev) => ({
      ...prev,
      faq: prev.faq.filter((f) => f.id !== id),
    }));
  };

  const mergedCms = useMemo(
    () => mergeSiteContentToCmsData(cms, publicSiteContent),
    [cms, publicSiteContent]
  );

  return (
    <CmsContext.Provider
      value={{
        cms: mergedCms,
        updateCms,
        resetCmsToDefault,
        addFaqItem,
        updateFaqItem,
        deleteFaqItem,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    // Graceful fallback for non-provider renders
    return {
      cms: initialCmsData,
      updateCms: () => {},
      resetCmsToDefault: () => {},
      addFaqItem: () => {},
      updateFaqItem: () => {},
      deleteFaqItem: () => {},
    };
  }
  return context;
};
