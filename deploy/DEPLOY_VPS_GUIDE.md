# Panduan Deploy BabyShalls Monolith di VPS KVM (Jagoan Hosting Paket Nebula) + Cloudflare CDN

Spesifikasi target: **2 vCPU, 2 GB RAM, 40 GB NVMe, Ubuntu 24.04 LTS** — menjalankan seluruh stack langsung di **Host Machine** + **Cloudflare CDN (Gratis)** di depan VPS:
- **App & API:** Next.js 16 + Hono (`/api/*`) di port `3000` via **PM2**
- **Database:** **PostgreSQL 16** lokal (`127.0.0.1:5432`)
- **Cache & Rate Limit:** **Redis 7** lokal (`127.0.0.1:6379`, maxmemory 128 MB)
- **Email:** **Nodemailer SMTP** (Gmail App Password atau SMTP lokal)
- **Image Storage:** **Local VPS (`apps/public/uploads/`)** dengan kompresi WebP otomatis di browser + **Nginx & Cloudflare CDN Cache**
- **Reverse Proxy & SSL:** **Nginx + Let's Encrypt Certbot + Cloudflare Proxy**

---

## 1. Setup Awal VPS (Sekali Saja)
Upload atau clone repo ke `/var/www/babyshalls`, lalu jalankan skrip setup:
```bash
sudo bash /var/www/babyshalls/deploy/setup-vps.sh
```

## 2. Buat Database & User PostgreSQL Lokal
```bash
sudo -u postgres psql
```
Di dalam prompt `psql`:
```sql
CREATE USER babyshalls_user WITH PASSWORD 'GANTI_PASSWORD_KUAT';
CREATE DATABASE babyshalls_db OWNER babyshalls_user;
\q
```

## 3. Konfigurasi Environment Variables
Buat/edit `/var/www/babyshalls/apps/.env.local` (dan `.env.production` untuk `NEXT_PUBLIC_*`):
```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=544378787554-mp7n0mlaugerb60h5dp6pvsmttr9jv30.apps.googleusercontent.com
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...

DATABASE_URL="postgresql://babyshalls_user:GANTI_PASSWORD_KUAT@127.0.0.1:5432/babyshalls_db"
REDIS_URL="redis://127.0.0.1:6379"
JWT_SECRET="ganti-dengan-random-secret-minimal-32-karakter"
GOOGLE_CLIENT_ID="544378787554-mp7n0mlaugerb60h5dp6pvsmttr9jv30.apps.googleusercontent.com"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="email-smtp-anda@gmail.com"
SMTP_PASS="app-password-16-digit"
SMTP_FROM_NAME="BabyShalls Malang"
SMTP_FROM_EMAIL="babyshalls8@gmail.com"

MIDTRANS_SERVER_KEY="SB-Mid-server-..."
MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
MIDTRANS_IS_PRODUCTION=false

MALANG_ORIGIN_RAJAONGKIR_ID="46757"
ORIGIN_SUBDISTRICT_ID="46757"
RAJAONGKIR_V2_API_KEYS="..."
RAJAONGKIR_V2_BASE_URL="https://rajaongkir.komerce.id/api/v1"
BINDERBYTE_API_KEY="..."
BINDERBYTE_BASE_URL="https://api.binderbyte.com"

FRONTEND_URL="https://domain-anda.com"
```

## 4. Install Dependencies, Push Database & Build
```bash
cd /var/www/babyshalls/apps
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts   # Opsional: hanya saat deploy pertama kali
npm run build
```

## 5. Jalankan Aplikasi via PM2
Dari `/var/www/babyshalls`:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 6. Pasang Nginx Reverse Proxy & SSL HTTPS
```bash
sudo cp /var/www/babyshalls/deploy/nginx.conf.example /etc/nginx/sites-available/babyshalls
# Edit server_name sesuai domain Anda:
sudo nano /etc/nginx/sites-available/babyshalls
sudo ln -s /etc/nginx/sites-available/babyshalls /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Terbitkan sertifikat SSL gratis:
sudo certbot --nginx -d domain-anda.com
```

---

## 7. Optimasi Cloudflare CDN & Daftar Cache Rules (Gratis)

Di **Cloudflare Dashboard → DNS**, pastikan record `A` domain Anda mengarah ke IP VPS dengan status **Proxied (awan oranye)**.
Di **SSL/TLS → Overview**, pilih mode **Full (strict)** setelah Certbot aktif.
Di **Speed → Optimization**, aktifkan **Brotli** dan **HTTP/3 (with QUIC)**.

### Daftar Cache Rules (`Caching → Cache Rules`)
Buat rule berikut berurutan dari atas ke bawah agar gambar & aset statis ditahan CDN (0 beban ke VPS), sementara halaman transaksi tetap dinamis:

| Prioritas | Nama Rule | Kondisi (`URI Path`) | Aksi Cache | Edge TTL | Browser TTL |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Bypass Private & Transaksi** | `starts_with("/api/auth")` OR `starts_with("/api/account")` OR `starts_with("/api/orders")` OR `starts_with("/api/admin")` OR `starts_with("/api/shipping/calculate")` OR `starts_with("/account")` OR `starts_with("/checkout")` OR `starts_with("/cart")` OR `starts_with("/admin")` OR `starts_with("/login")` | **Bypass cache** | — | — |
| **2** | **Cache Gambar Upload VPS** | `starts_with("/uploads/")` | **Eligible for cache** | Override `1 year` | `1 year` |
| **3** | **Cache Aset Statis Next.js** | `starts_with("/_next/static/")` | **Eligible for cache** | Override `1 year` | `1 year` |
| **4** | **Cache Gambar Publik & Ikon** | `starts_with("/images/")` OR `ends_with(".webp")` OR `ends_with(".png")` OR `ends_with(".jpg")` OR `ends_with(".svg")` OR `ends_with(".woff2")` | **Eligible for cache** | Override `30 days` | `7 days` |
| **5** | **Cache API Katalog & CMS Publik** | `starts_with("/api/products")` OR `starts_with("/api/cms")` OR `starts_with("/api/events")` OR `starts_with("/api/coupons/active")` OR `starts_with("/api/shipping/regions")` | **Eligible for cache** | Respect origin (`s-maxage=300` = 5 menit) | `1 minute` |

### Cara Verifikasi Cache CDN Berjalan
Buka `https://domain-anda.com/uploads/...` atau `https://domain-anda.com/api/products` di browser → buka DevTools (`F12`) → tab **Network** → cek Response Header:
- Refresh ke-2 harus menampilkan **`cf-cache-status: HIT`**.
- Pastikan `/api/auth/me`, `/api/orders`, dan `/checkout` selalu **`cf-cache-status: BYPASS` / `DYNAMIC`**.

---

## 8. Cron Auto-Cancel Order & Backup Gambar Lokal
Jalankan `crontab -e` di VPS dan tambahkan:
```cron
# Batalkan pesanan PENDING_PAYMENT yang melewati 24 jam (tiap jam)
0 * * * * curl -s -X POST http://127.0.0.1:3000/api/orders/cron-cleanup > /dev/null

# Backup harian folder uploads & database PostgreSQL ke /var/backups/babyshalls
0 2 * * * mkdir -p /var/backups/babyshalls && tar -czf /var/backups/babyshalls/uploads-$(date +\%F).tar.gz -C /var/www/babyshalls/apps/public uploads && find /var/backups/babyshalls -type f -mtime +7 -delete
```

## 9. Update Callback Eksternal
- **Midtrans Dashboard:** Set Payment Notification URL ke `https://domain-anda.com/api/orders/midtrans-webhook`
- **Google Cloud Console:** Tambahkan `https://domain-anda.com` ke Authorized JavaScript origins.
