# TECHNICAL REQUIREMENTS DOCUMENT (TRD)
# BabyShalls E-Commerce Platform

**Versi:** 1.0.0  
**Tujuan Dokumen:** Spesifikasi teknis, standar protokol integrasi, kontrak data, kebijakan caching, dan arsitektur dependensi library.

---

## 1. Spesifikasi Teknis & Stack Dependencies

### 1.1 Frontend Dependencies (`frontend/package.json`)
- **Core Framework**: `next` (v16.4+), `react` (v19.x), `react-dom` (v19.x).
- **Styling**: `tailwindcss` (v4.x), `@tailwindcss/turbopack`.
- **UI & Utilities**:
  - `lucide-react`: Ikon antarmuka seragam (line/outline).
  - `clsx` & `tailwind-merge`: Utility manajemen kelas dinamis (`cn()`).
  - `react-hot-toast`: Notifikasi *toast* mengambang yang ringan dan elegan.
  - `zustand` (opsional untuk *global state* skala besar jika dibutuhkan) / `CartContext` native.

### 1.2 Backend Dependencies (`backend/package.json`)
- **Core Runtime**: `express` (v4.21+), `typescript` (v5.7+), `tsx` (TypeScript execution).
- **Database & ORM**: `@prisma/client` (v6.2+), `prisma` CLI.
- **Cache & Key-Value Store**: `ioredis` (v5.4+) untuk koneksi pool Redis non-blocking.
- **Integrasi Pihak Ketiga**:
  - `midtrans-client`: Snap API payment gateway.
  - `axios`: HTTP client untuk integrasi API KiriminAja.
- **Keamanan & Validasi**:
  - `jsonwebtoken` & `@types/jsonwebtoken`: Pembuatan dan verifikasi token sesi.
  - `bcryptjs` & `@types/bcryptjs`: Hashing password aman (salt rounds: 10).
  - `cors`: Cross-Origin Resource Sharing.
  - `zod`: Skema validasi runtime untuk payload request API.
  - `dotenv`: Manajemen environment variable.

---

## 2. Kebijakan Caching Redis (Cache Contract & TTL)

Redis diintegrasikan di backend untuk mencegah beban berulang pada layanan pihak ketiga (*third-party rate limits*) dan database.

| Kategori Cache | Pola Key Redis | Format Data | Default TTL | Kebijakan Invalidasi |
| :--- | :--- | :--- | :--- | :--- |
| **Ongkir KiriminAja** | `shipping:rates:{destId}:{weightGrams}` | JSON Array | 3600 detik (1 Jam) | Otomatis expire (Time-based). |
| **Katalog Produk Populer** | `catalog:products:featured` | JSON Array | 900 detik (15 Menit) | Dihapus saat Admin update/create produk. |
| **Katalog Berdasarkan Usia** | `catalog:age:{ageGroup}` | JSON Array | 900 detik (15 Menit) | Dihapus saat Admin update/create produk. |
| **Detail Produk** | `product:detail:{slug}` | JSON Object | 1800 detik (30 Menit)| Dihapus saat stok / harga produk diubah. |
| **Konten Semi-CMS** | `cms:content:all` | JSON Key-Value | 7200 detik (2 Jam) | Dihapus seketika saat Admin simpan banner/teks. |
| **Rate Limiter Auth** | `ratelimit:auth:{ip}` | Integer Counter | 60 detik (1 Menit) | Otomatis expire (Maksimal 10 hit/menit). |

### 2.1 Pola Implementasi Cache (Cache-Aside Pattern)
Setiap panggilan fungsi kalkulasi ongkir atau pembacaan katalog mengikuti alur:
1. Cek keberadaan data di Redis dengan `redis.get(key)`.
2. Jika ada (*Cache Hit*): Parse JSON dan langsung kembalikan respons ke pengguna.
3. Jika tidak ada (*Cache Miss*): Panggil API KiriminAja / Query PostgreSQL via Prisma.
4. Simpan hasil ke Redis dengan `redis.setex(key, ttl, JSON.stringify(data))`.
5. Kembalikan respons ke pengguna.
6. **Graceful Fallback**: Jika server Redis mati (*unreachable*), sistem secara transparan beralih (*bypass*) langsung ke database/API tanpa memutus alur belanja pelanggan.

---

## 3. Kontrak Data Transaksi (Payload Structures)

### 3.1 Kalkulasi Pengiriman (KiriminAja)
- **Endpoint**: `POST /api/shipping/calculate`
- **Request Body**:
  ```json
  {
    "destinationSubdistrictId": 1234,
    "weightInGrams": 850
  }
  ```
- **Response Format**:
  ```json
  {
    "origin": "Kota Malang, Jawa Timur",
    "weightInGrams": 850,
    "isFromCache": false,
    "rates": [
      {
        "courier": "J&T Express",
        "service": "EZ (Reguler)",
        "cost": 17000,
        "etd": "1-2 Hari"
      },
      {
        "courier": "SiCepat",
        "service": "SIUNTUNG",
        "cost": 16000,
        "etd": "1-2 Hari"
      }
    ]
  }
  ```

### 3.2 Pembuatan Token Pembayaran (Midtrans Snap)
- **Endpoint**: `POST /api/orders/create-snap-token`
- **Request Body**:
  ```json
  {
    "orderNumber": "BS-20261108-001",
    "grossAmount": 266000,
    "customerDetails": {
      "first_name": "Amanda",
      "email": "amanda@gmail.com",
      "phone": "081234567890"
    },
    "itemDetails": [
      {
        "id": "prod-1",
        "price": 249000,
        "quantity": 1,
        "name": "Wooden Rainbow Stacker"
      },
      {
        "id": "shipping-fee",
        "price": 17000,
        "quantity": 1,
        "name": "Ongkir J&T Express (Malang)"
      }
    ]
  }
  ```
- **Response Format**:
  ```json
  {
    "token": "d748f2cb-50cb-4654-8c88-xxx",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/d748f2cb-xxx"
  }
  ```

---

## 4. Keamanan & Kepatuhan (Security & Standards)

1. **Proteksi Webhook Midtrans**:
   Verifikasi hash signature `SHA-512(order_id + status_code + gross_amount + ServerKey)` sebelum mengubah status pesanan menjadi `PAID`.
2. **CORS Whitelist**:
   Hanya domain resmi toko (misal `https://babyshalls.com` dan `http://localhost:3000` di dev) yang diizinkan mengakses backend API.
3. **Penyimpanan Kredensial**:
   Tidak ada API key atau password plain-text dalam repositori git. Seluruh secret dimuat via file `.env` di server.

