import { PrismaClient, AgeGroup, DiscountType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed default Admin & Demo Customer
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@babyshalls.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'BabyShallsAdmin2026!';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: 'Admin BabyShalls Malang',
      phone: '081234567890',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  const userEmail = 'bunda@babyshalls.com';
  const userHash = await bcrypt.hash('Bunda123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
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

  // 3. Seed curated Products (selaras dengan katalog storefront)
  const initialProducts = [
    {
      name: 'Look and Grow: Nature',
      slug: 'look-and-grow-nature',
      description: 'Buku papan (board book) tebal dengan ilustrasi kontras tinggi dan tekstur sentuhan untuk merangsang indera penglihatan serta motorik halus bayi sejak usia dini.',
      price: 175500,
      originalPrice: 195000,
      authorOrBrand: 'Board Book Kurasi',
      stock: 14,
      weight: 380,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Board Books',
      subCategory: 'Board Books',
      images: ['/images/prod-boardbook.jpg', '/images/prod-picturebook.jpg'],
      features: ['Halaman tebal tahan kunyah', 'Sudut tumpul ramah bayi', 'Pewarna berbasis kedelai ramah lingkungan'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Forest Friends',
      slug: 'forest-friends-picture-book',
      description: 'Kisah hangat tentang persahabatan binatang hutan yang mengajarkan empati, kosakata alam pertama, dan rasa ingin tahu untuk balita.',
      price: 189000,
      originalPrice: 210000,
      authorOrBrand: 'Picture Storybook',
      stock: 18,
      weight: 420,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Picture Books',
      subCategory: 'Picture Books',
      images: ['/images/prod-picturebook.jpg', '/images/prod-storybook.jpg'],
      features: ['Ilustrasi cat air memikat', 'Cerita rima berulang yang mudah diingat', 'Kertas ramah FSC'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Wooden Rainbow Stacker',
      slug: 'wooden-rainbow-stacker',
      description: 'Mainan kayu pelangi bertingkat multifungsi. Mendukung permainan terbuka (open-ended play), mengenal warna, keseimbangan, serta melatih koordinasi tangan-mata.',
      price: 249000,
      originalPrice: 285000,
      authorOrBrand: 'BabyShalls Wooden Crafts',
      stock: 9,
      weight: 750,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Stacker',
      images: ['/images/prod-woodentoy.jpg', '/images/prod-puzzle.jpg'],
      features: ['Kayu pinus solid berkualitas tinggi', 'Cat water-based non-toxic bersertifikasi EN71 & SNI', 'Halus tanpa serpihan'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Wooden Shape Sorter',
      slug: 'wooden-shape-sorter-montessori',
      description: 'Kotak sortir bentuk geometri kayu Montessori untuk melatih logika spasial, pengenalan bentuk 3D, serta pemecahan masalah sederhana.',
      price: 299000,
      originalPrice: 340000,
      authorOrBrand: 'Montessori Toy Collection',
      stock: 7,
      weight: 850,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Wooden Toys',
      subCategory: 'Shape Sorter',
      images: ['/images/prod-puzzle.jpg', '/images/prod-woodentoy.jpg'],
      features: ['12 balok bentuk variatif', 'Tutup geser praktis', 'Kayu beech ramah lingkungan'],
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Baby Sensory: Touch & Feel Animals',
      slug: 'baby-sensory-touch-feel-animals',
      description: 'Buku stimulasi taktil dengan aneka bahan berbulu halus, kulit bersisik ramah anak, dan permukaan timbul untuk eksplorasi sensorik bayi.',
      price: 165000,
      originalPrice: null,
      authorOrBrand: 'Sensory Book Series',
      stock: 20,
      weight: 350,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Sound & Sensory',
      subCategory: 'Touch & Feel',
      images: ['/images/prod-storybook.jpg', '/images/prod-boardbook.jpg'],
      features: ['Patch kain sensorik higienis', 'Warna cerah merangsang saraf visual'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'The Curious Little Scientist',
      slug: 'curious-little-scientist-stem',
      description: 'Pengenalan sains dasar untuk anak usia sekolah dini dengan eksperimen sederhana di rumah dan penjelasan ramah anak.',
      price: 215000,
      originalPrice: null,
      authorOrBrand: 'STEM Explorer Books',
      stock: 12,
      weight: 480,
      ageGroup: AgeGroup.AGES_6_PLUS,
      category: 'Early Readers',
      subCategory: 'Early Readers',
      images: ['/images/prod-storybook.jpg', '/images/prod-picturebook.jpg'],
      features: ['Eksperimen aman di rumah', 'Diagram visual warna-warni'],
      isNewArrival: true,
    },
    {
      name: '[Preloved] Peppa Pig: First 100 Words',
      slug: 'preloved-peppa-pig-first-100-words',
      description: 'Buku papan (board book) preloved kurasi butik BabyShalls Malang. Telah disanitasi steril dengan sinar UV-C, tanpa coretan, halaman tebal sangat mulus seperti baru.',
      price: 65000,
      originalPrice: 155000,
      authorOrBrand: 'Ladybird Books (Kurasi Preloved)',
      stock: 1,
      weight: 320,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Board Books',
      subCategory: 'Preloved',
      images: ['/images/prod-boardbook.jpg', '/images/prod-storybook.jpg'],
      features: ['Kondisi mulus 95%', 'Disanitasi higienis UV-C steril', 'Hemat 58% dari harga baru'],
      isNewArrival: true,
    },
    {
      name: '[Preloved] Melissa & Doug Wooden Building Blocks (50 Pcs)',
      slug: 'preloved-melissa-doug-wooden-blocks',
      description: 'Balok susun kayu edukasi warna-warni preloved impor. Lengkap 50 keping, cat water-based utuh, telah dibersihkan secara higienis menggunakan pembersih food-grade.',
      price: 135000,
      originalPrice: 280000,
      authorOrBrand: 'Melissa & Doug (Kurasi Preloved)',
      stock: 1,
      weight: 900,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Wooden Toys',
      subCategory: 'Preloved',
      images: ['/images/prod-woodentoy.jpg', '/images/prod-puzzle.jpg'],
      features: ['50 balok kayu lengkap', 'Pembersih food-grade aman', 'Hemat lebih dari 50%'],
      isNewArrival: true,
    },
    {
      name: '[Preloved] The Very Hungry Caterpillar (Hardcover)',
      slug: 'preloved-the-very-hungry-caterpillar',
      description: 'Buku dongeng legendaris karya Eric Carle edisi istimewa. Kondisi hampir baru tanpa lipatan atau robekan sama sekali.',
      price: 85000,
      originalPrice: 195000,
      authorOrBrand: 'Eric Carle (Kurasi Preloved)',
      stock: 1,
      weight: 400,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Picture Books',
      subCategory: 'Preloved',
      images: ['/images/prod-picturebook.jpg', '/images/prod-boardbook.jpg'],
      features: ['Koleksi langka', 'Disanitasi UV steril', 'Bagus untuk read-aloud'],
      isNewArrival: true,
    },
    {
      name: '[Preloved] Wooden Geometric Shape Sorter (Montessori)',
      slug: 'preloved-wooden-montessori-shape-sorter',
      description: 'Kotak sortasi bentuk geometri kayu alami standar montessori. Kayu solid halus tanpa serpihan, melatih koordinasi mata dan tangan balita.',
      price: 95000,
      originalPrice: 220000,
      authorOrBrand: 'PlanToys (Kurasi Preloved)',
      stock: 1,
      weight: 550,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Preloved',
      images: ['/images/prod-woodentoy.jpg', '/images/prod-puzzle.jpg'],
      features: ['Kayu karet ramah lingkungan', 'Disanitasi steril', 'Hemat 56%'],
      isNewArrival: true,
    },
    {
      name: '[Preloved] Usborne Farm Sounds Touch & Listen',
      slug: 'preloved-usborne-farm-sounds',
      description: 'Buku suara interaktif impor dari Usborne UK. Tombol sentuh peka dan baterai masih aktif dengan suara jernih, mengisahkan hewan peternakan.',
      price: 110000,
      originalPrice: 250000,
      authorOrBrand: 'Usborne UK (Kurasi Preloved)',
      stock: 1,
      weight: 480,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Sound & Sensory',
      subCategory: 'Preloved',
      images: ['/images/prod-storybook.jpg', '/images/prod-boardbook.jpg'],
      features: ['Sensor sentuh berfungsi normal', 'Baterai baru terpasang', 'Higienis bersertifikasi'],
      isNewArrival: true,
    },
    {
      name: 'The Very Hungry Caterpillar (Board Book)',
      slug: 'the-very-hungry-caterpillar-board-book',
      description: 'Buku klasik Eric Carle edisi Board Book yang mengajarkan hari, angka, dan siklus kupu-kupu.',
      price: 165000,
      originalPrice: null,
      authorOrBrand: 'Eric Carle / Puffin',
      stock: 25,
      weight: 350,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Board Books',
      subCategory: 'Board Books',
      images: ['/images/prod-boardbook.jpg'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Hampers Kado Lahiran Warm Cozy',
      slug: 'hampers-kado-lahiran-warm-cozy',
      description: 'Paket kado eksklusif berisi 1 High-Contrast Board Book, 1 Wooden Rattle, dan kartu ucapan personal.',
      price: 385000,
      originalPrice: 420000,
      authorOrBrand: 'BabyShalls Hampers',
      stock: 8,
      weight: 1100,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Gift Hampers',
      subCategory: 'Newborn',
      images: ['/images/hampers-gift.jpg'],
      isFeatured: true,
    },
  ];

  for (const prod of initialProducts) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
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

  console.log('Seed completed: Admin, Demo User, 4 Coupons, 4 Products, & 2 Events.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
