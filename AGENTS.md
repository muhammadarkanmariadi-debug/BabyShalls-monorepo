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
| **Konteks Sprint & Alur Kerja Dev 1 (Arkan - Lokal)** | [`docs/DEV1_ARKAN_SPRINT_PLAYBOOK.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/DEV1_ARKAN_SPRINT_PLAYBOOK.md) *(jika tersedia di workspace lokal)* |

> **Aturan Otomatis Dev 1 (Arkan — Laptop Lokal):** Jika file [`docs/DEV1_ARKAN_SPRINT_PLAYBOOK.md`](file:///e:/Project/OWN%20PROJECT/BabyShalls/docs/DEV1_ARKAN_SPRINT_PLAYBOOK.md) ada di workspace ini, AI Agent **WAJIB membacanya secara otomatis** sebelum memulai task sprint apa pun dan mengikuti alur **5-Step Gate**: (1) Sync konteks Notion & `docs/`, (2) Buat **Implementation Plan** dan tunggu **verifikasi Arkan** sebelum mengedit kode, (3) Update Notion ke `In Progress` & eksekusi, (4) Verifikasi `npm run build` (`0 error`) & siapkan poin review, (5) Update Notion ke `Review / Check` dengan ringkasan perubahan.

---

## 3. Aturan Ketat untuk AI Agent (*Strict Anti-Bias Guardrails*)

1. **NO MULTI-TENANCY**: Dilarang memasukkan konsep `Tenant`, `TenantStaff`, `Store`, atau multi-seller marketplace. BabyShalls adalah toko tunggal milik sendiri.
2. **NO HEAVY AI MICROSERVICE DI FASE 1**: Dilarang menambahkan FastAPI, LangChain, ChromaDB, Ollama, atau voice assistant. Layanan interaktif menggunakan WhatsApp direct CTA.
3. **LOGISTICS ORIGIN TERKUNCI DI KOTA MALANG**: Perhitungan ongkir KiriminAja harus selalu menggunakan titik asal Kota Malang (Jl. Cempaka No. 12, Malang).
4. **REDIS GRACEFUL FALLBACK**: Integrasi Redis di monolith API (`apps/server/lib/redis.ts`) wajib memiliki mode fallback jika Redis belum berjalan secara lokal.
5. **CLEAN MODULAR CODE**: Komponen UI tidak boleh monolitik (pecah ke `components/`), tipe TypeScript harus lengkap tanpa `any` yang tidak perlu.
6. **FULL ENGLISH LOCALIZATION (MoU Requirement)**: Seluruh antarmuka publik (UI, navigasi, form, toast, modal, email, error responses) dan dokumentasi wajib menggunakan Bahasa Inggris sesuai kesepakatan MoU klien.

---

## 4. Perintah Operasional Cepat (*CLI Commands*)

Arsitektur BabyShalls berjalan sebagai **Monolith** di `apps/` (Next.js 16 Storefront + Hono REST API `/api/*` + Prisma 7 PostgreSQL + Redis). Semua perintah dapat dijalankan langsung dari root direktori proyek:
```bash
# Menjalankan Monolith (Storefront & API di http://localhost:3000):
npm run dev
# Atau di Windows PowerShell / CMD:
.\dev.bat

# Build & Validasi TypeScript:
npm run build          # Memverifikasi monolith dengan 0 error

# Database Prisma 7 (prisma.config.ts):
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

