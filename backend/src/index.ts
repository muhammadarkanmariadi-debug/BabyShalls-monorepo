import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateShippingRates, requestCourierPickup } from './lib/kiriminaja.js';
import { snap } from './lib/midtrans.js';
import { getCache, setCache } from './lib/redis.js';
import { authenticateJWT, requireAdmin, AuthRequest } from './middleware/auth.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    app: 'BabyShalls E-Commerce Engine',
    version: '1.0.0',
    location: 'Malang, Jawa Timur',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 1. Logistik & Cek Ongkir KiriminAja (Malang Origin) dengan Redis Cache
// ==========================================
app.post('/api/shipping/calculate', async (req: Request, res: Response) => {
  try {
    const { destinationSubdistrictId, weightInGrams } = req.body;
    if (!weightInGrams) {
      return res.status(400).json({ error: 'Berat total (gram) diperlukan untuk hitung ongkir.' });
    }

    const destId = destinationSubdistrictId || 1234;
    const cacheKey = `shipping:rates:${destId}:${weightInGrams}`;

    // Cek Cache Redis terlebih dahulu (TTL 1 Jam)
    const cachedRates = await getCache<any[]>(cacheKey);
    if (cachedRates) {
      return res.json({
        origin: 'Kota Malang, Jawa Timur',
        weightInGrams,
        isFromCache: true,
        rates: cachedRates,
      });
    }

    // Cache Miss: Ambil kalkulasi KiriminAja
    const rates = await calculateShippingRates({
      destinationSubdistrictId: destId,
      weightInGrams: Number(weightInGrams),
    });

    // Simpan ke Redis Cache selama 3600 detik (1 Jam)
    await setCache(cacheKey, rates, 3600);

    res.json({
      origin: 'Kota Malang, Jawa Timur',
      weightInGrams,
      isFromCache: false,
      rates,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Gagal menghitung ongkir.' });
  }
});

// ==========================================
// 2. Pembayaran Midtrans Snap & Webhook
// ==========================================
app.post('/api/orders/create-snap-token', async (req: Request, res: Response) => {
  try {
    const { orderNumber, grossAmount, customerDetails, itemDetails } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderNumber || `BS-${Date.now()}`,
        gross_amount: grossAmount,
      },
      customer_details: customerDetails,
      item_details: itemDetails,
    };

    const snapTransaction = await snap.createTransaction(parameter);
    res.json({
      token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Gagal membuat token Midtrans Snap.' });
  }
});

app.post('/api/orders/midtrans-webhook', async (req: Request, res: Response) => {
  try {
    const notification = req.body;
    console.log('[Midtrans Webhook Received]:', notification.order_id, notification.transaction_status);

    // Midtrans notification handling
    const status = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    if (status === 'capture' || status === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        // Update Order to PAID in database
        console.log(`Order ${notification.order_id} LUNAS.`);
      }
    } else if (status === 'cancel' || status === 'expire') {
      console.log(`Order ${notification.order_id} KADALUARSA / BATAL.`);
    }

    res.status(200).json({ status: 'OK' });
  } catch (error: any) {
    res.status(500).json({ error: 'Gagal memproses webhook Midtrans.' });
  }
});

// ==========================================
// 3. Event & Workshop Pendaftaran
// ==========================================
app.post('/api/events/register', (req: Request, res: Response) => {
  const { eventId, participantName, childName, childAge, whatsappNumber } = req.body;
  if (!childName || !whatsappNumber) {
    return res.status(400).json({ error: 'Nama anak dan nomor WhatsApp wajib diisi.' });
  }

  // Simpan ke database EventRegistration
  res.json({
    success: true,
    message: `Pendaftaran adik ${childName} di event berhasil dicatat.`,
    registrationId: `REG-${Date.now()}`,
  });
});

// ==========================================
// 4. Book Request (Jastip Buku Impor)
// ==========================================
app.post('/api/book-requests', (req: Request, res: Response) => {
  const { title, authorPublisher, customerName, whatsappNumber, notes } = req.body;
  if (!title || !whatsappNumber) {
    return res.status(400).json({ error: 'Judul buku dan nomor WhatsApp wajib diisi.' });
  }

  res.json({
    success: true,
    message: `Permintaan buku "${title}" telah diterima tim kurator BabyShalls Malang.`,
    requestId: `REQ-${Date.now()}`,
  });
});

// ==========================================
// 5. Admin Order Pickup KiriminAja
// ==========================================
app.post('/api/admin/orders/:id/pickup', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await requestCourierPickup(id, req.body);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(` BabyShalls Backend Server running on port ${PORT}`);
  console.log(`📍 Logistics Origin locked to: Kota Malang, Jawa Timur`);
});

