import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST?.trim() || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER?.trim() || '';
const SMTP_PASS = process.env.SMTP_PASS?.trim() || '';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'BabyShalls Malang';
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER || 'halo@babyshalls.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export function isEmailConfigured(): boolean {
  return Boolean(
    SMTP_HOST &&
      SMTP_USER &&
      SMTP_PASS &&
      !SMTP_PASS.includes('your-smtp') &&
      !SMTP_PASS.includes('xxxx') &&
      !SMTP_PASS.includes('app-password')
  );
}

const transporter = isEmailConfigured()
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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF8EF;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#502E1E;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FFF8EF;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #EBDCCB;">
          <tr>
            <td style="background-color:#502E1E;padding:24px 28px;text-align:center;">
              <div style="font-size:24px;font-weight:700;color:#FFF8EF;letter-spacing:0.5px;">BabyShalls</div>
              <div style="font-size:12px;color:#EBDCCB;margin-top:4px;">Curated Children’s Books &amp; Educational Wooden Toys · Malang Boutique</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="background-color:#FCF6EC;padding:18px 28px;border-top:1px solid #EBDCCB;text-align:center;font-size:12px;color:#6B3F2A;">
              <div style="font-weight:600;color:#502E1E;">BabyShalls Boutique Malang</div>
              <div style="margin-top:4px;">Citraland Puncak Tidar Blok HH-26, Malang City, East Java</div>
              <div style="margin-top:8px;">
                <a href="${FRONTEND_URL}" style="color:#D9744A;text-decoration:none;font-weight:600;">Visit Boutique Store</a>
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
    console.info(`📧 [SMTP Fallback Preview] To: ${options.to} | Subject: ${options.subject}`);
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`⚠️ [SMTP Error] Gagal kirim email ke ${options.to}:`, message);
    console.info(`📧 [SMTP Fallback Preview] To: ${options.to} | Subject: ${options.subject}`);
    return { sent: false, previewLogged: true };
  }
}

export async function sendOtpEmail(params: {
  to: string;
  name: string;
  otpCode: string;
  magicLinkUrl?: string;
  expiresInMinutes?: number;
}) {
  const ttlMinutes = params.expiresInMinutes ?? 5;
  console.info(`\n========================================\n🔑 [OTP CODE] To: ${params.to} | OTP Code: ${params.otpCode}\n========================================\n`);
  const magicLinkSection = params.magicLinkUrl
    ? `<div style="margin:20px 0;text-align:center;">
         <a href="${params.magicLinkUrl}" style="display:inline-block;padding:13px 28px;background-color:#D9744A;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
           Sign In Automatically Now
         </a>
       </div>`
    : '';

  const html = wrapEmailLayout(
    'BabyShalls OTP Verification Code',
    `
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Sign In Verification Code</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Hello <strong>${escapeHtml(params.name)}</strong>, use the following 6-digit verification code to access your BabyShalls account:
    </p>
    <div style="margin:16px 0 20px;padding:18px;background-color:#FCF6EC;border:2px dashed #D9744A;border-radius:16px;text-align:center;">
      <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#502E1E;">${escapeHtml(params.otpCode)}</span>
    </div>
    ${magicLinkSection}
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6B3F2A;">
      This code is valid for <strong>${ttlMinutes} minutes</strong>. For your account security, do not share this code with anyone.
    </p>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] Your Verification OTP Code: ${params.otpCode}`,
    html,
    text: `Hello ${params.name}, your BabyShalls OTP verification code is ${params.otpCode} (valid for ${ttlMinutes} minutes).`,
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  otpCode: string;
  resetLinkUrl?: string;
  expiresInMinutes?: number;
}) {
  const ttlMinutes = params.expiresInMinutes ?? 5;
  const resetLinkBlock = params.resetLinkUrl
    ? `<div style="margin:20px 0;text-align:center;">
         <a href="${params.resetLinkUrl}" style="display:inline-block;padding:13px 28px;background-color:#D9744A;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
           Reset Password Now
         </a>
       </div>`
    : '';

  const html = wrapEmailLayout(
    'BabyShalls Password Reset',
    `
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Password Reset Request</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Hello <strong>${escapeHtml(params.name)}</strong>, enter the following 6-digit code to reset your BabyShalls account password:
    </p>
    ${resetLinkBlock}
    <div style="margin:16px 0 20px;padding:18px;background-color:#FCF6EC;border:2px dashed #D9744A;border-radius:16px;text-align:center;">
      <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#502E1E;">${escapeHtml(params.otpCode)}</span>
    </div>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6B3F2A;">
      This code is valid for <strong>${ttlMinutes} minutes</strong>.
    </p>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] Account Password Reset (Code: ${params.otpCode})`,
    html,
    text: `Hello ${params.name}, your BabyShalls password reset code is ${params.otpCode}.`,
  });
}

export async function sendOrderReceiptEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  statusLabel: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  totalAmount: number;
  shippingCourier?: string | null;
  shippingService?: string | null;
  shippingAddress: string;
}) {
  const rowsHtml = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #F3E8D8;font-size:13px;color:#502E1E;">
          ${escapeHtml(item.name)} <span style="color:#8B634B;">x${item.quantity}</span>
        </td>
        <td align="right" style="padding:10px 8px;border-bottom:1px solid #F3E8D8;font-size:13px;font-weight:600;color:#502E1E;">
          ${formatIDR(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const html = wrapEmailLayout(
    `Order ${params.orderNumber}`,
    `
    <h2 style="margin:0 0 8px;font-size:20px;color:#502E1E;">Hello, ${escapeHtml(params.customerName)}!</h2>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#6B3F2A;">
      Thank you for shopping at BabyShalls Malang. Here are your order details:
    </p>
    <div style="background-color:#FCF6EC;border:1px solid #EBDCCB;border-radius:14px;padding:14px 16px;margin-bottom:18px;">
      <div style="font-size:12px;color:#8B634B;">Order Number</div>
      <div style="font-size:18px;font-weight:700;color:#502E1E;margin-top:2px;">${escapeHtml(params.orderNumber)}</div>
      <div style="margin-top:8px;font-size:12px;font-weight:700;color:#2D6A4F;">Status: ${escapeHtml(params.statusLabel)}</div>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:16px;">
      ${rowsHtml}
      <tr>
        <td style="padding:10px 8px;font-size:14px;font-weight:700;color:#502E1E;">Total Amount</td>
        <td align="right" style="padding:10px 8px;font-size:16px;font-weight:800;color:#D9744A;">${formatIDR(params.totalAmount)}</td>
      </tr>
    </table>
    <div style="background-color:#FAF3E9;border-radius:12px;padding:12px 14px;font-size:13px;color:#502E1E;">
      <strong>Delivery Address:</strong><br />
      ${escapeHtml(params.shippingAddress)}
    </div>
    `
  );

  return sendEmail({
    to: params.to,
    subject: `[BabyShalls] Order Confirmation ${params.orderNumber} (${params.statusLabel})`,
    html,
    text: `Hello ${params.customerName}, order ${params.orderNumber} is currently ${params.statusLabel}. Total: ${formatIDR(params.totalAmount)}.`,
  });
}
