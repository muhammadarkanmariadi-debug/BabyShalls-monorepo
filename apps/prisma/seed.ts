import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { AgeGroup, DiscountType, Role } from '../server/generated/prisma/client';
import { hashPassword } from '../server/lib/password';

async function main() {
  const { prisma } = await import('../server/lib/prisma');
  try {
    // 1. Seed default Admin & Demo Customer
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@babyshalls.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'BabyShallsAdmin2026!';
  const adminHash = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, passwordHash: adminHash },
    create: {
      email: adminEmail,
      name: 'Admin BabyShalls Malang',
      phone: '081234567890',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  const userEmail = 'bunda@babyshalls.com';
  const userHash = await hashPassword('Bunda123!');
  const demoUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: { passwordHash: userHash },
    create: {
      email: userEmail,
      name: 'Bunda Rania Putri',
      phone: '081234567899',
      passwordHash: userHash,
      role: Role.USER,
    },
  });

  // Ensure demo user has at least 1 default address
  const existingAddr = await prisma.address.findFirst({ where: { userId: demoUser.id } });
  if (!existingAddr) {
    await prisma.address.create({
      data: {
        userId: demoUser.id,
        label: 'Rumah Malang',
        receiverName: 'Bunda Rania Putri',
        receiverPhone: '081234567899',
        streetAddress: 'Jl. Soekarno Hatta No. 45, Lowokwaru',
        city: 'Kota Malang',
        subdistrict: 'Lowokwaru',
        postalCode: '65141',
        isDefault: true,
      },
    });
  }

  // 2. Seed initial coupons
  const initialCoupons = [
    {
      code: 'BABYNEW',
      description: 'Potongan 15% (Maks. Rp 50.000) tanpa minimal belanja',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      maxDiscount: 50000,
      minOrder: 0,
      maxUsage: 500,
      isActive: true,
    },
    {
      code: 'MALANGCOZY',
      description: 'Voucher spesial Butik Malang potongan Rp 20.000',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 20000,
      maxDiscount: null,
      minOrder: 0,
      maxUsage: 300,
      isActive: true,
    },
    {
      code: 'ONGKIRHEMAT',
      description: 'Potongan subsidi kurir KiriminAja Rp 10.000',
      discountType: DiscountType.SHIPPING_SUBSIDY,
      discountValue: 10000,
      maxDiscount: null,
      minOrder: 0,
      maxUsage: 1000,
      isActive: true,
    },
    {
      code: 'EARLYBIRD',
      description: 'Diskon 20% Pendaftaran Early Bird Event & Workshop (Maks. Rp 30.000)',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      maxDiscount: 30000,
      minOrder: 0,
      maxUsage: 200,
      isActive: true,
    },
  ];

  for (const coupon of initialCoupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder,
      },
      create: coupon,
    });
  }

  // 3. Seed curated Products (Shopee BabyShalls Catalog + Hampers & Preloved Kurasi)
  const initialProducts = [
    {
      name: 'Slow Down With This Before and After Nature Game [ New • Sealed ]',
      slug: 'slow-down-with-this-before-and-after-nature-game',
      description: 'Permainan edukatif bertema alam untuk melatih observasi, fokus, dan pemahaman urutan waktu (sebelum & sesudah) bagi anak. Kondisi baru tersegel (Original UK/US Publisher).',
      price: 210500,
      originalPrice: null,
      authorOrBrand: 'Original UK/US Publisher',
      stock: 10,
      weight: 450,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Activity Books',
      subCategory: 'Educational Game',
      images: ['/images/products/shopee-slow-down-nature.jpg'],
      features: ['New • Sealed', 'Original UK/US Publisher', 'Melatih observasi & logika alam'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Lettering and Life Pastel Pegdol Set [ New • Sealed ]',
      slug: 'lettering-and-life-pastel-pegdol-set',
      description: 'Set boneka kayu pastel (peg doll) untuk permainan imajinatif (pretend play), sorting warna, dan motorik halus anak. Aman dengan cat water-based non-toxic.',
      price: 175500,
      originalPrice: null,
      authorOrBrand: 'Lettering and Life',
      stock: 12,
      weight: 400,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Peg Dolls',
      images: ['/images/products/shopee-pastel-pegdol-set.jpg'],
      features: ['New • Sealed', 'Cat water-based non-toxic', 'Mendukung open-ended pretend play'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Tooky Toy Music Play Box [ New • Sealed ]',
      slug: 'tooky-toy-music-play-box',
      description: 'Kotak bermain musik kayu multifungsi dari Tooky Toy untuk menstimulasi pendengaran, ritme, dan koordinasi tangan-mata balita.',
      price: 510500,
      originalPrice: null,
      authorOrBrand: 'Tooky Toy',
      stock: 6,
      weight: 1200,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Musical Toys',
      images: ['/images/products/shopee-tooky-toy-music-box.jpg'],
      features: ['New • Sealed', 'Kayu solid halus ramah anak', 'Stimulasi musikal & motorik'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Mideer My First Art Gift Box [ New • Sealed ]',
      slug: 'mideer-my-first-art-gift-box',
      description: 'Paket kado seni pertama anak dari Mideer berisi perlengkapan menggambar & mewarnai ramah anak dalam kemasan gift box eksklusif.',
      price: 620500,
      originalPrice: null,
      authorOrBrand: 'Mideer',
      stock: 8,
      weight: 1100,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Gift Hampers',
      subCategory: 'Art Gift Box',
      images: ['/images/products/shopee-mideer-first-art-box.jpg', '/images/hampers-gift.jpg'],
      features: ['New • Sealed', 'Kemasan gift box eksklusif', 'Aman & washable untuk anak'],
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Tooky Toy Tap Game [ New • Sealed ]',
      slug: 'tooky-toy-tap-game',
      description: 'Mainan ketok kayu edukatif Tooky Toy untuk melatih kekuatan genggaman, fokus visual, dan koordinasi motorik kasar & halus.',
      price: 175500,
      originalPrice: null,
      authorOrBrand: 'Tooky Toy',
      stock: 10,
      weight: 600,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Tap Game',
      images: ['/images/products/shopee-tooky-toy-tap-game.jpg'],
      features: ['New • Sealed', 'Kayu berkualitas halus', 'Melatih koordinasi tangan-mata'],
      isNewArrival: true,
    },
    {
      name: 'Lettering and Life Ocean Balance Stacking [ New • Sealed ]',
      slug: 'lettering-and-life-ocean-balance-stacking',
      description: 'Mainan susun keseimbangan kayu bertema biota laut dengan warna lembut. Melatih kesabaran, keseimbangan, dan logika spasial anak.',
      price: 295500,
      originalPrice: null,
      authorOrBrand: 'Lettering and Life',
      stock: 7,
      weight: 550,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Stacker',
      images: ['/images/products/shopee-ocean-balance-stacking.jpg'],
      features: ['New • Sealed', 'Tema biota laut edukatif', 'Cat aman water-based'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Tookyland Origami & Kirigami [ New • Sealed ]',
      slug: 'tookyland-origami-kirigami',
      description: 'Buku & set aktivitas melipat serta menggunting kertas (origami & kirigami) untuk mengasah kreativitas dan keterampilan motorik halus.',
      price: 80500,
      originalPrice: null,
      authorOrBrand: 'Tookyland',
      stock: 15,
      weight: 300,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Activity Books',
      subCategory: 'Craft & Origami',
      images: ['/images/products/shopee-tookyland-origami.jpg'],
      features: ['New • Sealed', 'Panduan langkah demi langkah', 'Melatih kreativitas & motorik halus'],
      isNewArrival: true,
    },
    {
      name: 'Britannica’s 150 First Words [New Sealed]',
      slug: 'britannicas-150-first-words',
      description: 'Board book kurasi Britannica untuk mengenalkan 150 kosakata pertama dengan ilustrasi jernih dan halaman papan tebal tahan lama.',
      price: 225500,
      originalPrice: null,
      authorOrBrand: 'Britannica Books',
      stock: 14,
      weight: 420,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Board Books',
      subCategory: 'First Words',
      images: ['/images/products/shopee-britannica-150-words.jpg'],
      features: ['New • Sealed', 'Halaman board book tebal', '150 kosakata dasar bergambar'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'I Thought I Saw a Dinosaur! [ New • Sealed ]',
      slug: 'i-thought-i-saw-a-dinosaur',
      description: 'Board book interaktif dengan mekanisme slider dorong-tarik yang seru, mengajak balita mencari dinosaurus tersembunyi di setiap halaman.',
      price: 190500,
      originalPrice: null,
      authorOrBrand: 'Original UK Publisher',
      stock: 11,
      weight: 380,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Board Books',
      subCategory: 'Slider Board Book',
      images: ['/images/products/shopee-saw-a-dinosaur.jpg'],
      features: ['New • Sealed', 'Fitur slider interaktif', 'Melatih rasa ingin tahu bayi & balita'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Busy Builders : Fire Station [ New • Sealed ]',
      slug: 'busy-builders-fire-station',
      description: 'Board book interaktif bertema stasiun pemadam kebakaran dengan elemen gerak yang cocok untuk stimulasi sensorik dan imajinasi anak.',
      price: 310500,
      originalPrice: null,
      authorOrBrand: 'Original UK Publisher',
      stock: 9,
      weight: 450,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Board Books',
      subCategory: 'Interactive Board Book',
      images: ['/images/products/shopee-busy-builders-fire.jpg'],
      features: ['New • Sealed', 'Halaman tebal interaktif', 'Tema profesi & kendaraan favorit anak'],
      isNewArrival: true,
    },
    {
      name: 'Little People BIG DREAMS : Beyoncé [ Original UK ]',
      slug: 'little-people-big-dreams-beyonce',
      description: 'Buku cerita bergambar seri Little People, BIG DREAMS terbitan Original UK yang mengisahkan perjalanan inspiratif sejak masa kecil.',
      price: 330500,
      originalPrice: null,
      authorOrBrand: 'Frances Lincoln (Original UK)',
      stock: 8,
      weight: 420,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Picture Books',
      subCategory: 'Biography',
      images: ['/images/products/shopee-little-people-beyonce.jpg'],
      features: ['Original UK', 'Ilustrasi penuh warna', 'Cerita inspiratif untuk read-aloud'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Reading To Baby [ New • Sealed ] Affirm Press Book',
      slug: 'reading-to-baby-affirm-press',
      description: 'Picture book hangat terbitan Affirm Press tentang kebersamaan keluarga dan keajaiban membacakan buku untuk bayi sejak dini.',
      price: 310500,
      originalPrice: null,
      authorOrBrand: 'Affirm Press',
      stock: 10,
      weight: 400,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Picture Books',
      subCategory: 'Family & Bonding',
      images: ['/images/products/shopee-reading-to-baby.jpg'],
      features: ['New • Sealed', 'Affirm Press Original', 'Cocok untuk kado kelahiran & read-aloud'],
      isNewArrival: true,
    },
    {
      name: 'Over And Under The Waves [New • Sealed]',
      slug: 'over-and-under-the-waves',
      description: 'Picture book edukatif tentang ekosistem laut—menjelajahi kehidupan di atas ombak dan di bawah permukaan samudra.',
      price: 355500,
      originalPrice: null,
      authorOrBrand: 'Chronicle Books',
      stock: 7,
      weight: 480,
      ageGroup: AgeGroup.AGES_6_PLUS,
      category: 'Picture Books',
      subCategory: 'Nature & Science',
      images: ['/images/products/shopee-over-under-waves.jpg'],
      features: ['New • Sealed', 'Edukasi sains & alam laut', 'Ilustrasi artistik memikat'],
      isNewArrival: true,
    },
    {
      name: '5 Minute Nature Stories [ New • Sealed ]',
      slug: '5-minute-nature-stories',
      description: 'Kumpulan cerita alam singkat 5 menit sebelum tidur yang penuh pengetahuan tentang hewan, tumbuhan, dan musim di alam liar.',
      price: 390500,
      originalPrice: null,
      authorOrBrand: 'Original UK/US Publisher',
      stock: 9,
      weight: 650,
      ageGroup: AgeGroup.AGES_6_PLUS,
      category: 'Picture Books',
      subCategory: 'Bedtime Stories',
      images: ['/images/products/shopee-5-minute-nature.jpg'],
      features: ['New • Sealed', 'Hardcover koleksi', 'Ideal untuk bedtime read-aloud'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Aku Sudah Tak Marah [ New • Sealed ]',
      slug: 'aku-sudah-tak-marah',
      description: 'Buku cerita bergambar berbahasa Indonesia untuk membantu anak mengenali, memahami, dan mengelola emosi marah dengan cara yang sehat.',
      price: 60500,
      originalPrice: null,
      authorOrBrand: 'Kurasi Buku Lokal',
      stock: 20,
      weight: 250,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Picture Books',
      subCategory: 'Emotions & SEL',
      images: ['/images/products/shopee-aku-sudah-tak-marah.jpg'],
      features: ['New • Sealed', 'Edukasi regulasi emosi anak', 'Bahasa ringan & ilustrasi ekspresif'],
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: '[Preloved] Kurasi Buku Impor Pilihan (Steril UV-C)',
      slug: 'preloved-kurasi-buku-impor-steril',
      description: 'Buku anak impor preloved kurasi butik BabyShalls Malang. Telah disanitasi steril dengan sinar UV-C, halaman bersih dan terawat.',
      price: 85000,
      originalPrice: 195000,
      authorOrBrand: 'BabyShalls Kurasi Preloved',
      stock: 1,
      weight: 380,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Board Books',
      subCategory: 'Preloved',
      images: ['/images/preloved/preloved-sampul.png', '/images/preloved/preloved-halaman-dalam.png'],
      features: ['Kondisi mulus 95%', 'Disanitasi higienis UV-C steril', 'Siap kirim dari Malang'],
      isNewArrival: true,
    },
    {
      name: 'Hampers Kado Lahiran & Ulang Tahun BabyShalls',
      slug: 'hampers-kado-lahiran-warm-cozy',
      description: 'Paket kado eksklusif kurasi BabyShalls Malang lengkap dengan kemasan cantik, pita satin, dan kartu ucapan tulis tangan gratis.',
      price: 385000,
      originalPrice: 420000,
      authorOrBrand: 'BabyShalls Hampers',
      stock: 8,
      weight: 1100,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Gift Hampers',
      subCategory: 'Newborn',
      images: ['/images/hampers-gift.jpg', '/images/products/shopee-mideer-first-art-box.jpg'],
      features: ['Gratis bungkus kado & pita', 'Gratis kartu ucapan personal', 'Kurasi sesuai usia si kecil'],
      isFeatured: true,
    },
  ];

  for (const prod of initialProducts) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        authorOrBrand: prod.authorOrBrand,
        stock: prod.stock,
        weight: prod.weight,
        ageGroup: prod.ageGroup,
        category: prod.category,
        subCategory: prod.subCategory,
        images: prod.images,
        features: prod.features,
        isFeatured: prod.isFeatured ?? false,
        isNewArrival: prod.isNewArrival ?? false,
        isBestSeller: prod.isBestSeller ?? false,
      },
      create: prod,
    });
  }

  // 4. Seed Workshop Events
  const initialEvents = [
    {
      title: 'Read-Aloud & Sensory Play untuk Balita (1-3 Tahun)',
      slug: 'read-aloud-sensory-play-malang',
      description: 'Sesi membaca nyaring interaktif bersama Kakak Kurator BabyShalls dan bermain sensory bin aman.',
      bannerImage: '/images/events/read-aloud-malang.jpg',
      eventDate: new Date('2026-12-05T03:00:00.000Z'),
      timeString: '10:00 - 11:30 WIB',
      location: 'Butik BabyShalls, Jl. Cempaka No. 12, Kota Malang',
      price: 0,
      quota: 20,
    },
    {
      title: 'Montessori Wooden Toy Workshop & Parenting Talk',
      slug: 'montessori-wooden-toy-workshop',
      description: 'Belajar memilih mainan edukasi sesuai fase sensitif anak bersama praktisi Montessori Malang.',
      bannerImage: '/images/events/montessori-workshop.jpg',
      eventDate: new Date('2026-12-12T03:00:00.000Z'),
      timeString: '09:30 - 12:00 WIB',
      location: 'Butik BabyShalls, Jl. Cempaka No. 12, Kota Malang',
      price: 75000,
      quota: 15,
    },
  ];

  for (const ev of initialEvents) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {},
      create: ev,
    });
  }

  // 6. Hero Carousel 4 Slides (Semi-CMS SiteContent)
  const heroSlides = [
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

  await prisma.siteContent.upsert({
    where: { key: 'hero_slides_json' },
    update: { value: JSON.stringify(heroSlides) },
    create: { key: 'hero_slides_json', value: JSON.stringify(heroSlides) },
  });

  await prisma.siteContent.upsert({
    where: { key: 'hampers_image' },
    update: { value: '/images/hampers-gift.jpg' },
    create: { key: 'hampers_image', value: '/images/hampers-gift.jpg' },
  });

  await prisma.siteContent.upsert({
    where: { key: 'about_block_1_image' },
    update: { value: '/images/store-boutique.jpg' },
    create: { key: 'about_block_1_image', value: '/images/store-boutique.jpg' },
  });

    console.log('Seed completed: Admin, Demo User, 4 Coupons, 17 Products (Shopee BabyShalls + Kurasi), 2 Events, & 4 Hero Slides.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
