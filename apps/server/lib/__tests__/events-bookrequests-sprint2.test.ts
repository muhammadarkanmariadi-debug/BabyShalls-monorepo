import test from 'node:test';
import assert from 'node:assert/strict';
import { Hono } from 'hono';
import eventsRouter from '../../routes/events';
import ordersRouter from '../../routes/orders';
import bookRequestsRouter from '../../routes/book-requests';
import { prisma } from '../prisma';

function createTestApp() {
  const app = new Hono();
  app.route('/events', eventsRouter);
  app.route('/orders', ordersRouter);
  app.route('/book-requests', bookRequestsRouter);
  return app;
}

test('Sprint 2 [S2-02] AC-1: Katalog & Detail Event (GET /events, GET /events/:idOrSlug)', async () => {
  const app = createTestApp();
  const testSlug = `test-workshop-${Date.now()}`;

  const event = await prisma.event.create({
    data: {
      title: 'Workshop Dongeng & Sensorik Si Kecil',
      slug: testSlug,
      category: 'Storytelling & Art',
      description: 'Kegiatan edukatif anak melatih motorik halus di Malang.',
      eventDate: new Date('2026-12-15T10:00:00Z'),
      timeString: '10.00 - 12.00 WIB',
      location: 'BabyShalls Boutique Kota Malang',
      bannerImage: '/images/events/test-event.jpg',
      price: 65000,
      quota: 15,
      isActive: true,
    },
  });

  try {
    // 1. GET /events returns list containing our test event
    const listRes = await app.request('/events');
    assert.equal(listRes.status, 200);
    const listJson = await listRes.json();
    assert.equal(listJson.success, true);
    assert.ok(Array.isArray(listJson.data));
    const foundInList = listJson.data.find((e: any) => e.id === event.id);
    assert.ok(foundInList, 'Created event must be in public events list');
    assert.equal(foundInList.price, 65000);

    // 2. GET /events/:idOrSlug using slug
    const detailBySlugRes = await app.request(`/events/${testSlug}`);
    assert.equal(detailBySlugRes.status, 200);
    const slugJson = await detailBySlugRes.json();
    assert.equal(slugJson.success, true);
    assert.equal(slugJson.data.id, event.id);
    assert.equal(slugJson.data.quota, 15);
    assert.ok(slugJson.data.shortCode, 'Event must have a shortCode');

    // 3. GET /events/:idOrSlug using UUID
    const detailByIdRes = await app.request(`/events/${event.id}`);
    assert.equal(detailByIdRes.status, 200);
    const idJson = await detailByIdRes.json();
    assert.equal(idJson.success, true);
    assert.equal(idJson.data.slug, testSlug);

    // 4. GET /events/:idOrSlug with nonexistent slug -> 404 NOT_FOUND
    const notFoundRes = await app.request('/events/non-existent-workshop-slug-999');
    assert.equal(notFoundRes.status, 404);
    const notFoundJson = await notFoundRes.json();
    assert.equal(notFoundJson.success, false);
    assert.equal(notFoundJson.code, 'NOT_FOUND');
  } finally {
    await prisma.event.delete({ where: { id: event.id } }).catch(() => null);
  }
});

test('Sprint 2 [S2-02] AC-2: Registrasi Event Gratis & Berbayar (POST /events/register)', async () => {
  const app = createTestApp();
  const paidSlug = `paid-workshop-${Date.now()}`;
  const freeSlug = `free-workshop-${Date.now()}`;

  const paidEvent = await prisma.event.create({
    data: {
      title: 'Workshop Clay Berbayar',
      slug: paidSlug,
      category: 'Workshop',
      description: 'Eksplorasi sensorik dengan clay aman ramah anak.',
      eventDate: new Date('2026-12-20T10:00:00Z'),
      timeString: '09.30 - 11.30 WIB',
      location: 'BabyShalls Malang',
      bannerImage: '/images/events/test-paid.jpg',
      price: 50000,
      quota: 3,
      isActive: true,
    },
  });

  const freeEvent = await prisma.event.create({
    data: {
      title: 'Storytelling Gratis Komunitas Bunda',
      slug: freeSlug,
      category: 'Story Time',
      description: 'Mendengarkan cerita dongeng buku cerita bersama.',
      eventDate: new Date('2026-12-22T10:00:00Z'),
      timeString: '15.00 - 16.30 WIB',
      location: 'BabyShalls Malang',
      bannerImage: '/images/events/test-free.jpg',
      price: 0,
      quota: 10,
      isActive: true,
    },
  });

  try {
    // 1. Register paid event successfully -> produces BS-EVT-PAY- orderId & snapToken
    const paidRegRes = await app.request('/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: paidEvent.id,
        participantName: 'Bunda Arkan',
        childName: 'Kenzo',
        childAge: '4 tahun',
        whatsappNumber: '081234567890',
        ticketQuantity: 1,
      }),
    });
    assert.equal(paidRegRes.status, 201);
    const paidJson = await paidRegRes.json();
    assert.equal(paidJson.success, true);
    assert.ok(paidJson.data.ticketCode.startsWith('BS-EVT-'), 'Ticket code must start with BS-EVT-');
    assert.ok(paidJson.data.midtransOrderId.startsWith('BS-EVT-PAY-'), 'Paid event orderId must start with BS-EVT-PAY-');
    assert.equal(paidJson.data.paymentStatus, 'PENDING');
    assert.equal(paidJson.data.status, 'PENDING_PAYMENT');
    assert.equal(paidJson.data.totalPaid, 50000);
    assert.ok(paidJson.data.snapToken, 'snapToken must be provided for paid event');

    // Verify quota decremented by 1 (was 3, now 2)
    const paidEventAfter = await prisma.event.findUnique({ where: { id: paidEvent.id } });
    assert.equal(paidEventAfter?.quota, 2);

    // 2. Reject registration if ticketQuantity exceeds remaining quota
    const overQuotaRes = await app.request('/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: paidEvent.id,
        participantName: 'Bunda Lain',
        whatsappNumber: '081299998888',
        ticketQuantity: 5, // Only 2 remaining!
      }),
    });
    assert.equal(overQuotaRes.status, 400);
    const overQuotaJson = await overQuotaRes.json();
    assert.equal(overQuotaJson.code, 'QUOTA_FULL');

    // 3. Register free event successfully -> instantly CONFIRMED with FREE paymentStatus & no midtransOrderId
    const freeRegRes = await app.request('/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: freeEvent.id,
        participantName: 'Bunda Lestari',
        childName: 'Alana',
        childAge: '3 tahun',
        whatsappNumber: '081234567891',
        ticketQuantity: 2,
      }),
    });
    assert.equal(freeRegRes.status, 201);
    const freeJson = await freeRegRes.json();
    assert.equal(freeJson.success, true);
    assert.equal(freeJson.data.paymentStatus, 'FREE');
    assert.equal(freeJson.data.status, 'CONFIRMED');
    assert.equal(freeJson.data.totalPaid, 0);
    assert.equal(freeJson.data.midtransOrderId, null);
    assert.ok(freeJson.data.ticketCode.startsWith('BS-EVT-'));
  } finally {
    await prisma.eventRegistration.deleteMany({ where: { eventId: { in: [paidEvent.id, freeEvent.id] } } });
    await prisma.event.deleteMany({ where: { id: { in: [paidEvent.id, freeEvent.id] } } });
  }
});

test('Sprint 2 [S2-02] AC-3: Webhook Midtrans Event (BS-EVT-PAY-) Settlement & Cancellation', async () => {
  const app = createTestApp();
  const testSlug = `webhook-evt-${Date.now()}`;

  const event = await prisma.event.create({
    data: {
      title: 'Workshop Webhook Test',
      slug: testSlug,
      category: 'Workshop',
      description: 'Kegiatan edukatif anak di Malang.',
      eventDate: new Date('2026-12-25T10:00:00Z'),
      timeString: '10.00 WIB',
      location: 'BabyShalls Malang',
      bannerImage: '/images/events/test.jpg',
      price: 75000,
      quota: 10,
      isActive: true,
    },
  });

  const reg1 = await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      participantName: 'Peserta 1',
      childName: 'Anak 1',
      childAge: '4 tahun',
      whatsappNumber: '081211112222',
      ticketQuantity: 1,
      ticketCode: `BS-EVT-SETTLE-${Date.now()}`,
      midtransOrderId: `BS-EVT-PAY-SETTLE-${Date.now()}`,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    },
  });

  const reg2 = await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      participantName: 'Peserta 2',
      childName: 'Anak 2',
      childAge: '3 tahun',
      whatsappNumber: '081233334444',
      ticketQuantity: 2,
      ticketCode: `BS-EVT-CANCEL-${Date.now()}`,
      midtransOrderId: `BS-EVT-PAY-CANCEL-${Date.now()}`,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    },
  });

  try {
    // 1. Settle reg1 via Midtrans Webhook -> paymentStatus PAID & status CONFIRMED
    const settleWebhookRes = await app.request('/orders/midtrans-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: reg1.midtransOrderId,
        status_code: '200',
        gross_amount: '75000',
        transaction_status: 'settlement',
      }),
    });
    assert.equal(settleWebhookRes.status, 200);

    const updatedReg1 = await prisma.eventRegistration.findUnique({ where: { id: reg1.id } });
    assert.equal(updatedReg1?.paymentStatus, 'PAID');
    assert.equal(updatedReg1?.status, 'CONFIRMED');

    // 2. Cancel/Expire reg2 via Midtrans Webhook -> paymentStatus FAILED, status CANCELLED & quota incremented by 2
    const currentQuota = (await prisma.event.findUnique({ where: { id: event.id } }))?.quota ?? 10;

    const cancelWebhookRes = await app.request('/orders/midtrans-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: reg2.midtransOrderId,
        status_code: '202',
        gross_amount: '150000',
        transaction_status: 'cancel',
      }),
    });
    assert.equal(cancelWebhookRes.status, 200);

    const updatedReg2 = await prisma.eventRegistration.findUnique({ where: { id: reg2.id } });
    assert.equal(updatedReg2?.paymentStatus, 'FAILED');
    assert.equal(updatedReg2?.status, 'CANCELLED');

    const eventAfterCancel = await prisma.event.findUnique({ where: { id: event.id } });
    assert.equal(eventAfterCancel?.quota, currentQuota + 2, 'Quota must be restored when registration is cancelled');
  } finally {
    await prisma.eventRegistration.deleteMany({ where: { eventId: event.id } });
    await prisma.event.delete({ where: { id: event.id } });
  }
});

test('Sprint 2 [S2-02] AC-4: Book Request Submission & DB Persistence', async () => {
  const app = createTestApp();
  const testTitle = `Buku Langka Cerita Anak ${Date.now()}`;

  // POST /book-requests creates BookRequest in DB
  const reqRes = await app.request('/book-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: testTitle,
      authorPublisher: 'Eric Carle / Penguin Books',
      customerName: 'Bunda Nadia',
      email: 'nadia@example.com',
      whatsappNumber: '081234567899',
      notes: 'Format Board Book impor, edisi bahasa Inggris.',
    }),
  });

  assert.equal(reqRes.status, 201);
  const reqJson = await reqRes.json();
  assert.equal(reqJson.success, true);
  assert.equal(reqJson.data.title, testTitle);
  assert.equal(reqJson.data.status, 'PENDING');
  assert.ok(reqJson.data.requestId);

  // Verify in PostgreSQL
  const dbRecord = await prisma.bookRequest.findUnique({
    where: { id: reqJson.data.requestId },
  });
  assert.ok(dbRecord, 'BookRequest record must exist in PostgreSQL');
  assert.equal(dbRecord.customerName, 'Bunda Nadia');
  assert.equal(dbRecord.whatsappNumber, '081234567899');

  // Cleanup
  await prisma.bookRequest.delete({ where: { id: reqJson.data.requestId } });
});
