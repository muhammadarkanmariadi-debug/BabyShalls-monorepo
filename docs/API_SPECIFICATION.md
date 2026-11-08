# API SPECIFICATION & CONTRACTS
# BabyShalls Backend REST Services

**Base URL (Dev):** `http://localhost:5000/api`  
**Base URL (Prod):** `https://babyshalls.com/api`  
**Format:** JSON (`Content-Type: application/json`)

---

## 1. Standar Format Respons

### 1.1 Format Respons Berhasil (Success)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil"
}
```

### 1.2 Format Respons Gagal (Error)
```json
{
  "success": false,
  "error": "Pesan deskripsi kesalahan yang mudah dibaca",
  "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | INTERNAL_ERROR"
}
```

---

## 2. Rincian Endpoint Publik & Pelanggan

### 2.1 Cek Ongkir Multi-Kurir KiriminAja
- **Method & Path:** `POST /shipping/calculate`
- **Header:** `Content-Type: application/json`
- **Request:**
  ```json
  {
    "destinationSubdistrictId": 1234,
    "weightInGrams": 750
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "origin": "Kota Malang, Jawa Timur",
    "weightInGrams": 750,
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

### 2.2 Buat Token Pembayaran Midtrans Snap
- **Method & Path:** `POST /orders/create-snap-token`
- **Request:**
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
        "id": "shipping",
        "price": 17000,
        "quantity": 1,
        "name": "Ongkir J&T Express (Malang)"
      }
    ]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "d748f2cb-50cb-4654-8c88-sample-token",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/d748f2cb"
  }
  ```

### 2.3 Webhook Callback Midtrans
- **Method & Path:** `POST /orders/midtrans-webhook`
- **Tujuan:** Menerima notifikasi update status pembayaran seketika dari Midtrans.
- **Response (200 OK):**
  ```json
  { "status": "OK" }
  ```

### 2.4 Pendaftaran Event & Workshop Anak
- **Method & Path:** `POST /events/register`
- **Request:**
  ```json
  {
    "eventId": "ev-1",
    "participantName": "Bunda Sarah",
    "childName": "Kenzo",
    "childAge": "3 Tahun",
    "whatsappNumber": "08123456789",
    "notes": "Anak aktif dan suka mewarnai"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Pendaftaran adik Kenzo di event berhasil dicatat.",
    "registrationId": "REG-1731058200"
  }
  ```

### 2.5 Layanan Book Request (Jastip Buku Impor)
- **Method & Path:** `POST /book-requests`
- **Request:**
  ```json
  {
    "title": "The Very Hungry Caterpillar (Hardcover)",
    "authorPublisher": "Eric Carle",
    "customerName": "Bunda Rina",
    "whatsappNumber": "081234567890",
    "notes": "Edisi board book tebal bahasa Inggris"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Permintaan buku 'The Very Hungry Caterpillar' telah diterima tim kurator BabyShalls Malang.",
    "requestId": "REQ-1731058200"
  }
  ```

---

## 3. Rincian Endpoint Admin (Membutuhkan Header Authorization)

- **Header Wajib:** `Authorization: Bearer <JWT_ADMIN_TOKEN>`

### 3.1 Panggil Pickup Kurir KiriminAja
- **Method & Path:** `POST /admin/orders/:id/pickup`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "waybillNumber": "BS-KRM-1731058200",
    "status": "PICKUP_REQUESTED"
  }
  ```

### 3.2 Update Konten Semi-CMS Beranda
- **Method & Path:** `PUT /admin/cms`
- **Request:**
  ```json
  {
    "topBannerText": "Gratis Gift Wrapping Cantik & Kartu Ucapan untuk setiap pembelian Hampers!",
    "heroHeadline": "Menumbuhkan Cinta Membaca Sejak Hari Pertama."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Konten halaman utama berhasil diperbarui."
  }
  ```

