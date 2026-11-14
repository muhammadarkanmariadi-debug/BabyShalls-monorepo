<<<<<<< HEAD
# Babyshalls — Butik Buku Cerita Anak & Mainan Edukatif Malang

> **Brand Identity:** Kurasi Buku Cerita Anak, Mainan Edukasi Kayu Montessori, Hampers Kado Personal & Storytelling Workshop.  
> **Lokasi Butik:** Citraland Puncak Tidar HH-26, Kalisongo, Dau, Kota Malang, Jawa Timur  
> **Instagram:** [@babyshalls](https://instagram.com/babyshalls)  
> **Konsep Proyek:** **Web Katalog & Showcase Kurasi Buku Anak**. Didesain dengan estetika yang hangat, terang, dan nyaman (*warm, bright, & cozy*) untuk menonjolkan nilai cerita, kualitas bahan buku/mainan ramah anak, dan mempermudah orang tua berkonsultasi langsung via WhatsApp.

---

## 🏗️ Struktur Proyek

```text
babyshalls/
├── babyshalls-frontend/        # Next.js 16 (App Router, Tailwind CSS v4, Lucide Icons)
│   ├── app/
│   │   ├── admin/
│   │   │   ├── page.tsx        # Dashboard Manajemen Katalog Kurator & Staf Toko
│   │   │   └── login/page.tsx  # Portal Login Admin dengan tombol akun demo 1-klik
│   │   ├── layout.tsx          # Tipografi Playfair Display & Nunito via Google Fonts
│   │   ├── page.tsx            # Halaman Web Katalog Utama (8+ Seksi Terkurasi)
│   │   └── globals.css         # Palet warna cream linen, terracotta, doodle sunburst
│   ├── src/
│   │   ├── components/         # Komponen Showcase & Katalog
│   │   │   ├── Header.tsx                 # Navbar sticky, search live, admin link, info butik
│   │   │   ├── Hero.tsx                   # Gelombang organik, foto membaca balita, trust badge
│   │   │   ├── CuratorSpotlight.tsx       # Sorotan 2 buku pilihan kurator bulan ini
│   │   │   ├── ShopByAge.tsx              # 4 kartu kategori usia bergambar vektor lembut
│   │   │   ├── ReadingGuideSection.tsx    # Panduan membaca anak menurut tahap tumbuh kembang
│   │   │   ├── ProductCatalog.tsx         # Katalog 16 buku & mainan dengan filter & WA inquiry
│   │   │   ├── ProductQuickViewModal.tsx  # Modal detail lengkap (sinopsis, nilai moral, spesifikasi)
│   │   │   ├── GiftHampersBanner.tsx      # Banner kado hampers kayu pinus
│   │   │   ├── GiftWrapping.tsx           # Layanan bungkus kado, pita rami, kartu tulisan tangan
│   │   │   ├── WorkshopBanner.tsx         # Agenda workshop mendongeng di Citraland Puncak Tidar
│   │   │   ├── ReviewsSection.tsx         # Ulasan & testimoni orang tua (★ 5.0)
│   │   │   ├── OrderDrawer.tsx            # Slide-over keranjang minat baca & checkout WhatsApp
│   │   │   ├── StoreInfoModal.tsx         # Lokasi peta toko Malang & jam buka
│   │   │   ├── WorkshopModal.tsx          # Formulir reservasi kegiatan workshop
│   │   │   └── Footer.tsx                 # Informasi butik, jam buka & metode pembayaran
│   │   ├── context/
│   │   │   └── CartContext.tsx            # State keranjang bacaan & generator pesan WhatsApp
│   │   ├── data/
│   │   │   └── mockProducts.ts            # 16 data koleksi buku & mainan realistis
│   │   └── types/
│   │       └── index.ts                   # Tipe TypeScript frontend
│   ├── postcss.config.mjs
│   └── package.json
│
├── babyshalls-backend/         # Express.js REST API Server
│   ├── src/
│   │   ├── index.ts            # Entry point Express dengan fallback port otomatis
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /api/auth/login & GET /api/auth/me (Admin Auth)
│   │   │   ├── products.ts     # CRUD Katalog: GET, POST, PUT, DELETE /api/products
│   │   │   ├── orders.ts       # POST /api/orders (Pencatatan reservasi / order)
│   │   │   └── workshops.ts    # GET /api/workshops
│   │   ├── data/
│   │   │   └── mockData.ts     # Data koleksi sinkron dengan frontend
│   │   └── types.ts            # Tipe TypeScript backend
│   └── package.json
│
└── package.json                # Root NPM workspace orchestrator
```

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Sekaligus (Frontend + Backend)
Dari root folder `babyshalls`:
```bash
npm run dev
```

### 2. Menjalankan Terpisah
```bash
# Frontend (Next.js 16) -> http://localhost:3000
npm run dev:frontend

# Backend API (Express.js) -> http://localhost:5001
npm run dev:backend
```

### 3. Build Production
```bash
npm run build
```

---

## 🔐 Akses Admin & Kurator

Halaman login dapat diakses di: **`http://localhost:3000/admin/login`**

Tersedia tombol **1-Klik Isi Akun Demo**:
* **Kurator Utama:**
  - Email: `admin@babyshalls.com`
  - Password: `babyshalls2025`
* **Staf Toko Malang:**
  - Email: `store@babyshalls.com`
  - Password: `admin123`

### Fitur Dashboard Admin (`/admin`):
- **Ringkasan Metrik:** Jumlah total koleksi, buku cerita, mainan montessori, dan item ready.
- **Pencarian & Filter Cepat:** Cari berdasarkan judul, penulis, penerbit, kategori, dan ketersediaan.
- **Tambah Koleksi Baru:** Form modal lengkap untuk mendaftarkan buku atau mainan baru ke katalog.
- **Edit & Hapus Produk:** Perbarui informasi atau hapus dari katalog.
- **Toggle Status Stok:** Mengubah ketersediaan (*Ready di Toko* ↔ *Pre-Order / Habis*) dengan 1 klik langsung dari tabel.
- **Sinkronisasi Instan:** Perubahan di admin langsung tersimpan dan otomatis tampil di halaman katalog publik.

---

## 🍃 Keistimewaan Kurasi Katalog Publik
1. **Sorotan Kurator Bulan Ini:** Mengulas karya klasik (*The Boy, The Mole, The Fox and The Horse*) dan cerita lokal Malang (*Bintang Kecil & Keajaiban Hutan Puncak Tidar*).
2. **Panduan Membaca Anak:** Panduan usia membaca (0-2 thn, 3-5 thn, 6+ thn) untuk mendampingi orang tua.
3. **Katalog & Sinopsis Mendalam:** Tombol *Intip Sinopsis* menampilkan cuplikan cerita, nilai moral karakter, spesifikasi bahan, format buku, dan bahasa.
4. **Tanya Stok WhatsApp Terintegrasi:** Tombol *Tanya WA* otomatis menyusun pesan ramah yang menyebutkan judul buku dan harga untuk ditanyakan ke admin toko.
=======
# babyshalls-prototipe-haikal
>>>>>>> 4d9929b0283fb1293fa06c228e9faf84a2c0d9f1
