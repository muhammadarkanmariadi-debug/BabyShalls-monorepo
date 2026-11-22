import test from 'node:test';
import assert from 'node:assert/strict';
import { Hono } from 'hono';
import accountRouter from '../../routes/account';
import { prisma } from '../prisma';
import { hashPassword } from '../password';
import { signJwt } from '../jwt';

// Helper to make test requests
function createTestApp() {
  const app = new Hono();
  app.route('/account', accountRouter);
  return app;
}

test('Sprint 2 AC-1: Profile & OTP Ganti Email', async (t) => {
  const app = createTestApp();
  const testEmail = `test-user-${Date.now()}@example.com`;
  const initialPassword = 'password123';
  const passwordHash = await hashPassword(initialPassword);

  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
      name: 'Bunda Test',
      phone: '08123456789',
      role: 'USER',
    },
  });

  const validToken = await signJwt({ id: testUser.id, email: testUser.email, role: testUser.role });

  // 1. Unauthenticated request to /account/profile returns 401
  const unauthRes = await app.request('/account/profile');
  assert.equal(unauthRes.status, 401, 'Should return 401 for unauthenticated request');

  // 2. Authenticated request to /account/profile returns 200
  const authRes = await app.request('/account/profile', {
    headers: { Authorization: `Bearer ${validToken}` },
  });
  assert.equal(authRes.status, 200);
  const profileJson = await authRes.json();
  assert.equal(profileJson.success, true);
  assert.equal(profileJson.data.email, testEmail);

  // 3. Request email change with invalid password returns 400
  const wrongPassRes = await app.request('/account/email/request-change', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newEmail: `new-${Date.now()}@example.com`,
      currentPassword: 'wrong-password',
    }),
  });
  assert.equal(wrongPassRes.status, 400);

  // 4. Request email change with valid password succeeds and generates OTP
  const newEmail = `verified-new-${Date.now()}@example.com`;
  const reqChangeRes = await app.request('/account/email/request-change', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newEmail,
      currentPassword: initialPassword,
    }),
  });
  assert.equal(reqChangeRes.status, 200);
  const reqChangeJson = await reqChangeRes.json();
  assert.equal(reqChangeJson.success, true);
  assert.equal(reqChangeJson.data.newEmail, newEmail);

  // Retrieve OTP code from DB to simulate user receiving email
  const otpRecord = await prisma.otpCode.findFirst({
    where: { userId: testUser.id, email: newEmail, usedAt: null },
    orderBy: { createdAt: 'desc' },
  });
  assert.ok(otpRecord, 'OTP record should exist in database');

  // 5. Verify email change with wrong OTP code returns 400
  const wrongOtpRes = await app.request('/account/email/verify-change', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newEmail,
      otp: '000000',
    }),
  });
  assert.equal(wrongOtpRes.status, 400);

  // Cleanup test user
  await prisma.user.delete({ where: { id: testUser.id } });
});

test('Sprint 2 AC-2: CRUD Multi-Alamat & Ownership Guard', async () => {
  const app = createTestApp();
  const passwordHash = await hashPassword('password123');

  const userA = await prisma.user.create({
    data: { email: `user-a-${Date.now()}@test.com`, passwordHash, name: 'User A', role: 'USER' },
  });
  const userB = await prisma.user.create({
    data: { email: `user-b-${Date.now()}@test.com`, passwordHash, name: 'User B', role: 'USER' },
  });

  const tokenA = await signJwt({ id: userA.id, email: userA.email, role: userA.role });
  const tokenB = await signJwt({ id: userB.id, email: userB.email, role: userB.role });

  // 1. User A creates address 1
  const createRes1 = await app.request('/account/addresses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      label: 'Rumah Malang',
      receiverName: 'User A',
      receiverPhone: '08123456789',
      streetAddress: 'Jl. Cempaka No. 12',
      city: 'Kota Malang',
      subdistrict: 'Klojen',
      postalCode: '65111',
      isDefault: true,
    }),
  });
  assert.equal(createRes1.status, 201);
  const addr1 = (await createRes1.json()).data;
  assert.equal(addr1.isDefault, true);

  // 2. User A creates address 2 with isDefault: true
  const createRes2 = await app.request('/account/addresses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      label: 'Kantor',
      receiverName: 'User A Office',
      receiverPhone: '08123456789',
      streetAddress: 'Jl. Besar Ijen No. 45',
      city: 'Kota Malang',
      subdistrict: 'Klojen',
      postalCode: '65115',
      isDefault: true,
    }),
  });
  assert.equal(createRes2.status, 201);
  const addr2 = (await createRes2.json()).data;
  assert.equal(addr2.isDefault, true);

  // Verify address 1 is no longer default
  const listResA = await app.request('/account/addresses', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const listA = (await listResA.json()).data;
  assert.equal(listA.length, 2);
  const updatedAddr1 = listA.find((a: any) => a.id === addr1.id);
  assert.equal(updatedAddr1.isDefault, false);

  // 3. User B attempts to edit User A's address -> 403 Forbidden
  const hackEditRes = await app.request(`/account/addresses/${addr1.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${tokenB}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ label: 'Hacked Label' }),
  });
  assert.equal(hackEditRes.status, 403, 'User B should not be able to edit User A address');

  // 4. User B attempts to delete User A's address -> 403 Forbidden
  const hackDelRes = await app.request(`/account/addresses/${addr1.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert.equal(hackDelRes.status, 403, 'User B should not be able to delete User A address');

  // 5. User A successfully deletes address 1
  const delRes = await app.request(`/account/addresses/${addr1.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.equal(delRes.status, 200);

  // Cleanup
  await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
});

test('Sprint 2 AC-3: Riwayat Order & Lacak Resi (WaybillTrackingCache)', async () => {
  const app = createTestApp();
  const passwordHash = await hashPassword('password123');

  const user = await prisma.user.create({
    data: { email: `user-order-${Date.now()}@test.com`, passwordHash, name: 'Pembeli Buku', role: 'USER' },
  });
  const token = await signJwt({ id: user.id, email: user.email, role: user.role });

  const product = await prisma.product.findFirst();
  assert.ok(product, 'A product must exist in database');

  const orderNumber = `BS-${Date.now()}`;
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      totalAmount: 150000,
      grandTotal: 165000,
      shippingCost: 15000,
      status: 'SHIPPED',
      courierCode: 'jne',
      courierService: 'REG',
      waybillNumber: `JNE-TEST-${Date.now()}`,
      shippingAddress: { city: 'Kota Malang', receiverName: 'Pembeli Buku' },
      items: {
        create: {
          productId: product.id,
          price: 150000,
          quantity: 1,
        },
      },
    },
  });

  // 1. Get orders list
  const ordersRes = await app.request('/account/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(ordersRes.status, 200);
  const ordersList = (await ordersRes.json()).data;
  assert.ok(ordersList.some((o: any) => o.orderNumber === orderNumber));

  // 2. Track order resi
  const trackRes = await app.request(`/account/orders/${orderNumber}/tracking`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(trackRes.status, 200);
  const trackData = (await trackRes.json()).data;
  assert.equal(trackData.orderNumber, orderNumber);
  assert.equal(trackData.courier, 'jne');
  assert.ok(Array.isArray(trackData.history));
  assert.ok(trackData.history.length > 0);

  // Cleanup
  await prisma.order.delete({ where: { id: order.id } });
  await prisma.user.delete({ where: { id: user.id } });
});

test('Sprint 2 AC-4: Verified Purchase Review & Deduplication', async () => {
  const app = createTestApp();
  const passwordHash = await hashPassword('password123');

  const user = await prisma.user.create({
    data: { email: `user-rev-${Date.now()}@test.com`, passwordHash, name: 'Ibu Reviewer', role: 'USER' },
  });
  const otherUser = await prisma.user.create({
    data: { email: `other-${Date.now()}@test.com`, passwordHash, name: 'Other User', role: 'USER' },
  });

  const token = await signJwt({ id: user.id, email: user.email, role: user.role });
  const otherToken = await signJwt({ id: otherUser.id, email: otherUser.email, role: otherUser.role });

  const product = await prisma.product.findFirst();
  assert.ok(product, 'Product must exist');

  // Create an order in PROCESSING status
  const pendingOrder = await prisma.order.create({
    data: {
      orderNumber: `BS-PEND-${Date.now()}`,
      userId: user.id,
      totalAmount: 120000,
      grandTotal: 130000,
      shippingCost: 10000,
      status: 'PROCESSING',
      shippingAddress: { city: 'Kota Malang' },
      items: {
        create: {
          productId: product.id,
          price: 120000,
          quantity: 1,
        },
      },
    },
    include: { items: true },
  });

  const pendingItem = pendingOrder.items[0];

  // 1. Review on non-shipped/non-completed order -> 400 Bad Request
  const prematureReviewRes = await app.request('/account/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderItemId: pendingItem.id,
      rating: 5,
      comment: 'Buku sangat bagus dan rapi!',
    }),
  });
  assert.equal(prematureReviewRes.status, 400);

  // Update order status to SHIPPED
  await prisma.order.update({
    where: { id: pendingOrder.id },
    data: { status: 'SHIPPED' },
  });

  // 2. Other user tries to review user's item -> 403 Forbidden
  const forbiddenRes = await app.request('/account/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${otherToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderItemId: pendingItem.id,
      rating: 5,
      comment: 'Review palsu orang lain',
    }),
  });
  assert.equal(forbiddenRes.status, 403);

  // 3. Legitimate user submits review -> 201 Created
  const validReviewRes = await app.request('/account/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderItemId: pendingItem.id,
      rating: 5,
      comment: 'Kualitas board book sangat tebal dan ramah anak. Si kecil suka sekali!',
    }),
  });
  assert.equal(validReviewRes.status, 201);
  const createdReview = (await validReviewRes.json()).data;
  assert.equal(createdReview.isVerifiedPurchase, true);

  // 4. Duplicate review on the same orderItem -> 400 Conflict / Already reviewed
  const dupReviewRes = await app.request('/account/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderItemId: pendingItem.id,
      rating: 4,
      comment: 'Mencoba review kedua kali pada item yang sama',
    }),
  });
  assert.equal(dupReviewRes.status, 400);

  // Cleanup
  await prisma.review.deleteMany({ where: { orderItemId: pendingItem.id } });
  await prisma.order.delete({ where: { id: pendingOrder.id } });
  await prisma.user.deleteMany({ where: { id: { in: [user.id, otherUser.id] } } });
});
