# BabyShalls — Design System & Brand Style Guide
**Version:** 4.0 (Total Overhaul — Fresh Minimalist Boutique)  
**Status:** Master Design Standard  
**Store Concept:** Curated Children's Bookstore & Educational Wooden Toys Boutique  
**Location:** Kota Malang, Jawa Timur  
**Visual Benchmarks:**
- **[https://paulettekids.com/](https://paulettekids.com/)** — *Clean white canvas, bold editorial color-blocking, 50/50 story & store splits, airy uppercase navigation.*
- **[https://papermoonbooks.nl/](https://papermoonbooks.nl/)** — *Centered emblem header, pure-white product-first bookshop grids, bright yellow subpage bands & CTAs, ultra-clean minimal forms.*

---

## 1. Brand Philosophy & Aesthetic Vision

BabyShalls mengadopsi pendekatan **Fresh Minimalist Editorial Boutique**: antarmuka yang bersih, lapang, modern, dan sangat mudah dipahami oleh **semua kalangan pengguna**—mulai dari orang tua muda, pencari kado (*gift hunters*), hingga pendidik PAUD/TK—di perangkat mobile maupun desktop.

### Prinsip Inti (Menggantikan Konsep Lama)
1. **Pure White Canvas (`#FFFFFF`):** Seluruh halaman dibangun di atas latar putih bersih dengan *whitespace* yang lega. Tidak ada lagi latar krem/peach berlapis atau *gradient* berat yang membuat halaman terasa penuh.
2. **Product-First Visibility:** Sampul buku anak dan tekstur mainan kayu adalah bintang utama. Kartu produk dibuat tanpa kotak/bayangan berat agar foto produk langsung menonjol (*stand out*).
3. **Zero Ornamental Clutter:** Seluruh dekorasi berlebih (gelombang SVG berlapis, *floating hearts*, *twinkle stars*, *confetti dots*, *sunburst doodles*, dan dedaunan pinggir layar) **dihapus sepenuhnya**.
4. **Bold, Purposeful Color Accents:** Warna cerah hanya digunakan secara terarah pada *subpage header band*, tombol CTA utama, dan *editorial campaign banner*—persis seperti keseimbangan visual pada **Paper Moon Books** dan **Paulette Kids**.

---

## 2. Fresh Color Palette & Design Tokens

Seluruh design token lama (`cream`, `peach`, `salmon`, `terracotta`, `warmbrown`, dll.) **dibuang** dan digantikan dengan sistem token baru yang tajam, kontras tinggi, dan minimalis.

### 2.1 CSS Variables Specification

```css
:root {
  /* 1. Canvas & Neutral Surfaces */
  --color-bg-page:           #FFFFFF; /* Kanvas utama halaman (Pure White) */
  --color-bg-subtle:         #F7F7F5; /* Latar netral sangat lembut untuk foto/section alternatif */
  --color-bg-muted:          #EFEFED; /* Placeholder gambar & hover surface ringan */

  /* 2. Typography & Ink (High Contrast) */
  --color-ink-primary:       #1A1A1A; /* Judul utama, teks body, ikon header */
  --color-ink-secondary:     #555555; /* Deskripsi, subjudul, metadata produk */
  --color-ink-muted:         #8C8C8C; /* Placeholder input, teks sekunder */
  --color-ink-inverse:       #FFFFFF; /* Teks di atas latar gelap/berwarna */

  /* 3. Primary & Editorial Brand Accents */
  --color-accent-sun:        #FFD200; /* CTA utama, header band subhalaman (ala Paper Moon Books) */
  --color-accent-sun-hover:  #EBC000; /* Hover state tombol utama */
  --color-brand-forest:      #1E543B; /* Banner koleksi spesial, judul editorial, status tersedia (ala Paulette) */
  --color-brand-forest-dark: #153D2A; /* Hover state tombol/aksen forest */
  --color-brand-coral:       #E04F5F; /* Badge Sale / New / highlight playful */
  --color-brand-amber:       #E58A3C; /* Eyebrow label kategori/cerita (mis. "OUR STORY") */

  /* 4. Borders & Dividers */
  --color-border-hairline:   #E5E5E5; /* Garis pemisah tipis header, footer, tabel */
  --color-border-input:      #CCCCCC; /* Border input form minimalis */
  --color-border-focus:      #1A1A1A; /* Border fokus aktif (aksesibilitas keyboard) */

  /* 5. Functional & Status */
  --color-whatsapp:          #25D366; /* Floating WhatsApp CS Malang */
  --color-whatsapp-hover:    #20BA59;
  --color-error:             #D9383A;
  --color-success:           #1E543B;

  /* 6. Radius & Elevation (Crisp & Minimal) */
  --radius-none:             0px;     /* Banner full-bleed & subpage band */
  --radius-sm:               4px;     /* Input form & tombol kotak bersih */
  --radius-md:               8px;     /* Thumbnail editorial & kartu info */
  --radius-pill:             9999px;  /* Badge kecil & floating action */
  --shadow-subtle:           0 2px 10px rgba(0, 0, 0, 0.06);
}
```

### 2.2 Color Swatch Quick Reference

| Token | Hex Code | Peran Semantik |
| :--- | :--- | :--- |
| `--color-bg-page` | `#FFFFFF` | Kanvas utama putih bersih di seluruh halaman |
| `--color-bg-subtle` | `#F7F7F5` | Latar foto produk & blok info netral |
| `--color-ink-primary` | `#1A1A1A` | Teks utama, harga, ikon navigasi (kontras maksimal) |
| `--color-ink-secondary` | `#555555` | Deskripsi produk, jam buka, sub-copy |
| `--color-accent-sun` | `#FFD200` | Tombol CTA utama (`Explore`, `Send`) & pita judul subhalaman |
| `--color-brand-forest` | `#1E543B` | *Special Collection* full-width banner & judul *Our Story* |
| `--color-brand-coral` | `#E04F5F` | Badge *New* / *Sale* & aksen promo terbatas |
| `--color-border-hairline` | `#E5E5E5` | Garis pemisah halus antar-elemen |

---

## 3. Typography Architecture

Mengikuti gaya tipografi bersih pada **Paulette Kids** dan **Paper Moon Books**, BabyShalls beralih ke **single-family modern geometric sans-serif** yang sangat rapi, ramah dibaca anak maupun orang dewasa, dan bebas kesan kaku.

```text
Headings & Display  : Plus Jakarta Sans (SemiBold / Bold, tight tracking)
Body, Nav & Forms   : Plus Jakarta Sans (Regular / Medium)
```

### 3.1 Typographic Hierarchy & Scale

| Level | Font Family | Size (Desktop) | Size (Mobile) | Line Height | Weight & Style |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page / Hero Title (H1)** | Plus Jakarta Sans | `36px - 44px` | `26px - 30px` | `1.15 - 1.2` | `700` (Bold) |
| **Section Title (H2)** | Plus Jakarta Sans | `26px - 32px` | `22px - 24px` | `1.25` | `600 - 700` |
| **Editorial Eyebrow** | Plus Jakarta Sans | `12px` | `11px` | `1.2` | `700`, `uppercase`, `letter-spacing: 0.08em` |
| **Nav Links (Header)** | Plus Jakarta Sans | `13px - 14px` | `15px` | `1.2` | `500`, `letter-spacing: 0.03em` |
| **Body & Story Copy** | Plus Jakarta Sans | `15px` | `14px` | `1.65` | `400` (Regular) |
| **Product Title** | Plus Jakarta Sans | `14px - 15px` | `13.5px` | `1.35` | `500` (Medium) |
| **Product Price (IDR)** | Plus Jakarta Sans | `14px - 15px` | `14px` | `1.2` | `600 - 700` |
| **CTA Button** | Plus Jakarta Sans | `14px` | `14px` | `1.0` | `700` (Bold) |

---

## 4. Layout & Structural Patterns (Referensi Langsung)

### 4.1 Header & Navigasi (Menggabungkan Paper Moon & Paulette)
- **Tampilan Desktop (2-Baris Rapi atau 1-Baris Terpusat):**
  - **Baris Atas:** Ikon *Search* di kiri, **Logo BabyShalls** tepat di tengah, ikon *Account* dan *Shopping Bag* (dengan counter item) di kanan.
  - **Baris Bawah:** Menu navigasi satu baris terpusat dengan spasi lega (`Shop`, `Age 0–1`, `Age 1–3`, `Age 3–6`, `Toys`, `Events`, `Request a Book`, `About`).
  - Latar putih solid (`#FFFFFF`) dengan garis bawah halus `1px solid #E5E5E5`.

### 4.2 Beranda Minimalis & Editorial Blocks
1. **Intro Singkat + CTA Tunggal (Ala Paper Moon Books):**
   - Blok teks terpusat maksimal 3 baris di atas kanvas putih memperkenalkan kurasi buku & mainan kayu BabyShalls, diikuti 1 tombol CTA kuning (`#FFD200`, teks `#1A1A1A`).
2. **Hero Full-Bleed Split / Banner (Ala Paulette Kids & Paper Moon):**
   - Dapat menggunakan split 50/50 bersih (foto tajam di kiri, panel warna/kolase editorial di kanan) atau satu banner ilustrasi/fotografi horizontal penuh. Tanpa gelombang SVG atau stiker melayang yang menutupi konten.
3. **Katalog Produk Minimalis (`New In!` & `Best Sellers`):**
   - Grid 4–5 kolom di desktop, 2 kolom di mobile dengan *gap* yang lega (`24px - 32px`).
4. **Blok *Special Collection* (Ala Paulette `Born to Love`):**
   - Seksi *full-width* berlatar `--color-brand-forest` (`#1E543B`), judul kuning cerah (`#FFD200`), deskripsi singkat terpusat, dan tombol *outline* tipis (`border: 1px solid #FFD200`).
5. **Blok *Our Story* & *Our Store (Malang)* (50/50 Split):**
   - Sisi kiri: foto toko / peta lokasi interaktif yang jelas.
   - Sisi kanan: kanvas putih luas dengan eyebrow oranye (`OUR STORY` / `MALANG STORE`), judul hijau/hitam, dan jam operasional yang mudah dibaca.

### 4.3 Subpage Header Band (Ala Paper Moon `Events` / `About`)
- Setiap halaman sekunder (`/about`, `/events`, `/request-book`, `/catalog`) diawali dengan **pita judul horizontal penuh** berlatar `--color-accent-sun` (`#FFD200`) dengan teks judul terpusat berwarna `#1A1A1A`. Simpel, ikonik, dan langsung memberi orientasi halaman kepada user.

---

## 5. Component Specifications

### 5.1 Product Card (Stand-Out Tanpa Noise)
- **Container:** Latar `#FFFFFF`, **tanpa border luar** dan **tanpa shadow permanen**.
- **Image Area:** Latar `#F7F7F5` (atau foto latar putih bersih), rasio `3:4` untuk buku dan `1:1` untuk mainan kayu. Hover: *subtle image zoom* (`scale(1.03)`).
- **Badge Minimal:** Maksimal 1 badge kecil di pojok kiri atas hanya jika relevan (`New`, `Sale`, atau `Age 1–3`).
- **Info Area:** Rata kiri atau tengah bersih—Judul Produk (maks. 2 baris) + Harga IDR. Tombol *Quick Add to Cart* muncul rapi saat hover (desktop) atau sebagai tombol ringkas di bawah harga (mobile).

### 5.2 Primary & Secondary Buttons
- **Primary CTA (Paper Moon Style):**
  - Background: `#FFD200` | Text: `#1A1A1A` | Padding: `12px 28px` | Radius: `4px` | Font: `700`.
  - Hover: `#EBC000`.
- **Secondary / Dark CTA:**
  - Background: `#1A1A1A` (atau `#1E543B`) | Text: `#FFFFFF` | Radius: `4px`.
- **Outline CTA (Di atas banner gelap):**
  - Background: `transparent` | Border: `1px solid #FFD200` | Text: `#FFD200` | Hover: isi `#FFD200`, teks `#1A1A1A`.

### 5.3 Minimalist Form Controls (Book Request & Event Registration)
- Mengikuti form halaman *Educators* & *Events* **Paper Moon Books**:
  - Input field berlatar `#FFFFFF`, border `1px solid #CCCCCC`, radius `2px - 4px`, tinggi minimum `44px` (ramah sentuh).
  - Placeholder singkat & jelas, fokus border berubah tegas menjadi `1px solid #1A1A1A`.
  - Tombol submit rata kiri beraksen `#FFD200` atau `#1A1A1A`.

### 5.4 Floating WhatsApp CTA (Paulette Kids Style)
- Posisi tetap di pojok kanan bawah (`bottom: 24px; right: 24px; z-index: 90;`).
- Ikon lingkaran hijau `#25D366` berdiameter `52px` dengan bayangan halus—tanpa animasi *pulse* berulang yang mengganggu mata.

---

## 6. Photography & Art Direction

1. **Foto Produk (Prioritas Tertinggi):**
   - Latar belakang putih bersih atau abu-abu hangat netral (`#F7F7F5`) dengan pencahayaan merata dan bayangan natural.
   - Tidak ada teks promosi atau stiker grafis yang ditempel di atas foto produk.
2. **Foto Lifestyle & Toko:**
   - Foto anak membaca atau bermain mainan kayu dengan ekspresi natural dan pencahayaan terang/cerah (*bright & airy*).
   - Bingkai foto tajam (`0px`) untuk split 50/50 full-bleed, atau sudut lembut (`8px`) untuk foto di dalam konten artikel.

---

## 7. Responsive Breakpoint Matrix

| Viewport | Lebar Layar | Perilaku Layout |
| :--- | :--- | :--- |
| **Desktop Wide** | `>= 1280px` | Container konten `max-width: 1280px` (kecuali banner full-bleed & pita kuning penuh). Grid produk 4–5 kolom. |
| **Desktop / Laptop** | `1025px - 1279px` | Grid produk 4 kolom, header 2-baris tetap satu baris menu tanpa wrap. |
| **Tablet** | `769px - 1024px` | Grid produk 3 kolom, split section 50/50 tetap bersebelahan dengan padding proporsional. |
| **Mobile** | `<= 768px` | Grid produk **2 kolom** (standar e-commerce modern), split section menumpuk vertikal (gambar di atas, teks di bawah), menu pindah ke *slide-out drawer* bersih, target sentuh minimal `44x44px`. |

---

## 8. Motion & Accessibility Standards

1. **Restrained Motion:**
   - Hanya gunakan transisi UI fungsional (`0.18s ease` untuk hover warna/zoom gambar produk dan `0.25s ease` untuk slide drawer keranjang/menu).
   - **Dilarang** menggunakan animasi *infinite loop* dekoratif.
   - Hormati `prefers-reduced-motion: reduce`.
2. **Universal Usability (WCAG AA):**
   - Teks `#1A1A1A` di atas `#FFFFFF` (kontras `17.4:1`) dan di atas `#FFD200` (kontras `12.6:1`)—sangat mudah dibaca oleh pengguna dari segala usia.
   - Target klik minimal `44x44px` di seluruh tombol dan tautan mobile.

---

## 9. Implementation Governance

1. **Clean Token Discipline:** Gunakan hanya token `--color-*` pada Dokumen v4.0 ini. Hapus referensi token lama (`--color-cream`, `--color-terracotta`, `--color-warmbrown`, `--color-peach`, `--color-salmon`) saat refactor stylesheet/Tailwind config.
2. **Let Products Breathe:** Jaga jarak antar elemen dan pertahankan kanvas `#FFFFFF`. Jika sebuah elemen tidak membantu user menemukan, memahami, atau membeli produk—jangan tampilkan.
