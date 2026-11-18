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
    heroTitle: 'Buku & mainan\npilihan untuk si kecil',
    heroSubtitle:
      'Dari newborn sampai 6+ tahun, dipilih tim kami di Malang. Kirim ke seluruh Indonesia atau ambil langsung di toko.',
    heroPrimaryCtaText: 'Belanja Sekarang',
    heroSecondaryCtaText: 'Lihat Preloved',
    heroImage: '/images/hero/slide-1.jpg',
    heroBgColor: '#FFF6EA',
    heroSlides: DEFAULT_HERO_SLIDES,
    ageBannerTitle: 'Cari buku sesuai usia si kecil',
    ageBannerSubtitle: 'Dari newborn sampai 6+ tahun, pilih buku dan mainan yang pas.',
    ageBannerButtonText: 'BELANJA PER USIA',
    ageBannerBgColor: '#B05A26',
    ageBannerImage: '',
    hampersBannerTitle: 'HAMPERS UNTUK SETIAP MOMEN',
    hampersBannerSubtitle:
      'Paket buku dan mainan siap kado, dipilih sesuai usia si kecil. Gratis bungkus dan kartu ucapan.',
    hampersBannerButtonText: 'LIHAT HAMPERS',
    hampersBannerImage: '/images/hampers-gift.jpg',
    hampersBannerBgColor: '#FFFBF5',
    requestCardTitle: 'Buku yang kamu\ncari belum ada?',
    requestCardSubtitle: 'Tulis judul atau penulisnya, kami bantu carikan dan kabari lewat WhatsApp.',
    requestCardButtonText: 'Request Buku',
    storeVisitTitle: 'Kunjungi toko kami',
    storeVisitSubtitle:
      'Citraland Puncak Tidar HH-26, Malang. Ada area bermain gratis untuk si kecil.',
    storeVisitButtonText: 'Petunjuk Arah',
  },
  about: {
    badge: 'Tentang BabyShalls',
    title: 'Toko Buku Anak & Mainan Edukasi di Malang Sejak 2020',
    storyParagraph1:
      'BabyShalls bermula dari kecintaan seorang ibu di Malang yang kesulitan menemukan buku anak berkualitas, ramah sensori, dan kurasi bermakna untuk tumbuh kembang buah hatinya. Didirikan pada tahun 2020 di Citraland Puncak Tidar, BabyShalls hadir sebagai butik buku independen dan ruang belajar hangat bagi keluarga.',
    storyParagraph2:
      'Lebih dari sekadar toko buku, BabyShalls adalah rumah imajinasi di mana anak-anak dapat membaca bebas, bereksplorasi dengan mainan kayu bersertifikasi non-toxic, serta mengikuti lokakarya sensori dan mendongeng bersama orang tua.',
    storyParagraph3:
      'Kami secara teliti memilih setiap judul buku—baik buku lokal pemenang penghargaan maupun board book impor klasik—untuk memastikan bahasa, ilustrasi, dan pesan moralnya aman serta memantik rasa ingin tahu si kecil.',
    vision:
      'Menjadi sahabat terpercaya orang tua Indonesia dalam menumbuhkan kecintaan membaca dan imajinasi anak sejak hari pertama.',
    mission:
      'Menyediakan kurasi buku anak dan mainan edukatif terbaik, menghadirkan ruang interaksi ramah keluarga di Malang, serta memudahkan akses literasi anak lewat layanan digital yang hangat dan terpercaya.',
    galleryTitle: 'Kunjungi Butik Fisik Kami di Citraland Malang',
    gallerySubtitle: 'Rasakan pengalaman membaca langsung bersama si kecil di ruang baca yang nyaman dan area bermain sensorik yang higienis.',
    description: 'BabyShalls adalah butik toko buku anak dan mainan edukatif di Malang. Didirikan dengan misi menghadirkan buku cerita bergambar berkualitas internasional dan mainan sensorik ramah anak yang dapat dinikmati bersama keluarga tercinta.',
    pillars: [
      {
        title: 'Kurasi Ketat Ramah Anak',
        desc: 'Bahan tebal anti-sobek, sudut tumpul aman bagi balita, serta cat berbasis air bebas racun.',
      },
      {
        title: 'Area Bermain Gratis di Toko',
        desc: 'Toko fisik di Citraland Puncak Tidar dilengkapi reading corner dan sensory play table gratis.',
      },
      {
        title: 'Komunitas & Workshop Rutin',
        desc: 'Kelas membaca berkala, seni & kerajinan tangan, serta panduan kurasi buku sesuai tahapan usia.',
      },
    ],
  },
  faq: [
    {
      id: 'faq-1',
      category: 'belanja',
      question: 'Bagaimana cara berbelanja di BabyShalls?',
      answer:
        'Pilih buku atau mainan yang kamu sukai dari katalog, tentukan jumlahnya, lalu klik tombol "+ Tambah ke Keranjang". Di halaman checkout, isi alamat tujuan dan pilih metode pembayaran (QRIS, Virtual Account, atau Kartu). Pesanan akan segera disiapkan dan dikirimkan oleh tim kami di Malang.',
    },
    {
      id: 'faq-2',
      category: 'belanja',
      question: 'Apakah bisa menambahkan kartu ucapan dan bungkus kado?',
      answer:
        'Tentu saja! Di halaman Keranjang dan Checkout, centang opsi kemasan kado. Kami menyediakan kartu ucapan custom dengan pesan khusus yang bisa kamu ketik sendiri, serta kotak kado signature BabyShalls.',
    },
    {
      id: 'faq-3',
      category: 'pengiriman',
      question: 'Apa saja opsi kurir pengiriman yang tersedia?',
      answer:
        'Kami bekerjasama dengan ekspedisi resmi terpercaya (JNE, J&T, SiCepat). Untuk area Malang Raya, tersedia layanan GoSend / GrabExpress instan tiba di hari yang sama. Kamu juga bisa memilih opsi "Ambil Sendiri di Toko Citraland Malang" tanpa biaya ongkir.',
    },
    {
      id: 'faq-4',
      category: 'pengiriman',
      question: 'Di mana saya bisa melacak nomor resi pengiriman?',
      answer:
        'Nomor resi otomatis diperbarui di menu Akun Saya > Riwayat Pesanan begitu paket diserahkan ke kurir. Kamu juga akan menerima notifikasi konfirmasi pengiriman.',
    },
    {
      id: 'faq-5',
      category: 'pengembalian',
      question: 'Bagaimana jika buku yang saya terima rusak atau cacat cetak?',
      answer:
        'Kami memberikan garansi penggantian 100% untuk buku cacat cetak atau rusak saat proses kirim. Cukup foto bagian yang rusak dan hubungi WhatsApp admin dalam waktu 2x24 jam sejak paket diterima.',
    },
    {
      id: 'faq-6',
      category: 'event',
      question: 'Bagaimana sistem pendaftaran workshop dan tiket masuk?',
      answer:
        'Buka menu Event & Workshop, pilih kegiatan yang diinginkan, dan isi form pendaftaran. Sistem akan otomatis menerbitkan e-tiket ber-QR Code di akunmu. Saat hari pelaksanaan di butik Citraland Malang, cukup tunjukkan QR Code tersebut ke kasir untuk proses check-in.',
    },
  ],
  preloved: {
    badge: 'KURASI PRELOVED TERBAIK',
    title: 'Buku Anak Pilihan Berkualitas, Bersih & Steril UV',
    description:
      'Setiap buku preloved melalui proses kurasi 5 tahap: pemeriksaan kelengkapan halaman, sanitasi ramah anak, sterilisasi lampu UV-C, dan penilaian kondisi jujur.',
    uvNotice: 'Semua buku preloved disterilisasi dengan lampu sinar UV-C & disanitasi ramah anak.',
    guaranteeTitle: 'Jaminan Kurasi & Kebersihan Preloved',
    guaranteeSubtitle:
      'Setiap buku preloved melewati 3 tahap sterilisasi sebelum sampai ke tangan si kecil.',
    sterilizationNotice:
      'Setiap buku preloved disterilisasi menggunakan sinar UV-C dan pembersih food-grade aman bagi balita.',
    guarantees: [
      { title: 'Sterilisasi UV-C', desc: 'Bebas kuman & bakteri' },
      { title: 'Halaman 100% Lengkap', desc: 'Tanpa coretan merusak' },
      { title: 'Hemat Hingga 60%', desc: 'Kondisi 90-98% seperti baru' },
    ],
    steps: [
      {
        step: '01',
        title: 'Pemeriksaan Halaman',
        desc: 'Bebas coretan berlebih, sobekan, atau halaman hilang.',
      },
      {
        step: '02',
        title: 'Pembersihan Food-Grade',
        desc: 'Cover dan tepi buku dibersihkan dengan cairan disinfektan alami ramah anak.',
      },
      {
        step: '03',
        title: 'Sterilisasi Sinar UV-C',
        desc: 'Buku dimasukkan ke dalam kabinet UV-C untuk membasmi 99.9% kuman dan bakteri.',
      },
    ],
  },
  store: {
    storeName: "Baby Shall's",
    address: 'Citraland Puncak Tidar Blok HH-26, Malang',
    city: 'Kota Malang, Jawa Timur 65146',
    operatingHours: 'Setiap hari 10.00 – 17.00 WIB',
    openingHours: 'Setiap hari 10.00 – 17.00 WIB',
    phone: '0812-3456-7890',
    email: 'halo@babyshalls.com',
    whatsappNumber: '6281234567890',
    whatsappCommunityUrl:
      'https://wa.me/6281234567890?text=Halo%20BabyShalls,%20saya%20ingin%20bergabung%20ke%20grup%20komunitas%20katalog%20dan%20event.',
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
