# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# E-COMMERCE PLATFORM BABYSHALLS

**Versi Dokumen:** 1.0.0  
**Tanggal Rilis:** 8 November 2026  
**Status:** Approved / Master Reference  
**Disusun Berdasarkan:** 
- Proposal Penawaran Pembangunan Website E-Commerce BabyShalls v3 (8 November 2026)
- Laporan Audit & Roadmap Refokus Arsitektur BabyShalls
- BabyShalls Warm Style Guide & Design Tokens (`DESIGN.md`)
- Master Prototipe Antarmuka (`html-mockup/index.html`)

---

## 1. Ringkasan Eksekutif & Visi Produk

### 1.1 Visi Produk
BabyShalls adalah butik toko buku anak kurasi (*curated children's bookstore*) dan mainan edukasi kayu (*educational wooden toys*) yang berbasis di Kota Malang, Jawa Timur. Setelah lebih dari 7 tahun sukses melayani ribuan pelanggan via marketplace (Shopee rating 5.0, 359 penilaian) dan komunitas Instagram (@babyshalls, 21,3k followers), BabyShalls beralih memiliki kanal digital mandiri (*direct-to-consumer/D2C*).

Website E-Commerce BabyShalls dibangun sebagai platform terpadu satu pintu (*single-door hub*) yang mengintegrasikan:
1. **Penjualan Katalog Produk Mandiri** dengan pembayaran online otomatis (Midtrans).
2. **Kalkulasi Logistik Multi-Kurir Otomatis** dengan titik keberangkatan terverifikasi dari Kota Malang (KiriminAja).
3. **Pendaftaran Workshop & Event Edukasi Anak** (Storytelling session, Market Day).
4. **Layanan Khusus Permintaan Buku Impor (*Book Request / Jastip*)**.
5. **Dashboard Operasional Mandiri (Semi-CMS)** untuk manajemen produk, pesanan, banner promo, dan leads tanpa sentuh kode.

### 1.2 Target Sukses Fase 1
- Peluncuran platform stabil dalam **4 minggu kerja**.
- Checkout mulus dengan konfirmasi pembayaran seketika tanpa cek mutasi manual.
- Tampilan responsif cepat dengan konsep estetika *Warm Cozy Living Storybook*.
- Biaya operasional hemat & efisien, stabil di server spesifikasi terjangkau (VPS Hostinger KVM 1: 1 vCPU, 4 GB RAM).

---

## 2. User Persona & Target Audiens

| Persona | Profil & Karakteristik | Kebutuhan Utama | Touchpoint di Website |
| :--- | :--- | :--- | :--- |
| **Bunda Sarah (28–36 th)** | Ibu muda modern, peduli stimulasi literasi & *sensory play* anak usia 0–5 tahun. | Mencari buku yang pas untuk usia anaknya tanpa bingung menyaring ribuan judul acak. | Filter **Shop by Age**, rekomendasi New Arrivals, detail bobot buku. |
| **Tante Lina (25–32 th)** | Kerabat / teman yang mencari kado ulang tahun atau kelahiran bayi (*gift hunter*). | Opsi kado siap kirim, kemasan cantik (*free gift wrapping*), kartu ucapan. | Bagian **Gift Hampers**, opsi alamat pengiriman fleksibel. |
| **Ibu Guru Maya (30–45 th)** | Pendidik PAUD / TK atau pegiat *homeschooling*. | Mencari buku referensi impor langka dan ingin mendaftarkan anak didiknya ke workshop edukatif. | Modul **Book Request**, katalog **Workshops & Events**. |
| **Admin BabyShalls (Malang)** | Tim operasional toko fisik & online BabyShalls. | Memproses pesanan cepat, request pickup kurir dalam 1 klik, update banner promo mingguan. | **Dashboard Admin**, panel Semi-CMS, manajemen pesanan. |

---

## 3. Ruang Lingkup Proyek (Scope of Work)

### 3.1 In-Scope (Fase 1)
- **Modul M1: Toko & Pembayaran**
  - Katalog buku dan mainan kayu dengan filter usia (*Newborn+*, *1-3*, *3+*, *6+*), kategori, pencarian teks, dan pengurutan harga/terbaru.
  - Halaman detail produk (galeri multi-foto, badge usia, berat gram, deskripsi, stok real-time, produk terkait).
  - Keranjang belanja (slide-out cart drawer + dedicated cart page) dengan state persistensi lokal/server.
  - Multi-address per user (pilih alamat pengiriman saat checkout).
  - Integrasi Midtrans Snap (QRIS, Kartu Kredit, Debit Online) dengan webhook otomatis.
- **Modul M2: Pengiriman Terintegrasi (KiriminAja)**
  - Cek ongkir multi-kurir real-time dari origin tetap: **Kota Malang, Jawa Timur**.
  - Pilihan layanan kurir (Reguler / Express) dengan biaya transparan.
  - Pembuatan pickup request dari Admin, cetak/simpan resi, dan pelacakan resi bagi pelanggan.
- **Modul M3: Manajemen Akun & Pengguna**
  - Sistem peran 2 level: `USER` (Pelanggan) dan `ADMIN` (BabyShalls).
  - Autentikasi aman (Register, Login, Update Profil, Buku Alamat, Riwayat Pesanan).
- **Modul M4: Event & Workshop (Versi Ringkas)**
  - Daftar workshop, detail acara (tanggal, lokasi, kuota, instruktur).
  - Formulir pendaftaran peserta langsung masuk ke database admin.
- **Modul M5: Layanan Book Request (Jastip Buku Impor)**
  - Formulir permintaan buku (judul, penulis, kontak WA/email, catatan).
  - Manajemen status permintaan & catatan penawaran di dashboard admin.
- **Modul M6: Admin Dashboard & Semi-CMS**
  - CRUD produk & kelola stok.
  - Manajemen pesanan & status logistik.
  - Semi-CMS: ganti teks banner announcement, banner hero, dan promo hampers tanpa sentuh kode.
  - Rekap statistik penjualan ringkas (omzet, total order, leads pendaftar event, leads request buku).
- **Floating Contact CTA**: Tombol WhatsApp mengambang dinamis ke nomor CS Malang.

### 3.2 Out-of-Scope (Dialokasikan ke Fase 2)
- Tiket QR check-in peserta workshop di lokasi fisik.
- Kalender interaktif event.
- Sinkronisasi stok 2 arah otomatis dengan akun Shopee (stok website dikelola independen di fase 1).
- Fitur multi-tenant / multi-seller marketplace (ditiadakan demi single boutique).
- Aplikasi mobile native Android/iOS (fase 1 difokuskan pada Progressive Web App / Mobile Responsive Web).

---

## 4. Persyaratan Fungsional Detail (Functional Specs)

```mermaid
flowchart TD
    User([Pelanggan]) --> Home[Beranda Cozy]
    Home --> FilterAge[Shop by Age / Katalog]
    FilterAge --> ProdDetail[Detail Produk & Berat Gram]
    ProdDetail --> Cart[Keranjang Belanja]
    Cart --> Checkout[Halaman Checkout]
    Checkout --> KiriminAja[Kalkulasi Ongkir KiriminAja - Malang]
    KiriminAja --> PayMidtrans[Bayar via Midtrans Snap]
    PayMidtrans --> WebhookMidtrans{Webhook Sukses?}
    WebhookMidtrans -->|Ya| OrderPaid[Pesanan Terbayar & Masuk Admin]
    OrderPaid --> AdminPickup[Admin Request Pickup Kurir]
    AdminPickup --> Tracking[Pelanggan Lacak Resi]
```

### 4.1 Modul M1: Toko & Transaksi
- **Filter Kelompok Usia Wajib**:
  1. `Newborn+` (0 – 1 tahun) — *Board books, high-contrast, sensory play*.
  2. `Ages 1-3` (1 – 3 tahun) — *Toddler picture books, wooden stackers*.
  3. `Ages 3+` (3 – 5 tahun) — *Storybooks, interactive pretend play*.
  4. `Ages 6+` (6+ tahun) — *Early chapter books, STEM wooden puzzles*.
- **Parameter Produk Wajib**: `id`, `slug`, `title`, `price`, `salePrice`, `weightInGrams` (krusial untuk logistik), `stock`, `ageGroup`, `category`, `images[]`, `description`, `isbn`, `isNewArrival`, `isFeatured`.

### 4.2 Modul M2: Pengiriman (KiriminAja)
- Alamat asal (*origin*) toko dikunci di:  
  **Kecamatan Klojen / Lowokwaru, Kota Malang, Jawa Timur**.
- Payload request kalkulasi ongkir menghitung akumulasi total `weightInGrams` produk di keranjang.
- Mendukung kurir umum KiriminAja (J&T, SiCepat, JNE, Anteraja, Pos Indonesia).

### 4.3 Modul M4 & M5: Event & Book Request
- **Event**: Input form mencakup Nama Orang Tua, Nama Anak, Usia Anak, WhatsApp, Email, Jumlah Tiket.
- **Book Request**: Pelanggan dapat mengunggah referensi foto buku impor yang dicari. Notifikasi masuk ke database admin untuk dihubungi via WhatsApp.

---

## 5. Persyaratan Non-Fungsional (NFR)

1. **Clean Code & Modularitas**:
   - Arsitektur berbasis komponen independen (*atomic/modular design*).
   - *Type Safety* penuh menggunakan TypeScript.
   - Pemisahan yang ketat antara UI Layer (*Presentation*), Data Store/State, dan API Service.
2. **Performa & SEO**:
   - Google Lighthouse skor > 90 untuk Performance, Accessibility, Best Practices, dan SEO.
   - Pemanfaatan Server-Side Rendering (SSR) dan Server Components Next.js untuk indexing katalog buku di search engine.
   - Optimalisasi gambar otomatis (`next/image`) dengan format WebP/AVIF.
3. **Desain Ramah Aksesibilitas (WCAG AA)**:
   - Kontras warna teks memenuhi standar 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
   - Tombol dan navigasi memiliki target sentuh minimum 44x44 px pada perangkat sentuh (HP).
4. **Keamanan (Security)**:
   - Proteksi CSRF, sanitasi input XSS, hashing password Bcrypt (min 10 salt rounds).
   - Validasi payload Midtrans signature key pada setiap webhook notifikasi.
   - Rate limiting untuk endpoint registrasi dan login.

---

## 6. Spesifikasi Desain & Design Tokens

### 6.1 Palet Warna Resmi
```css
:root {
  --color-cream: #FCF6EC;         /* Latar utama lembut */
  --color-cream-light: #FFF8EF;   /* Background halaman */
  --color-offwhite: #FFF9F0;      /* Kartu netral */
  --color-peach: #FCE0D4;         /* Latar kartu Shop by Age */
  --color-peach-light: #FFE4D0;   /* Aksen kartu */
  --color-salmon: #F6B79B;        /* Badge New & hover */
  --color-terracotta: #DA7A5B;    /* Tombol utama & Brand CTA */
  --color-terracotta-dark: #C46749; /* Hover tombol utama */
  --color-mustard: #F6C95E;       /* Top banner & rating bintang */
  --color-mustard-light: #FDF3D6; /* Aksen promo */
  --color-sage: #DCE6C6;          /* Badge usia 1-3 & tombol sekunder */
  --color-sage-light: #EBF2E0;    /* Background badge */
  --color-leaf: #A7C48A;          /* Daun dekoratif */
  --color-leaf-dark: #709154;     /* Status tersedia / aktif */
  --color-warmbrown: #6B3F2A;     /* Teks body utama */
  --color-warmbrown-dark: #502E1E;/* Judul serif Playfair */
  --color-border: #EEDBC9;        /* Border lembut */
  --color-whatsapp: #25D366;      /* Tombol WA mengambang */
}
```

### 6.2 Tipografi
- **Headings (H1, H2, H3)**: `Playfair Display`, serif hangat & anggun (Google Fonts).
- **Body & Controls**: `Nunito`, sans-serif bulat, ramah untuk orang tua & anak (Google Fonts).

---

## 7. Struktur Folder Proyek Next.js (Modular & Scalable)

```text
frontend/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Master Layout (Navbar, TopBar, Footer, CartDrawer)
│   │   ├── page.tsx                  # Beranda (Cloned dari html-mockup)
│   │   ├── catalog/                  # Halaman Katalog & Filter Usia
│   │   ├── product/[slug]/           # Detail Produk
│   │   ├── cart/                     # Dedicated Cart
│   │   ├── checkout/                 # Checkout & Shipping
│   │   ├── events/                   # Workshop & Events
│   │   ├── request-book/             # Form Book Request
│   │   ├── account/                  # Profil & Riwayat Pesanan Pelanggan
│   │   └── admin/                    # Dashboard Admin & Semi-CMS
│   ├── components/                   # Modular Components
│   │   ├── layout/                   # Header, AnnouncementBar, Footer, MobileNav
│   │   ├── home/                     # Hero, ShopByAge, NewArrivals, Hampers, Events, Reviews
│   │   ├── ui/                       # Reusable Atomic UI: Button, Badge, Card, Modal, Input
│   │   ├── product/                  # ProductCard, ProductGrid, AgeFilter
│   │   └── cart/                     # CartDrawer, CartItem, CartSummary
│   ├── context/                      # React Context (Cart, UI Drawer state)
│   ├── hooks/                        # Custom React Hooks
│   ├── lib/                          # Utility & Helper Functions (formatIDR, KiriminAja, Midtrans)
│   ├── types/                        # TypeScript Interface & Type Definitions
│   └── styles/                       # Global Tailwind CSS & Custom Animation
├── tailwind.config.ts                # BabyShalls Custom Color Tokens & Typography
├── tsconfig.json
└── package.json
```

---

## 8. Milestone Rencana Rilis (4 Minggu)

- **Minggu 1**: Inisialisasi Fresh Scaffold Next.js + Konfigurasi Design Tokens + Implementasi Komponen Beranda Modular dari Mockup + Setup Skema Data.
- **Minggu 2**: Halaman Katalog (Shop by Age), Halaman Detail Produk, State Keranjang Belanja & Checkout UI.
- **Minggu 3**: Integrasi API Midtrans Snap + Service KiriminAja Malang + Modul Form Event & Book Request.
- **Minggu 4**: Dashboard Admin Semi-CMS + Testing End-to-End Transaksi + Setup Nginx/PM2 di VPS Hostinger KVM 1.

