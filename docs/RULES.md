# DEVELOPMENT RULES & ANTI-BIAS GOVERNANCE
# BabyShalls Engineering Guardrails

**Dokumen Acuan:** `docs/RULES.md`  
**Status:** Wajib Dipatuhi oleh Seluruh Pengembang & AI Agents  
**Tujuan:** Mencegah *scope creep*, bias arsitektur peninggalan masa lalu (Mojo Indah), dan menjaga kestabilan kode agar rilis tepat waktu dalam 4 minggu.

---

## 1. Aturan Penguncian Ruang Lingkup (Scope Locking Rules)

### RULE 01: Single-Store Boutique Only (Dilarang Membawa Logika Multi-Tenant)
- **Larangan Keras:** Dilarang menambahkan entitas `Tenant`, `TenantStaff`, `Store`, `Merchant`, atau alur *multi-seller marketplace* ke dalam codebase BabyShalls.
- **Prinsip:** BabyShalls adalah toko tunggal milik sendiri di Malang. Semua produk dan pesanan dimiliki secara eksklusif oleh BabyShalls.
- **Pengecekan:** Jika ada referensi `req.user.tenantId` atau model `tenantId` pada Prisma schema, itu adalah pelanggaran arsitektur dan harus segera dihapus.

### RULE 02: Dilarang Menghidupkan Kembali Service AI / Machine Learning di Fase 1
- **Larangan Keras:** Tidak ada kebutuhan microservice FastAPI, LangChain, ChromaDB, Ollama, model Qwen, atau Voice Assistant di Fase 1 (sesuai Proposal Penawaran v3 Bagian 3).
- **Prinsip:** Seluruh interaksi pencarian menggunakan PostgreSQL full-text search atau in-memory filter, dan bantuan pelanggan dialihkan langsung via **WhatsApp Direct Button**.

### RULE 03: Logistik Mutlak Terkunci di Kota Malang
- **Prinsip:** Titik awal (*origin*) pengiriman KiriminAja harus selalu bernilai ID Kecamatan di **Kota Malang, Jawa Timur** (lokasi fisik toko BabyShalls).
- **Larangan Keras:** Dilarang mengimplementasikan multi-origin atau kalkulasi pengiriman dari gudang di luar Malang.

---

## 2. Standar Clean Code & Desain Modular

### RULE 04: Pemisahan Komponen Atomic (Maksimal 250 Baris per Berkas)
- Setiap komponen antarmuka harus memiliki tanggung jawab tunggal (*Single Responsibility Principle*).
- Hindari menyatukan seluruh halaman beranda ke dalam satu file besar. Pisahkan ke folder `components/home/` (contoh: `HeroSection.tsx`, `ShopByAgeSection.tsx`, `HampersSection.tsx`).
- Seluruh tipe TypeScript (`interface`, `type`) harus disimpan terpusat di `types/index.ts` atau modul domain terkait.

### RULE 05: Konsistensi Desain Visual (*Style Guide Compliance*)
- Semua warna harus menggunakan token tema BabyShalls yang sudah didefinisikan:
  - Background: `#FFF8EF` / `#FCF6EC` (hindari putih murni `#FFFFFF` untuk background halaman).
  - Judul: `Playfair Display` dengan warna `#502E1E`.
  - Body & tombol: `Nunito` dengan warna `#6B3F2A` dan `#DA7A5B`.
  - Aksentuasi: `#DCE6C6` (Sage), `#F6C95E` (Mustard), `#F6B79B` (Salmon).
- Sudut membulat (*border radius*) harus lembut (`rounded-[20px]`, `rounded-[24px]`, `rounded-full`).

---

## 3. Aturan Backend, Database & Caching (Redis)

### RULE 06: Redis Graceful Degradation
- Backend wajib menggunakan wrapper Redis yang aman. Jika koneksi Redis gagal atau Redis server mati, sistem **TIDAK BOLEH CRASH**.
- Sistem harus mencatat peringatan (*warning log*) dan secara transparan melakukan *fallback* langsung ke database atau API pihak ketiga.

### RULE 07: Integritas Migrasi Prisma
- Dilarang mengedit file migrasi yang sudah pernah di-apply ke database produksi.
- Selalu gunakan `npx prisma migrate dev` di tahap pengembangan dan `npx prisma migrate deploy` di tahap rilis produksi.
- Seluruh kolom yang berhubungan dengan kalkulasi mata uang (`price`, `subtotal`, `grandTotal`) wajib menggunakan tipe `Decimal` pada Prisma, bukan `Float`.

### RULE 08: Idempotensi Webhook Pembayaran
- Endpoint webhook `/api/orders/midtrans-webhook` harus idempoten: memproses notifikasi dengan order ID dan status yang sama lebih dari sekali tidak boleh mengubah data secara duplikat atau memicu error.

---

## 4. Protokol Verifikasi Sebelum Commit & Deploy

Setiap perubahan kode harus lolos checklist verifikasi berikut:
1. `npm run build` di folder `frontend/` berhasil dengan **0 TypeScript / Turbopack error**.
2. `npm run build` di folder `backend/` berhasil dengan **0 TypeScript compilation error**.
3. Tidak ada penambahan paket `node_modules` yang tidak memiliki fungsi nyata bagi 6 modul Fase 1.

