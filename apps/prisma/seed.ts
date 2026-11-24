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

  // Ensure demo user has demo orders for Sprint 2 testing
  const products = await prisma.product.findMany({ take: 3 });
  const existingOrder1 = await prisma.order.findUnique({ where: { orderNumber: 'BS-2026-0881' } });
  if (!existingOrder1 && products.length > 0) {
    await prisma.order.create({
      data: {
        orderNumber: 'BS-2026-0881',
        userId: demoUser.id,
        totalAmount: products[0].price,
        shippingCost: 15000,
        grandTotal: Number(products[0].price) + 15000,
        status: 'SHIPPED',
        courierCode: 'jne',
        courierService: 'REG',
        waybillNumber: 'JNE88291039401ID',
        shippingAddress: {
          receiverName: 'Bunda Rania Putri',
          receiverPhone: '081234567899',
          streetAddress: 'Jl. Soekarno Hatta No. 45, Lowokwaru',
          city: 'Kota Malang',
        },
        trackingHistory: [
          {
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'PICKUP_REQUESTED',
            message: 'Package ready for courier pickup at BabyShalls Boutique Malang.',
            location: 'Kota Malang',
          },
          {
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'IN_TRANSIT',
            message: 'Package in transit to destination city.',
            location: 'Malang Gateway Hub',
          },
        ],
        items: {
          create: [
            {
              productId: products[0].id,
              price: products[0].price,
              quantity: 1,
            },
          ],
        },
      },
    });
  }

  const existingOrder2 = await prisma.order.findUnique({ where: { orderNumber: 'BS-2026-0842' } });
  if (!existingOrder2 && products.length > 1) {
    await prisma.order.create({
      data: {
        orderNumber: 'BS-2026-0842',
        userId: demoUser.id,
        totalAmount: products[1].price,
        shippingCost: 12000,
        grandTotal: Number(products[1].price) + 12000,
        status: 'COMPLETED',
        courierCode: 'jnt',
        courierService: 'EZ',
        waybillNumber: 'JNT991827364ID',
        shippingAddress: {
          receiverName: 'Bunda Rania Putri',
          receiverPhone: '081234567899',
          streetAddress: 'Jl. Soekarno Hatta No. 45, Lowokwaru',
          city: 'Kota Malang',
        },
        trackingHistory: [
          {
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
            status: 'PICKUP_REQUESTED',
            message: 'Package ready for courier pickup.',
            location: 'Kota Malang',
          },
          {
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'IN_TRANSIT',
            message: 'Package arrived at Malang transit sorting facility.',
            location: 'Kota Malang',
          },
          {
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'DELIVERED',
            message: 'Package successfully delivered to recipient.',
            location: 'Kota Malang',
          },
        ],
        items: {
          create: [
            {
              productId: products[1].id,
              price: products[1].price,
              quantity: 1,
            },
          ],
        },
      },
    });
  }

  // 2. Seed initial coupons
  const initialCoupons = [
    {
      code: 'BABYNEW',
      description: '15% Off (Max. Rp 50,000) with no minimum spend',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      maxDiscount: 50000,
      minOrder: 0,
      maxUsage: 500,
      isActive: true,
    },
    {
      code: 'MALANGCOZY',
      description: 'Malang Boutique Special voucher Rp 20,000 off',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 20000,
      maxDiscount: null,
      minOrder: 0,
      maxUsage: 300,
      isActive: true,
    },
    {
      code: 'ONGKIRHEMAT',
      description: 'KiriminAja courier shipping subsidy Rp 10,000',
      discountType: DiscountType.SHIPPING_SUBSIDY,
      discountValue: 10000,
      maxDiscount: null,
      minOrder: 0,
      maxUsage: 1000,
      isActive: true,
    },
    {
      code: 'EARLYBIRD',
      description: '20% Off Early Bird Workshop Registration (Max. Rp 30,000)',
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
      description: 'Nature-themed educational game to cultivate observation, focus, and chronological sequence logic (before & after) in children. Brand new and sealed (Original UK/US Publisher).',
      price: 210500,
      originalPrice: null,
      authorOrBrand: 'Original UK/US Publisher',
      stock: 10,
      weight: 450,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Activity Books',
      subCategory: 'Educational Game',
      images: ['/images/products/shopee-slow-down-nature.jpg'],
      features: ['New • Sealed', 'Original UK/US Publisher', 'Develops observation & nature logic'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Lettering and Life Pastel Pegdoll Set [ New • Sealed ]',
      slug: 'lettering-and-life-pastel-pegdol-set',
      description: 'Set of pastel wooden peg dolls for imaginative pretend play, color sorting, and toddler fine motor skill development. Child-safe non-toxic water-based paint.',
      price: 175500,
      originalPrice: null,
      authorOrBrand: 'Lettering and Life',
      stock: 12,
      weight: 400,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Peg Dolls',
      images: ['/images/products/shopee-pastel-pegdol-set.jpg'],
      features: ['New • Sealed', 'Non-toxic water-based paint', 'Supports open-ended pretend play'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Tooky Toy Music Play Box [ New • Sealed ]',
      slug: 'tooky-toy-music-play-box',
      description: 'Multifunctional wooden music activity box by Tooky Toy to stimulate auditory awareness, rhythm, and toddler hand-eye coordination.',
      price: 510500,
      originalPrice: null,
      authorOrBrand: 'Tooky Toy',
      stock: 6,
      weight: 1200,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Musical Toys',
      images: ['/images/products/shopee-tooky-toy-music-box.jpg'],
      features: ['New • Sealed', 'Smooth solid child-safe wood', 'Musical & motor stimulation'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Mideer My First Art Gift Box [ New • Sealed ]',
      slug: 'mideer-my-first-art-gift-box',
      description: 'First art gift kit from Mideer packed with washable drawing and coloring supplies in an exclusive keepsake gift box packaging.',
      price: 620500,
      originalPrice: null,
      authorOrBrand: 'Mideer',
      stock: 8,
      weight: 1100,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Gift Hampers',
      subCategory: 'Art Gift Box',
      images: ['/images/products/shopee-mideer-first-art-box.jpg', '/images/hampers-gift.jpg'],
      features: ['New • Sealed', 'Exclusive gift box packaging', 'Washable & child-safe'],
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Tooky Toy Tap Game [ New • Sealed ]',
      slug: 'tooky-toy-tap-game',
      description: 'Educational wooden tapping bench by Tooky Toy to build grip strength, visual focus, and motor coordination.',
      price: 175500,
      originalPrice: null,
      authorOrBrand: 'Tooky Toy',
      stock: 10,
      weight: 600,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Tap Game',
      images: ['/images/products/shopee-tooky-toy-tap-game.jpg'],
      features: ['New • Sealed', 'Premium smooth finished wood', 'Builds hand-eye coordination'],
      isNewArrival: true,
    },
    {
      name: 'Lettering and Life Ocean Balance Stacking [ New • Sealed ]',
      slug: 'lettering-and-life-ocean-balance-stacking',
      description: 'Marine-themed wooden balance stacking toy in soothing pastel shades. Nurtures patience, balance, and spatial reasoning in toddlers.',
      price: 295500,
      originalPrice: null,
      authorOrBrand: 'Lettering and Life',
      stock: 7,
      weight: 550,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Wooden Toys',
      subCategory: 'Stacker',
      images: ['/images/products/shopee-ocean-balance-stacking.jpg'],
      features: ['New • Sealed', 'Educational sea life theme', 'Safe water-based paints'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Tookyland Origami & Kirigami [ New • Sealed ]',
      slug: 'tookyland-origami-kirigami',
      description: 'Paper folding and cutting activity book & set (origami & kirigami) designed to sharpen fine motor dexterity and visual creativity.',
      price: 80500,
      originalPrice: null,
      authorOrBrand: 'Tookyland',
      stock: 15,
      weight: 300,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Activity Books',
      subCategory: 'Craft & Origami',
      images: ['/images/products/shopee-tookyland-origami.jpg'],
      features: ['New • Sealed', 'Step-by-step visual guide', 'Nurtures creativity & fine motor skills'],
      isNewArrival: true,
    },
    {
      name: 'Britannica’s 150 First Words [New Sealed]',
      slug: 'britannicas-150-first-words',
      description: 'Curated board book by Britannica introducing 150 essential first words with crisp photography and durable board pages.',
      price: 225500,
      originalPrice: null,
      authorOrBrand: 'Britannica Books',
      stock: 14,
      weight: 420,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Board Books',
      subCategory: 'First Words',
      images: ['/images/products/shopee-britannica-150-words.jpg'],
      features: ['New • Sealed', 'Durable thick board pages', '150 illustrated foundational words'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'I Thought I Saw a Dinosaur! [ New • Sealed ]',
      slug: 'i-thought-i-saw-a-dinosaur',
      description: 'Interactive board book with push-pull sliders inviting toddlers to hunt for hidden dinosaurs across vibrant pages.',
      price: 190500,
      originalPrice: null,
      authorOrBrand: 'Original UK Publisher',
      stock: 11,
      weight: 380,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Board Books',
      subCategory: 'Slider Board Book',
      images: ['/images/products/shopee-saw-a-dinosaur.jpg'],
      features: ['New • Sealed', 'Interactive push-pull sliders', 'Sparks toddler curiosity & discovery'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Busy Builders : Fire Station [ New • Sealed ]',
      slug: 'busy-builders-fire-station',
      description: 'Action-packed interactive fire station board book with sliding and spinning mechanisms for toddler sensory engagement.',
      price: 310500,
      originalPrice: null,
      authorOrBrand: 'Original UK Publisher',
      stock: 9,
      weight: 450,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Board Books',
      subCategory: 'Interactive Board Book',
      images: ['/images/products/shopee-busy-builders-fire.jpg'],
      features: ['New • Sealed', 'Durable moving mechanisms', 'Favorite vehicle & community helper theme'],
      isNewArrival: true,
    },
    {
      name: 'Little People BIG DREAMS : Beyoncé [ Original UK ]',
      slug: 'little-people-big-dreams-beyonce',
      description: 'Inspiring illustrated biography from the acclaimed Little People, BIG DREAMS series tracing childhood dreams to international stardom.',
      price: 330500,
      originalPrice: null,
      authorOrBrand: 'Frances Lincoln (Original UK)',
      stock: 8,
      weight: 420,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Picture Books',
      subCategory: 'Biography',
      images: ['/images/products/shopee-little-people-beyonce.jpg'],
      features: ['Original UK', 'Vibrant artwork', 'Inspiring read-aloud biography'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Reading To Baby [ New • Sealed ] Affirm Press Book',
      slug: 'reading-to-baby-affirm-press',
      description: 'A heartwarming picture book celebrating family togetherness and the everyday magic of reading aloud to infants from day one.',
      price: 310500,
      originalPrice: null,
      authorOrBrand: 'Affirm Press',
      stock: 10,
      weight: 400,
      ageGroup: AgeGroup.AGES_3_PLUS,
      category: 'Picture Books',
      subCategory: 'Family & Bonding',
      images: ['/images/products/shopee-reading-to-baby.jpg'],
      features: ['New • Sealed', 'Affirm Press Original', 'Perfect baby shower & newborn gift'],
      isNewArrival: true,
    },
    {
      name: 'Over And Under The Waves [New • Sealed]',
      slug: 'over-and-under-the-waves',
      description: 'Luminous nature science picture book exploring marine ecosystems—revealing coastal life above the waves and deep under the ocean surface.',
      price: 355500,
      originalPrice: null,
      authorOrBrand: 'Chronicle Books',
      stock: 7,
      weight: 480,
      ageGroup: AgeGroup.AGES_6_PLUS,
      category: 'Picture Books',
      subCategory: 'Nature & Science',
      images: ['/images/products/shopee-over-under-waves.jpg'],
      features: ['New • Sealed', 'Ocean science & marine biology', 'Stunning artistic illustrations'],
      isNewArrival: true,
    },
    {
      name: '5 Minute Nature Stories [ New • Sealed ]',
      slug: '5-minute-nature-stories',
      description: 'A treasury of 5-minute bedtime stories bursting with fascinating facts about woodland wildlife, seasons, and natural habitats.',
      price: 390500,
      originalPrice: null,
      authorOrBrand: 'Original UK/US Publisher',
      stock: 9,
      weight: 650,
      ageGroup: AgeGroup.AGES_6_PLUS,
      category: 'Picture Books',
      subCategory: 'Bedtime Stories',
      images: ['/images/products/shopee-5-minute-nature.jpg'],
      features: ['New • Sealed', 'Collector’s Hardcover', 'Ideal for bedtime read-aloud'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Aku Sudah Tak Marah [ New • Sealed ]',
      slug: 'aku-sudah-tak-marah',
      description: 'Gentle picture book helping young children recognize, name, and navigate big angry emotions through mindful coping tools.',
      price: 60500,
      originalPrice: null,
      authorOrBrand: 'Local Curated Press',
      stock: 20,
      weight: 250,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Picture Books',
      subCategory: 'Emotions & SEL',
      images: ['/images/products/shopee-aku-sudah-tak-marah.jpg'],
      features: ['New • Sealed', 'Social-Emotional Learning (SEL)', 'Accessible text & expressive art'],
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: '[Preloved] Kurasi Buku Impor Pilihan (Steril UV-C)',
      slug: 'preloved-kurasi-buku-impor-steril',
      description: 'Handpicked preloved imported children’s book curated by BabyShalls Malang. Thoroughly sanitized with UV-C light, clean pages, like new.',
      price: 85000,
      originalPrice: 195000,
      authorOrBrand: 'BabyShalls Curated Preloved',
      stock: 1,
      weight: 380,
      ageGroup: AgeGroup.AGES_1_3,
      category: 'Board Books',
      subCategory: 'Preloved',
      images: ['/images/preloved/preloved-sampul.png', '/images/preloved/preloved-halaman-dalam.png'],
      features: ['95% Like-new condition', 'UV-C medically sanitized', 'Ships directly from Malang boutique'],
      isNewArrival: true,
    },
    {
      name: 'Hampers Kado Lahiran & Ulang Tahun BabyShalls',
      slug: 'hampers-kado-lahiran-warm-cozy',
      description: 'Exclusive gift hamper curated by BabyShalls Malang, beautifully boxed with satin ribbons and a complimentary handwritten greeting card.',
      price: 385000,
      originalPrice: 420000,
      authorOrBrand: 'BabyShalls Hampers',
      stock: 8,
      weight: 1100,
      ageGroup: AgeGroup.NEWBORN_PLUS,
      category: 'Gift Hampers',
      subCategory: 'Newborn',
      images: ['/images/hampers-gift.jpg', '/images/products/shopee-mideer-first-art-box.jpg'],
      features: ['Free gift wrapping & satin ribbon', 'Free custom greeting card', 'Age-appropriate milestone curation'],
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

  // 4. Seed Workshop Events (Matching ALL_EVENTS single source of truth)
  const initialEvents = [
    {
      title: 'Little Explorers: Nature Craft Workshop',
      slug: 'nature-craft',
      category: 'Workshop',
      description: 'Children create botanical collages from dried leaves and blossoms while listening to woodland tales. All craft supplies and equipment are provided by BabyShalls.',
      bannerImage: '/images/events/event-workshop-alam.png',
      eventDate: new Date('2026-12-06T03:00:00.000Z'),
      timeString: '10:00–12:00 WIB',
      location: 'BabyShalls Boutique, Citraland Puncak Tidar HH-26, Malang',
      price: 75000,
      quota: 20,
    },
    {
      title: 'Weekend Story Time: Adventures of the Clever Deer & Enchanted Forest',
      slug: 'story-time-dongeng',
      category: 'Story Time',
      description: 'A complimentary interactive storytelling session with hand puppets by Kak Nisa, followed by giant pop-up book reading and sing-alongs on the boutique’s plush story rug.',
      bannerImage: '/images/events/event-story-time.png',
      eventDate: new Date('2026-11-29T08:30:00.000Z'),
      timeString: '15:30–17:00 WIB',
      location: 'Boutique Story Rug Area, BabyShalls Malang',
      price: 0,
      quota: 20,
    },
    {
      title: 'Montessori & Sensory Play: Exploring Textures and Colors',
      slug: 'montessori-sensory',
      category: 'Workshop',
      description: 'Sensory bin play themed around mini safari habitats, exploring various textures of safe grains, water beads, and kinetic sand.',
      bannerImage: '/images/events/event-montessori.png',
      eventDate: new Date('2026-12-13T02:00:00.000Z'),
      timeString: '09:00–11:00 WIB',
      location: 'Workshop Corner, BabyShalls Citraland Malang',
      price: 95000,
      quota: 15,
    },
    {
      title: 'Fun Water Play: Weekend Sensory & Fine Motor Play',
      slug: 'water-play-sensory',
      category: 'Workshop',
      description: 'Ocean-themed water play featuring durable waterproof wooden toys and colorful natural sponges.',
      bannerImage: '/images/events/event-water-play.png',
      eventDate: new Date('2026-12-20T08:00:00.000Z'),
      timeString: '15:00–16:30 WIB',
      location: 'Open Courtyard, BabyShalls Boutique Malang',
      price: 0,
      quota: 25,
    },
    {
      title: 'Read-Aloud & Sensory Play for Toddlers (Ages 1–3)',
      slug: 'read-aloud-sensory-play-malang',
      category: 'Story Time',
      description: 'An interactive read-aloud session led by BabyShalls curator educators with child-safe sensory bins.',
      bannerImage: '/images/events/read-aloud-malang.jpg',
      eventDate: new Date('2026-12-05T03:00:00.000Z'),
      timeString: '10:00 - 11:30 WIB',
      location: 'BabyShalls Boutique, Citraland Puncak Tidar Blok HH-26, Malang',
      price: 0,
      quota: 20,
    },
  ];

  for (const ev of initialEvents) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {
        title: ev.title,
        description: ev.description,
        category: ev.category,
        bannerImage: ev.bannerImage,
        eventDate: ev.eventDate,
        timeString: ev.timeString,
        location: ev.location,
        price: ev.price,
        quota: ev.quota,
      },
      create: ev,
    });
  }

  // 6. Hero Carousel 4 Slides (Semi-CMS SiteContent)
  const heroSlides = [
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
