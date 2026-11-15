import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'BabyShalls Malang';
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER || 'halo@babyshalls.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export function isSmtpConfigured(): boolean {
  return Boolean(
    SMTP_HOST &&
    SMTP_USER &&
    SMTP_PASS &&
    !SMTP_PASS.includes('your-smtp') &&
    !SMTP_PASS.includes('xxxx')
  );
}

const transporter = isSmtpConfigured()
  ? nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
  : null;

function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapEmailLayout(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF8EF;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#502E1E;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FFF8EF;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border-radius:20px;border:1px solid #EBDCCB;overflow:hidden;">
          <tr>
            <td style="background-color:#502E1E;padding:22px 28px;text-align:center;">
              <div style="font-size:22px;font-weight:700;color:#FFF8EF;letter-spacing:0.5px;">BabyShalls</div>
              <div style="font-size:12px;color:#F6C95E;margin-top:4px;">Butik Buku Anak Kurasi &amp; Mainan Kayu Edukasi • Kota Malang</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="background-color:#FCF6EC;padding:18px 28px;text-align:center;font-size:12px;color:#6B3F2A;border-top:1px solid #EBDCCB;">
              <div>BabyShalls Malang • Jl. Cempaka No. 12, Kota Malang</div>
              <div style="margin-top:6px;">
                <a href="${FRONTEND_URL}" style="color:#D9744A;text-decoration:none;font-weight:600;">Kunjungi Toko</a>
                &nbsp;•&nbsp;
                <a href="${FRONTEND_URL}/account" style="color:#D9744A;text-decoration:none;font-weight:600;">Kelola Akun</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ sent: boolean; previewLogged: boolean }> {
  if (!transporter) {
    console.info(
      `📧 [SMTP Fallback Preview] To: ${options.to} | Subject: ${options.subject}`
    );
    return { sent: false, previewLogged: true };
  }

  try {
    await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { sent: true, previewLogged: false };
  } catch (err: any) {
    console.warn(`⚠️ [SMTP Error] Gagal kirim email ke ${options.to}:`, err?.message || err);
    return { sent: false, previewLogged: false };
  }
}

export interface OrderReceiptEmailItem {
  name: string;
  quantity: number;
  price: number;
}

const sentReceiptCache = new Map<string, number>();
const RECEIPT_DEDUP_TTL_MS = 10 * 60 * 1000;

export async function sendOrderReceiptEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  eventType: 'ORDER_CREATED' | 'PAYMENT_PAID' | 'SHIPPED';
  items: OrderReceiptEmailItem[];
  totalAmount: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  courierCode?: string | null;
  courierService?: string | null;
  waybillNumber?: string | null;
  shippingAddressText?: string;
}) {
  const dedupKey = `${params.orderNumber}:${params.eventType}`;
  const now = Date.now();
  const prevSentAt = sentReceiptCache.get(dedupKey);
  if (prevSentAt && now - prevSentAt < RECEIPT_DEDUP_TTL_MS) {
    return;
  }
  sentReceiptCache.set(dedupKey, now);
  const statusTitleMap = {
    ORDER_CREATED: `Konfirmasi Pesanan #${params.orderNumber}`,
    PAYMENT_PAID: `Pembayaran Diterima • Resi Pesanan #${params.orderNumber}`,
    SHIPPED: `Pesanan Dikirim • Nomor Resi #${params.orderNumber}`,
  };

  const statusBadgeMap = {
    ORDER_CREATED: { label: 'Menunggu Pembayaran', bg: '#FDF0B8', color: '#502E1E' },
    PAYMENT_PAID: { label: 'Pembayaran Lunas', bg: '#E9F3E4', color: '#1E543B' },
    SHIPPED: { label: 'Sedang Dikirim', bg: '#E0F2FE', color: '#0369A1' },
  };

  const badge = statusBadgeMap[params.eventType];
  const itemRows = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #F3ECE2;font-size:13px;">
          <strong>${escapeHtml(item.name)}</strong><br/>
          <span style="color:#6B3F2A;font-size:12px;">${item.quantity} x ${formatIDR(item.price)}</span>
        </td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #F3ECE2;font-size:13px;font-weight:600;">
          ${formatIDR(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const waybillBox = params.waybillNumber
    ? `<div style="margin:16px 0;padding:14px 16px;background-color:#E9F3E4;border:1px solid #C5DFB8;border-radius:12px;">
         <div style="font-size:11px;text-transform:uppercase;color:#1E543B;font-weight:700;">Nomor Resi Pengiriman</div>
         <div style="font-size:18px;font-weight:800;color:#1A1A1A;margin-top:4px;letter-spacing:0.5px;">${escapeHtml(params.waybillNumber)}</div>
         <div style="font-size:12px;color:#4A4A4A;margin-top:2px;">Kurir: ${escapeHtml((params.courierCode || '').toUpperCase())} ${escapeHtml(params.courierService || '')}</div>
       </div>`
    : '';

  const html = wrapEmailLayout(
    statusTitleMap[params.eventType],
    `
    <div style="margin-bottom:16px;">
      <span style="display:inline-block;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;background-color:${badge.bg};color:${badge.color};">
        ${badge.label}
      </span>
    </div>
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Halo, ${escapeHtml(params.customerName)}!</h2>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Terima kasih sudah berbelanja di BabyShalls Malang. Berikut adalah ringkasan resi pesanan <strong>#${escapeHtml(params.orderNumber)}</strong>:
    </p>
    ${waybillBox}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:12px 0 18px;">
      ${itemRows}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FCF6EC;border-radius:12px;padding:14px 16px;font-size:13px;">
      <tr>
        <td style="padding:4px 0;color:#6B3F2A;">Subtotal Produk</td>
        <td align="right" style="padding:4px 0;">${formatIDR(params.totalAmount)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6B3F2A;">Ongkos Kirim (${escapeHtml((params.courierCode || '').toUpperCase())} ${escapeHtml(params.courierService || '')})</td>
        <td align="right" style="padding:4px 0;">${formatIDR(params.shippingCost)}</td>
      </tr>
      ${params.discountAmount > 0
      ? `<tr>
               <td style="padding:4px 0;color:#1E543B;">Diskon Voucher</td>
               <td align="right" style="padding:4px 0;color:#1E543B;">-${formatIDR(params.discountAmount)}</td>
             </tr>`
      : ''
    }
      <tr>
        <td style="padding:10px 0 2px;font-size:15px;font-weight:700;border-top:1px solid #EBDCCB;">Total Pembayaran</td>
        <td align="right" style="padding:10px 0 2px;font-size:15px;font-weight:700;border-top:1px solid #EBDCCB;color:#D9744A;">
          ${formatIDR(params.grandTotal)}
        </td>
      </tr>
    </table>
    ${params.shippingAddressText
      ? `<p style="margin:16px 0 0;font-size:12px;color:#6B3F2A;"><strong>Alamat Pengiriman:</strong><br/>${escapeHtml(params.shippingAddressText)}</p>`
      : ''
    }
    <div style="margin-top:24px;text-align:center;">
      <a href="${FRONTEND_URL}/account" style="display:inline-block;padding:12px 24px;background-color:#D9744A;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;">
        Lihat Detail Pesanan di Akun
      </a>
    </div>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] ${statusTitleMap[params.eventType]}`,
    html,
  });
}

export async function sendOtpEmail(params: {
  to: string;
  name: string;
  otpCode: string;
  expiresInMinutes?: number;
  magicLinkUrl?: string;
}) {
  const ttlMinutes = params.expiresInMinutes ?? 5;
  console.info(`🔐 [OTP Login] Kode OTP untuk ${params.to}: ${params.otpCode} (berlaku ${ttlMinutes} menit)`);
  if (params.magicLinkUrl) {
    console.info(`🔗 [Magic Link] ${params.magicLinkUrl}`);
  }

  const magicLinkBlock = params.magicLinkUrl
    ? `<div style="margin:18px 0 22px;text-align:center;">
         <a href="${params.magicLinkUrl}" style="display:inline-block;padding:13px 28px;background-color:#D9744A;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
           Masuk Langsung (1-Klik)
         </a>
         <div style="font-size:12px;color:#6B3F2A;margin-top:8px;">
           Atau masukkan kode 6 digit di bawah ini jika Anda login dari perangkat lain:
         </div>
       </div>`
    : '';

  const html = wrapEmailLayout(
    'Verifikasi Login BabyShalls',
    `
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Verifikasi Masuk Akun</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Halo <strong>${escapeHtml(params.name)}</strong>, klik tombol di bawah atau gunakan kode OTP untuk masuk ke akun BabyShalls Anda:
    </p>
    ${magicLinkBlock}
    <div style="margin:16px 0 20px;padding:18px;background-color:#FCF6EC;border:2px dashed #D9744A;border-radius:16px;text-align:center;">
      <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#502E1E;">${escapeHtml(params.otpCode)}</span>
    </div>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6B3F2A;">
      Link &amp; kode ini berlaku selama <strong>${ttlMinutes} menit</strong>. Demi keamanan akun, jangan bagikan kepada siapa pun.
    </p>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] Masuk ke Akun Anda (Kode: ${params.otpCode})`,
    html,
    text: `Halo ${params.name}, kode OTP login BabyShalls Anda adalah ${params.otpCode} (berlaku ${ttlMinutes} menit).${params.magicLinkUrl ? ` Atau klik link berikut: ${params.magicLinkUrl}` : ''}`,
  });
}

export async function sendBroadcastTemplateEmail(params: {
  to: string;
  recipientName: string;
  subject: string;
  badgeText: string;
  headline: string;
  messageBody: string;
  highlightCode?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const html = wrapEmailLayout(
    params.subject,
    `
    <div style="margin-bottom:14px;">
      <span style="display:inline-block;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;background-color:#F6C95E;color:#502E1E;">
        ${escapeHtml(params.badgeText)}
      </span>
    </div>
    <h2 style="margin:0 0 10px;font-size:22px;color:#502E1E;">${escapeHtml(params.headline)}</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Halo <strong>${escapeHtml(params.recipientName)}</strong>,
    </p>
    <div style="font-size:14px;line-height:1.7;color:#502E1E;margin-bottom:18px;">
      ${params.messageBody}
    </div>
    ${params.highlightCode
      ? `<div style="margin:18px 0;padding:14px 16px;background-color:#FCF6EC;border:1.5px dashed #D9744A;border-radius:12px;text-align:center;">
             <div style="font-size:11px;color:#6B3F2A;font-weight:700;text-transform:uppercase;">Kode Promo Spesial</div>
             <div style="font-size:22px;font-weight:800;color:#D9744A;margin-top:4px;letter-spacing:2px;">${escapeHtml(params.highlightCode)}</div>
           </div>`
      : ''
    }
    <div style="margin-top:24px;text-align:center;">
      <a href="${params.ctaUrl || FRONTEND_URL}" style="display:inline-block;padding:12px 26px;background-color:#D9744A;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;">
        ${escapeHtml(params.ctaLabel || 'Lihat Selengkapnya')}
      </a>
    </div>
    `
  );

  return sendEmail({
    to: params.to,
    subject: params.subject,
    html,
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  otpCode: string;
  expiresInMinutes?: number;
  resetLinkUrl?: string;
}) {
  const ttlMinutes = params.expiresInMinutes ?? 5;
  const resetLinkBlock = params.resetLinkUrl
    ? `<div style="margin:20px 0;text-align:center;">
         <a href="${params.resetLinkUrl}" style="display:inline-block;padding:13px 28px;background-color:#D9744A;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
           Reset Password Sekarang
         </a>
         <div style="font-size:12px;color:#6B3F2A;margin-top:8px;">
           Atau masukkan kode 6 digit di bawah ini pada halaman Lupa Password:
         </div>
       </div>`
    : '';

  const html = wrapEmailLayout(
    'Reset Password BabyShalls',
    `
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Permintaan Reset Password</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Halo <strong>${escapeHtml(params.name)}</strong>, kami menerima permintaan untuk mengatur ulang password akun BabyShalls Anda:
    </p>
    ${resetLinkBlock}
    <div style="margin:16px 0 20px;padding:18px;background-color:#FCF6EC;border:2px dashed #D9744A;border-radius:16px;text-align:center;">
      <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#502E1E;">${escapeHtml(params.otpCode)}</span>
    </div>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6B3F2A;">
      Kode berlaku selama <strong>${ttlMinutes} menit</strong>. Abaikan email ini jika Anda tidak merasa meminta reset password.
    </p>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] Reset Password Akun (Kode: ${params.otpCode})`,
    html,
    text: `Halo ${params.name}, kode reset password BabyShalls Anda adalah ${params.otpCode} (berlaku ${ttlMinutes} menit).`,
  });
}

export async function sendEmailChangeOtpEmail(params: {
  to: string;
  name: string;
  otpCode: string;
  expiresInMinutes?: number;
}) {
  const ttlMinutes = params.expiresInMinutes ?? 5;
  const html = wrapEmailLayout(
    'Verifikasi Email Baru BabyShalls',
    `
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Konfirmasi Perubahan Email</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Halo <strong>${escapeHtml(params.name)}</strong>, masukkan kode OTP berikut di halaman Profil untuk mengonfirmasi alamat email baru Anda:
    </p>
    <div style="margin:16px 0 20px;padding:18px;background-color:#FCF6EC;border:2px dashed #D9744A;border-radius:16px;text-align:center;">
      <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#502E1E;">${escapeHtml(params.otpCode)}</span>
    </div>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6B3F2A;">
      Kode berlaku selama <strong>${ttlMinutes} menit</strong>. Jangan bagikan kode ini kepada siapa pun.
    </p>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] Verifikasi Email Baru (Kode: ${params.otpCode})`,
    html,
    text: `Halo ${params.name}, kode verifikasi email baru BabyShalls Anda adalah ${params.otpCode} (berlaku ${ttlMinutes} menit).`,
  });
}

