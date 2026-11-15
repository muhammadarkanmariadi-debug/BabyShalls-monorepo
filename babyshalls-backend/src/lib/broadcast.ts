import { DiscountType } from '@prisma/client';
import { prisma } from './prisma.js';
import { sendBroadcastTemplateEmail } from './mailer.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export interface BroadcastPayload {
  type: 'PROMO' | 'EVENT' | 'CUSTOM';
  referenceId?: string;
  subject: string;
  badgeText: string;
  headline: string;
  messageBody: string;
  highlightCode?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export async function runEmailBroadcast(payload: BroadcastPayload): Promise<{
  recipientCount: number;
  sentCount: number;
  status: string;
}> {
  const subscribers = await prisma.user.findMany({
    where: { emailOptIn: true },
    select: { email: true, name: true, parentName: true },
  });

  if (subscribers.length === 0) {
    await prisma.broadcastLog.create({
      data: {
        type: payload.type,
        referenceId: payload.referenceId ?? null,
        subject: payload.subject,
        recipientCount: 0,
        sentCount: 0,
        status: 'SKIPPED',
      },
    });
    return { recipientCount: 0, sentCount: 0, status: 'SKIPPED' };
  }

  let sentCount = 0;
  const BATCH_SIZE = 10;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((sub) =>
        sendBroadcastTemplateEmail({
          to: sub.email,
          recipientName: sub.parentName || sub.name || 'Bunda/Ayah',
          subject: payload.subject,
          badgeText: payload.badgeText,
          headline: payload.headline,
          messageBody: payload.messageBody,
          highlightCode: payload.highlightCode,
          ctaLabel: payload.ctaLabel,
          ctaUrl: payload.ctaUrl,
        })
      )
    );
    sentCount += results.filter((r) => r.sent || r.previewLogged).length;
  }

  const status =
    sentCount === subscribers.length
      ? 'SENT'
      : sentCount > 0
        ? 'PARTIAL'
        : 'FAILED';

  await prisma.broadcastLog.create({
    data: {
      type: payload.type,
      referenceId: payload.referenceId ?? null,
      subject: payload.subject,
      recipientCount: subscribers.length,
      sentCount,
      status,
    },
  });

  return { recipientCount: subscribers.length, sentCount, status };
}

export function triggerCouponBroadcastAsync(coupon: {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: unknown;
  minOrder: unknown;
}) {
  const val = Number(coupon.discountValue);
  const discountText =
    coupon.discountType === DiscountType.PERCENTAGE
      ? `${val}%`
      : coupon.discountType === DiscountType.SHIPPING_SUBSIDY
        ? `Subsidi Ongkir Rp ${val.toLocaleString('id-ID')}`
        : `Rp ${val.toLocaleString('id-ID')}`;

  const minOrderVal = Number(coupon.minOrder || 0);
  const minOrderText =
    minOrderVal > 0
      ? ` dengan minimal belanja Rp ${minOrderVal.toLocaleString('id-ID')}`
      : ' tanpa minimal belanja';

  void runEmailBroadcast({
    type: 'PROMO',
    referenceId: coupon.id,
    subject: `[BabyShalls Promo] Kode Voucher Baru: ${coupon.code} (${discountText})`,
    badgeText: 'PROMO TERBARU',
    headline: `Nikmati Potongan ${discountText} di BabyShalls!`,
    messageBody: `<p>${coupon.description || `Gunakan kode voucher spesial berikut untuk belanja buku anak kurasi & mainan kayu edukasi${minOrderText}.`}</p>`,
    highlightCode: coupon.code,
    ctaLabel: 'Belanja Sekarang',
    ctaUrl: `${FRONTEND_URL}/catalog`,
  }).catch((err) => {
    console.warn('⚠️ Gagal menjalankan auto-broadcast kupon:', err?.message || err);
  });
}

export function triggerEventBroadcastAsync(event: {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: Date;
  timeString: string;
  location: string;
  price: unknown;
}) {
  const dateLabel = event.eventDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const priceVal = Number(event.price || 0);
  const priceText = priceVal > 0 ? `Rp ${priceVal.toLocaleString('id-ID')}` : 'Gratis';

  void runEmailBroadcast({
    type: 'EVENT',
    referenceId: event.id,
    subject: `[BabyShalls Workshop] ${event.title}`,
    badgeText: 'EVENT & WORKSHOP BARU',
    headline: event.title,
    messageBody: `
      <p>${event.description}</p>
      <p style="margin-top:12px;">
        <strong>Tanggal:</strong> ${dateLabel}<br/>
        <strong>Waktu:</strong> ${event.timeString}<br/>
        <strong>Lokasi:</strong> ${event.location}<br/>
        <strong>Biaya:</strong> ${priceText}
      </p>
    `,
    ctaLabel: 'Daftar Event Sekarang',
    ctaUrl: `${FRONTEND_URL}/events/register?event=${encodeURIComponent(event.slug)}`,
  }).catch((err) => {
    console.warn('⚠️ Gagal menjalankan auto-broadcast event:', err?.message || err);
  });
}

