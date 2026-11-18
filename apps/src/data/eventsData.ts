export interface MockEvent {
  id: string;
  title: string;
  category: 'Workshop' | 'Story Time' | 'Market Day' | 'Live Sale';
  age: string;
  date: string;
  time: string;
  location: string;
  companion: string;
  image: string;
  price: number; // 0 for FREE, > 0 for PAID
  priceLabel: string; // 'GRATIS' or 'Rp75.000'
  isFree: boolean;
  quotaTotal: number;
  quotaFilled: number;
  seatsLeft: number;
  status: 'Tersedia' | 'Sisa Sedikit' | 'Penuh';
  description: string;
  agenda: { time: string; label: string }[];
  itemsToBring: string[];
  learnings: string[];
  facilities: string[];
}

export const ALL_EVENTS: MockEvent[] = [
  {
    id: 'nature-craft',
    title: 'Little Explorers: Nature Craft Workshop',
    category: 'Workshop',
    age: '3–6 tahun',
    date: 'Sabtu, 6 Desember 2026',
    time: '10.00–12.00 WIB',
    location: 'BabyShalls, Citraland Puncak Tidar HH-26, Malang',
    companion: 'Wajib didampingi 1 orang tua',
    image: '/images/events/event-workshop-alam.png',
    price: 75000,
    priceLabel: 'Rp75.000',
    isFree: false,
    quotaTotal: 20,
    quotaFilled: 14,
    seatsLeft: 6,
    status: 'Sisa Sedikit',
    description:
      'Anak-anak membuat kolase dari daun dan bunga kering sambil mendengarkan cerita tentang hutan. Semua bahan dan perlengkapan disediakan oleh BabyShalls.',
    agenda: [
      { time: '10.00', label: 'Registrasi & check-in QR' },
      { time: '10.15', label: 'Story time: Si Kecil di Hutan' },
      { time: '10.45', label: 'Membuat kolase alam & karya clay' },
      { time: '11.45', label: 'Foto bersama & pulang bawa karya' },
    ],
    itemsToBring: ['Tiket QR (di HP)', 'Celemek / baju ganti', 'Botol minum'],
    learnings: [
      'Melatih koordinasi motorik halus dan kekuatan jari jemari melalui cetakan clay alami',
      'Mengenalkan tekstur, aroma, dan warna dari dedaunan flora lokal Malang',
      'Membangun keberanian berkreasi dan percaya diri mengekspresikan ide',
      'Mempererat ikatan (bonding) interaktif antara orang tua dan anak',
    ],
    facilities: [
      'Seluruh bahan workshop (tanah liat alami, kanvas kayu, lem aman anak)',
      'Snack sehat & minuman jus buah segar untuk anak dan orang tua',
      'Sertifikat partisipasi Little Explorer BabyShalls',
      'Voucher belanja buku anak sebesar Rp 25.000',
    ],
  },
  {
    id: 'story-time-dongeng',
    title: 'Weekend Story Time: Petualangan Si Kancil & Hutan Ajaib',
    category: 'Story Time',
    age: '2–6 tahun',
    date: 'Minggu, 29 November 2026',
    time: '15.30–17.00 WIB',
    location: 'Area Karpet Baca Butik BabyShalls Malang',
    companion: 'Wajib didampingi 1 orang tua',
    image: '/images/events/event-story-time.png',
    price: 0,
    priceLabel: 'GRATIS',
    isFree: true,
    quotaTotal: 20,
    quotaFilled: 12,
    seatsLeft: 8,
    status: 'Tersedia',
    description:
      'Sesi mendongeng interaktif gratis dengan boneka tangan bersama Kak Nisa, dilanjutkan membaca buku pop-up dan bernyanyi bersama si kecil di area karpet empuk toko.',
    agenda: [
      { time: '15.30', label: 'Check-in & sambutan ceria' },
      { time: '15.45', label: 'Dongeng interaktif boneka tangan Kak Nisa' },
      { time: '16.20', label: 'Membaca buku bergambar bersama orang tua' },
      { time: '16.45', label: 'Tanya jawab seru & pembagian stiker' },
    ],
    itemsToBring: ['Tiket QR (di HP)', 'Kaus kaki bersih untuk area karpet'],
    learnings: [
      'Menumbuhkan minat baca dan imajinasi sejak usia dini',
      'Mengenal nilai moral kejujuran dan tolong menolong melalui karakter cerita',
      'Meningkatkan perbendaharaan kosakata dan daya konsentrasi anak',
    ],
    facilities: [
      'Akses bebas ke pojok baca & ribuan buku display butik',
      'Stiker karakter dongeng lucu untuk semua peserta',
      'Minuman air mineral & biskuit anak',
    ],
  },
  {
    id: 'market-day-cilik',
    title: 'Kids Market Day: Belajar Berniaga & Menghargai Buku',
    category: 'Market Day',
    age: '4–9 tahun',
    date: 'Sabtu, 12 Desember 2026',
    time: '10.00–13.00 WIB',
    location: 'Halaman Butik BabyShalls Citraland Malang',
    companion: 'Wajib didampingi 1 orang tua',
    image: '/images/events/event-market-day.png',
    price: 0,
    priceLabel: 'GRATIS',
    isFree: true,
    quotaTotal: 25,
    quotaFilled: 19,
    seatsLeft: 6,
    status: 'Tersedia',
    description:
      'Acara seru di mana anak-anak berlatih menjadi kasir cilik, bertukar buku cerita preloved favorit mereka, dan mempraktikkan konsep matematika dasar sambil bermain peran.',
    agenda: [
      { time: '10.00', label: 'Registrasi peserta lapak & briefing singkat' },
      { time: '10.30', label: 'Simulasi jual beli & tukar buku antar anak' },
      { time: '12.00', label: 'Penghitungan koin bintang & apresiasi' },
      { time: '12.45', label: 'Sesi penutupan & foto bersama' },
    ],
    itemsToBring: ['Tiket QR', '1–3 buku preloved kondisi baik untuk ditukar'],
    learnings: [
      'Mengenal nilai uang dan konsep hitungan sederhana melalui permainan kasir',
      'Melatih keterampilan komunikasi, negosiasi, dan sopan santun berniaga',
      'Mendidik kepedulian berbagi dan mendaur ulang buku bacaan',
    ],
    facilities: [
      'Meja lapak mini anak & label harga stiker lucu',
      'Koin bintang permainan kasir cilik',
      'Sertifikat Little Entrepreneur BabyShalls',
    ],
  },
  {
    id: 'sensory-clay-art',
    title: 'Sensory Modeling Clay: Membuat Tokoh Buku Favorit',
    category: 'Workshop',
    age: '3–8 tahun',
    date: 'Sabtu, 19 Desember 2026',
    time: '09.30–11.30 WIB',
    location: 'Area Workshop BabyShalls Citraland Malang',
    companion: 'Wajib didampingi 1 orang tua',
    image: '/images/events/event-workshop-alam.png',
    price: 50000,
    priceLabel: 'Rp50.000',
    isFree: false,
    quotaTotal: 15,
    quotaFilled: 15,
    seatsLeft: 0,
    status: 'Penuh',
    description:
      'Membentuk karakter ulat lapar dan hewan hutan dari clay berbahan dasar tepung gandum non-toksik berstandar food grade yang aman jika tak sengaja tertelan si kecil.',
    agenda: [
      { time: '09.30', label: 'Check-in tiket & pembagian paket clay' },
      { time: '09.45', label: 'Pengenalan teknik dasar pilin dan cetak' },
      { time: '10.15', label: 'Membentuk tokoh cerita favorit' },
      { time: '11.15', label: 'Pengemasan karya ke dalam kotak estetik' },
    ],
    itemsToBring: ['Tiket QR', 'Pakaian santai / celemek'],
    learnings: [
      'Eksplorasi sensorik 3 dimensi dan penguatan otot jari jemari',
      'Mengenal teori pencampuran warna dasar menggunakan clay',
      'Melatih ketelitian dan kesabaran menyelesaikan proyek karya',
    ],
    facilities: [
      '1 set clay food-grade organik warna-warni (bawa pulang)',
      'Alat pemotong dan cetakan kayu tumpul ramah anak',
      'Kotak packaging display karya',
      'Jus jeruk segar & snack sehat',
    ],
  },
  {
    id: 'live-sale-akhirtahun',
    title: 'Live Sale Akhir Tahun: Bedah Buku Impor & Diskon Eksklusif',
    category: 'Live Sale',
    age: 'Semua Usia',
    date: 'Jumat, 18 Desember 2026',
    time: '19.00–21.00 WIB',
    location: 'Online via Instagram Live @babyshalls',
    companion: 'Bebas / Online',
    image: '/images/events/event-story-time.png',
    price: 0,
    priceLabel: 'GRATIS',
    isFree: true,
    quotaTotal: 100,
    quotaFilled: 45,
    seatsLeft: 55,
    status: 'Tersedia',
    description:
      'Sesi siaran langsung interaktif mengulas 30+ judul buku board book dan picture book impor pilihan untuk persiapan liburan akhir tahun dengan flash sale hingga 40%.',
    agenda: [
      { time: '19.00', label: 'Pembukaan Live & Giveaway buku pertama' },
      { time: '19.15', label: 'Bedah 15 judul board book usia 0–3 tahun' },
      { time: '20.00', label: 'Flash sale eksklusif 15 menit harga khusus' },
      { time: '20.30', label: 'Bedah buku sains & ensiklopedia interaktif' },
    ],
    itemsToBring: ['Aplikasi Instagram di smartphone Anda'],
    learnings: [
      'Memilih buku anak yang tepat sesuai tahap perkembangan usia',
      'Mengenal fitur interaktif buku impor (lift-the-flap, touch and feel, sound book)',
    ],
    facilities: [
      'Voucher ongkir potongan Rp 15.000 selama sesi live',
      'Kesempatan memenangkan 5 giveaway buku cerita gratis',
    ],
  },
  {
    id: 'holiday-book-camp',
    title: 'Holiday Book Camp: 2 Hari Membaca & Melukis Kanvas',
    category: 'Workshop',
    age: '5–10 tahun',
    date: 'Sabtu – Minggu, 26–27 Desember 2026',
    time: '09.00–12.00 WIB',
    location: 'BabyShalls, Citraland Puncak Tidar HH-26, Malang',
    companion: 'Wajib didampingi 1 orang tua',
    image: '/images/events/event-market-day.png',
    price: 125000,
    priceLabel: 'Rp125.000',
    isFree: false,
    quotaTotal: 15,
    quotaFilled: 12,
    seatsLeft: 3,
    status: 'Sisa Sedikit',
    description:
      'Program liburan intensif 2 hari penuh kreativitas! Hari pertama bedah cerita dongeng dan teknik ilustrasi anak, hari kedua melukis kanvas bertema petualangan dengan cat non-toxic.',
    agenda: [
      { time: '09.00', label: 'Ice breaking & perkenalan kawan baru' },
      { time: '09.30', label: 'Membuat sketsa ilustrasi kanvas' },
      { time: '10.30', label: 'Pewarnaan kanvas dengan kuas & spons' },
      { time: '11.30', label: 'Pameran mini karya dan sertifikat' },
    ],
    itemsToBring: ['Tiket QR', 'Baju ganti / celemek melukis'],
    learnings: [
      'Mengembangkan imajinasi visual ke atas media kanvas lukis',
      'Meningkatkan rasa percaya diri dan interaksi sosial dengan teman sebaya',
    ],
    facilities: [
      'Kanvas lukis 30x40 cm + cat akrilik ramah anak (bawa pulang)',
      'Standing easel mini kayu',
      'Makan siang sehat bento box & susu kurma 2 hari berturut-turut',
      'Sertifikat Holiday Camp BabyShalls',
    ],
  },
];

export const PAST_EVENTS = [
  {
    id: 'past-1',
    title: 'Sensory Water Play & Bubbles',
    date: '12 Oktober 2026',
    image: '/images/events/event-workshop-alam.png',
    description: 'Eksplorasi sensorik gelembung sabun raksasa dan permainan air warna di taman butik.',
  },
  {
    id: 'past-2',
    title: 'Meet & Greet Penulis Buku Cerita Anak',
    date: '28 September 2026',
    image: '/images/events/event-story-time.png',
    description: 'Bincang hangat seputar parenting dan membaca nyaring bersama Bunda Arum.',
  },
  {
    id: 'past-3',
    title: 'Tukar Buku Preloved & Donasi Literasi Anak',
    date: '14 September 2026',
    image: '/images/events/event-market-day.png',
    description: 'Pengumpulan 200+ buku layak baca untuk disumbangkan ke perpustakaan desa binaan.',
  },
];

export function getEventById(id: string): MockEvent {
  const found = ALL_EVENTS.find((e) => e.id === id);
  if (found) return found;
  // Fallback to first event if not found
  return ALL_EVENTS[0];
}
