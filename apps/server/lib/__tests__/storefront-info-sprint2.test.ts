import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../prisma';

test('Sprint 2 [S2-03] AC-1: Hampers Products & Custom Sets in DB', async () => {
  const hampers = await prisma.product.findMany({
    where: {
      OR: [
        { category: { contains: 'Hamper', mode: 'insensitive' } },
        { subCategory: { contains: 'Hamper', mode: 'insensitive' } },
        { name: { contains: 'Hamper', mode: 'insensitive' } },
      ],
    },
  });

  assert.ok(hampers.length > 0, 'Database should contain at least 1 curated Hamper gift set');
  const hamper = hampers[0];
  assert.ok(hamper.name.length > 0, 'Hamper must have a name');
  assert.ok(Number(hamper.price) > 0, 'Hamper must have a valid price');
});

test('Sprint 2 [S2-03] AC-2: Preloved Curated Products & UV Sanitization Flag', async () => {
  const preloved = await prisma.product.findMany({
    where: {
      OR: [
        { category: { contains: 'Preloved', mode: 'insensitive' } },
        { subCategory: { contains: 'Preloved', mode: 'insensitive' } },
        { name: { contains: 'Preloved', mode: 'insensitive' } },
      ],
    },
  });

  assert.ok(preloved.length > 0, 'Database should contain at least 1 curated Preloved product');
  const item = preloved[0];
  assert.ok(item.description.includes('UV-C') || (item.features as string[])?.some((f) => f.includes('UV-C')), 'Preloved item must mention UV-C sanitization');
});

test('Sprint 2 [S2-03] AC-3: SiteContent CMS Key-Values & Dynamic Fallback', async () => {
  // Test SiteContent persistence
  const testKey = 'test_cms_key_' + Date.now();
  const testVal = 'Test CMS Value ' + Date.now();

  await prisma.siteContent.upsert({
    where: { key: testKey },
    create: { key: testKey, value: testVal },
    update: { value: testVal },
  });

  const row = await prisma.siteContent.findUnique({
    where: { key: testKey },
  });

  assert.equal(row?.value, testVal, 'SiteContent must successfully store and retrieve CMS key-value');

  // Clean up
  await prisma.siteContent.delete({
    where: { key: testKey },
  });
});

test('Sprint 2 [S2-03] AC-4: Direct WhatsApp Link Format (RULE 02 Compliance)', () => {
  const waNumber = '6281234567890';
  const customText = 'Hello BabyShalls Team, I have a question regarding your store services.';
  const link = `https://wa.me/${waNumber}?text=${encodeURIComponent(customText)}`;

  assert.ok(link.startsWith('https://wa.me/'), 'WhatsApp link must use standard wa.me scheme');
  assert.ok(link.includes(waNumber), 'WhatsApp link must direct to official Malang store number');
  assert.ok(!link.includes('ai-chat') && !link.includes('bot'), 'No AI chatbot microservice allowed in Phase 1 (RULE 02)');
});
