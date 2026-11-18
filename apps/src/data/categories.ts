export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  badge?: string;
  href: string;
}

export interface NavDropdownGroup {
  id: string;
  label: string;
  href: string;
  viewAllText: string;
  items: CategoryItem[];
}

export const AGE_GROUPS_DROPDOWN: NavDropdownGroup = {
  id: 'age-groups',
  label: 'Shop by Age',
  href: '/catalog?age=all',
  viewAllText: 'Lihat Semua Kategori Usia',
  items: [
    {
      id: 'age-newborn',
      name: 'Newborn+ (0–12 Bulan)',
      slug: 'Newborn+',
      description: 'Sensory play, high contrast board books & rattle lembut',
      badge: 'Sensory',
      href: '/catalog?age=Newborn%2B',
    },
    {
      id: 'age-1-3',
      name: 'Ages 1–3 (Toddler)',
      slug: 'Ages 1-3',
      description: 'Motorik halus, stacking rainbow & first picture books',
      badge: 'Motorik',
      href: '/catalog?age=Ages%201-3',
    },
    {
      id: 'age-3-plus',
      name: 'Ages 3+ (Preschool)',
      slug: 'Ages 3+',
      description: 'Interactive picture books, puzzle & montessori wooden toys',
      badge: 'Story',
      href: '/catalog?age=Ages%203%2B',
    },
    {
      id: 'age-6-plus',
      name: 'Ages 6+ (Early Reader)',
      slug: 'Ages 6+',
      description: 'Chapter books, STEM kits & creative thinking blocks',
      badge: 'STEM',
      href: '/catalog?age=Ages%206%2B',
    },
  ],
};

export const BOOKS_CATEGORIES_DROPDOWN: NavDropdownGroup = {
  id: 'books-categories',
  label: 'Books',
  href: '/catalog?category=Books',
  viewAllText: 'Lihat Seluruh Koleksi Buku',
  items: [
    {
      id: 'book-board',
      name: 'Board Books (Buku Papan Tebal)',
      slug: 'Board Books',
      description: 'Tebal, tahan gigit & sobek untuk bayi & balita',
      badge: 'Best Seller',
      href: '/catalog?category=Books&sub=Board%20Books',
    },
    {
      id: 'book-picture',
      name: 'Picture Books (Buku Dongeng)',
      slug: 'Picture Books',
      description: 'Ilustrasi hangat pembangun imajinasi & empati',
      href: '/catalog?category=Books&sub=Picture%20Books',
    },
    {
      id: 'book-sensory',
      name: 'Touch & Feel / Sound & Sensory',
      slug: 'Sound & Sensory',
      description: 'Tekstur rabaan & suara interaktif untuk stimulasi indra',
      href: '/catalog?category=Books&sub=Sound%20%26%20Sensory',
    },
    {
      id: 'book-early',
      name: 'Early Readers (Belajar Membaca)',
      slug: 'Early Readers',
      description: 'Kalimat berima bertahap untuk pembaca mula',
      href: '/catalog?category=Books&sub=Early%20Readers',
    },
    {
      id: 'book-import',
      name: 'Bilingual & Imported Books',
      slug: 'Buku Impor',
      description: 'Koleksi kurasi bahasa Inggris & bilingual favorit',
      badge: 'Impor',
      href: '/catalog?category=Books&sub=Buku%20Impor',
    },
    {
      id: 'book-preloved',
      name: 'Buku Anak Preloved Kurasi',
      slug: 'Preloved',
      description: 'Kondisi 95%+ disanitasi UV steril, harga ramah kantong',
      badge: 'Hemat',
      href: '/catalog?category=Preloved&sub=Books',
    },
  ],
};

export const TOYS_CATEGORIES_DROPDOWN: NavDropdownGroup = {
  id: 'toys-categories',
  label: 'Toys',
  href: '/catalog?category=Wooden%20Toys',
  viewAllText: 'Lihat Seluruh Mainan Kayu',
  items: [
    {
      id: 'toy-stacker',
      name: 'Wooden Stacking & Rainbows',
      slug: 'Wooden Stacking',
      description: 'Balok susun kayu pinus halus dengan cat non-toxic waterbased',
      badge: 'Eco Friendly',
      href: '/catalog?category=Wooden%20Toys&sub=Wooden%20Stacking',
    },
    {
      id: 'toy-sorter',
      name: 'Montessori Shape Sorters',
      slug: 'Shape Sorter',
      description: 'Melatih logika spasial, koordinasi mata & tangan balita',
      href: '/catalog?category=Wooden%20Toys&sub=Shape%20Sorter',
    },
    {
      id: 'toy-sensory',
      name: 'Sensory & Motoric Wooden Toys',
      slug: 'Sensory Toys',
      description: 'Rattle kayu, mobil dorong alami bersudut tumpul aman',
      href: '/catalog?category=Wooden%20Toys&sub=Sensory%20Toys',
    },
    {
      id: 'toy-puzzles',
      name: 'Wooden Blocks & Puzzles',
      slug: 'Wooden Puzzles',
      description: 'Puzzle kayu chunky ramah anak dengan pegangan ergonomis',
      href: '/catalog?category=Wooden%20Toys&sub=Wooden%20Puzzles',
    },
    {
      id: 'toy-preloved',
      name: 'Mainan Kayu Preloved Kurasi',
      slug: 'Preloved',
      description: 'Balok & montessori preloved higienis dan terawat',
      badge: 'Hemat',
      href: '/catalog?category=Preloved&sub=Wooden',
    },
  ],
};

export const HAMPERS_CATEGORIES_DROPDOWN: NavDropdownGroup = {
  id: 'hampers-categories',
  label: 'Hampers & Gifts',
  href: '/catalog?category=Gift%20Hampers',
  viewAllText: 'Kustomisasi Hamper Kado',
  items: [
    {
      id: 'hamper-newborn',
      name: 'Newborn Baby Welcome Set',
      slug: 'Newborn Hamper',
      description: 'Kombinasi board book + rattle kayu + kartu ucapan custom',
      badge: 'Populer',
      href: '/catalog?category=Gift%20Hampers&type=Newborn',
    },
    {
      id: 'hamper-birthday',
      name: 'Birthday Milestone Box (1–5 Thn)',
      slug: 'Birthday Hamper',
      description: 'Paket kado buku cerita & mainan edukasi berbungkus pita satin',
      href: '/catalog?category=Gift%20Hampers&type=Birthday',
    },
    {
      id: 'hamper-custom',
      name: 'Bespoke Wooden Gift Box',
      slug: 'Custom Hamper',
      description: 'Pilih sendiri isi buku & mainan, gratis pita & kartu kaligrafi',
      badge: 'Free Wrap',
      href: '/catalog?category=Gift%20Hampers&type=Custom',
    },
  ],
};
