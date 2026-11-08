# AGENTS.MD - AI AGENT CONTEXT & WORKSPACE GUIDE
# BabyShalls E-Commerce Platform

Selamat datang di repositori **BabyShalls**. Dokumen ini adalah panduan navigasi konteks utama (*Context Hub*) bagi setiap AI Agent dan pengembang manusia untuk memastikan konsistensi kode, mencegah bias peninggalan masa lalu (*legacy bias*), dan menjaga arsitektur tetap bersih, modular, serta *scalable*.

---

## 1. Ringkasan Proyek & Identitas Brand
- **Bisnis**: Butik Toko Buku Anak Kurasi & Mainan Kayu Edukasi (Single-Store D2C) berbasis di **Kota Malang, Jawa Timur**.
- **Konsep Desain**: *Warm Cozy Living Storybook* (Warna latar `#FFF8EF`, font serif hangat *Playfair Display*, sans-serif bulat *Nunito*, tombol Terracotta `#D9744A`).
- **Target Rilis**: Fase 1 (Toko & Pembayaran Midtrans, Cek Ongkir Otomatis KiriminAja Malang, Event/Workshop, Jastip Book Request, Admin Semi-CMS).

---

## 2. Peta Navigasi Dokumentasi (`docs/`)

Setiap kali Anda menerima tugas atau instruksi baru, **baca dokumen acuan terkait di folder `docs/` terlebih dahulu**:

| Kebutuhan Tugas / Pertanyaan | Dokumen Acuan Wajib |
| :--- | :--- |
| **Persyaratan Fitur & Ruang Lingkup Bisnis** | [`docs/PRD.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/PRD.md) |
| **Arsitektur Sistem, Alur Data & Deployment** | [`docs/ARCHITECTURE.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/ARCHITECTURE.md) |
| **Spesifikasi Teknis, Dependensi & Redis Cache** | [`docs/TRD.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/TRD.md) |
| **Aturan Rekayasa, Batasan & Anti-Bias (Wajib)** | [`docs/RULES.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/RULES.md) |
| **Kontrak Payload REST API & Error Codes** | [`docs/API_SPECIFICATION.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/API_SPECIFICATION.md) |
| **Skema Database PostgreSQL & Prisma Model** | [`docs/DATABASE_SCHEMA.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/DATABASE_SCHEMA.md) |
| **Panduan Gaya Desain, Warna, & Tipografi** | [`docs/DESIGN.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/DESIGN.md) |
| **Histori Audit & Roadmap Refactoring 4 Minggu** | [`docs/AUDIT_AND_ROADMAP.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/AUDIT_AND_ROADMAP.md) |

---

## 3. Aturan Ketat untuk AI Agent (*Strict Anti-Bias Guardrails*)

1. **NO MULTI-TENANCY**: Dilarang memasukkan konsep `Tenant`, `TenantStaff`, `Store`, atau multi-seller marketplace. BabyShalls adalah toko tunggal milik sendiri.
2. **NO HEAVY AI MICROSERVICE DI FASE 1**: Dilarang menambahkan FastAPI, LangChain, ChromaDB, Ollama, atau voice assistant. Layanan interaktif menggunakan WhatsApp direct CTA.
3. **LOGISTICS ORIGIN TERKUNCI DI KOTA MALANG**: Perhitungan ongkir KiriminAja harus selalu menggunakan titik asal Kota Malang (Jl. Cempaka No. 12, Malang).
4. **REDIS GRACEFUL FALLBACK**: Integrasi Redis di backend (`backend/src/lib/redis.ts`) wajib memiliki mode fallback jika Redis belum berjalan secara lokal.
5. **CLEAN MODULAR CODE**: Komponen UI tidak boleh monolitik (pecah ke `components/`), tipe TypeScript harus lengkap tanpa `any` yang tidak perlu.

---

## 4. Perintah Operasional Cepat (*CLI Commands*)

Semua perintah dapat dijalankan langsung dari root direktori proyek:
```bash
# Menjalankan Frontend (Next.js :3000) dan Backend (Express API :5000) bersamaan:
npm run dev
# Atau di Windows PowerShell / CMD:
.\dev.bat

# Menjalankan satuan:
npm run dev:frontend   # Next.js 16 Storefront
npm run dev:backend    # Express.js REST API

# Build & Validasi TypeScript:
npm run build          # Memverifikasi backend dan frontend dengan 0 error

# Database Prisma:
npm run prisma:generate
npm run prisma:push
```

