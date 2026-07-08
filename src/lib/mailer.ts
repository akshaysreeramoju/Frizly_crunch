/**
 * mailer.ts
 *
 * Email notification utility for Frizly Crunch order system.
 *
 * Supports two backends — configure via environment variables:
 *   Option A (Gmail/SMTP): set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   Option B (Resend):     set RESEND_API_KEY
 *
 * Required env vars:
 *   ADMIN_EMAIL           — Where admin order alerts are sent
 *   SMTP_USER             — Gmail / SMTP sender address (Option A)
 *   SMTP_PASS             — Gmail App Password (Option A)
 *   RESEND_API_KEY        — Resend API key (Option B)
 */

import nodemailer from 'nodemailer';
import { SITE_CONFIG } from './siteConfig';

// ---------------------------------------------------------------------------
// Transporter setup
// ---------------------------------------------------------------------------
function createTransporter() {
  // Option B: Resend (preferred for production — use SMTP relay)
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  // Option A: Gmail / custom SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// When using Resend, the sender must be a verified domain address (not Gmail).
const FROM_ADDRESS = process.env.RESEND_API_KEY
  ? `"Frizly Crunch" <orders@frizlycrunch.com>`
  : `"Frizly Crunch" <${process.env.SMTP_USER || 'orders@frizlycrunch.com'}>`;

// ---------------------------------------------------------------------------
// Shared email styles (inline for email client compatibility)
// ---------------------------------------------------------------------------
const BRAND = {
  burgundy: '#6B1E1E',
  gold: '#D4AF37',
  cream: '#fdf9f4',
  text: '#3d2c1e',
  sage: '#7A8F6A',
  border: '#f0e8d8',
};

// ---------------------------------------------------------------------------
// Helper: format order items rows for email tables
// ---------------------------------------------------------------------------
function formatItemsHtml(items: Array<{ product: { name: string; price: number }; qty: number }>) {
  return items
    .map(
      ({ product, qty }) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};color:${BRAND.text};font-size:14px;">${product.name}</td>
        <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};text-align:center;color:${BRAND.text};font-size:14px;">${qty}</td>
        <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};text-align:right;font-weight:600;color:${BRAND.text};font-size:14px;">₹${(product.price * qty).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');
}

// ---------------------------------------------------------------------------
// Customer confirmation email
// ---------------------------------------------------------------------------
export async function sendCustomerOrderConfirmation(order: {
  id: string;
  items: Array<{ product: { name: string; price: number }; qty: number }>;
  shippingAddress: { fullName: string; phone: string; address: string; city: string; pincode: string; email?: string };
  total: number;
  discountAmount?: number;
  couponCode?: string | null;
  shippingCost?: number;
  razorpayPaymentId?: string;
  createdAt: string;
}) {
  const customerEmail = order.shippingAddress.email;
  if (!customerEmail) {
    console.warn(`[Mailer] No customer email for order ${order.id} — skipping confirmation`);
    return;
  }

  if (!process.env.SMTP_USER && !process.env.RESEND_API_KEY) {
    console.warn('[Mailer] No SMTP/Resend credentials — skipping email');
    return;
  }

  const transporter = createTransporter();
  const { shippingAddress: addr } = order;
  const firstName = addr.fullName.split(' ')[0];
  const subtotal = order.total - (order.shippingCost || 0) + (order.discountAmount || 0);
  const siteUrl = `https://${SITE_CONFIG.contact.website}`;
  const trackUrl = `${siteUrl}/track?id=${order.id}`;
  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed — ${order.id}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,30,30,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.burgundy};padding:36px 32px;text-align:center;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Frizly Crunch</p>
            <h1 style="margin:0 0 6px;color:${BRAND.gold};font-size:28px;font-weight:700;">Thank you, ${firstName}! 🎉</h1>
            <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;">Your order has been confirmed.</p>
          </td>
        </tr>

        <!-- Order ID Banner -->
        <tr>
          <td style="background:#fef9ef;padding:14px 32px;border-bottom:1px solid ${BRAND.border};text-align:center;">
            <p style="margin:0;font-size:13px;color:#8a7060;">Order ID: <strong style="color:${BRAND.burgundy};letter-spacing:1px;">${order.id}</strong> &nbsp;·&nbsp; ${orderDate} IST</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:0 0 24px;">
              We've received your order and it's being carefully prepared for you.
              You'll receive a shipping notification with tracking details once your order is on its way. 🚚
            </p>

            <!-- Items Table -->
            <h2 style="margin:0 0 12px;color:${BRAND.burgundy};font-size:16px;font-weight:700;border-bottom:2px solid ${BRAND.border};padding-bottom:8px;">Your Order</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:${BRAND.cream};">
                  <th style="padding:10px 14px;text-align:left;color:${BRAND.burgundy};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                  <th style="padding:10px 14px;text-align:center;color:${BRAND.burgundy};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                  <th style="padding:10px 14px;text-align:right;color:${BRAND.burgundy};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
                </tr>
              </thead>
              <tbody>${formatItemsHtml(order.items)}</tbody>
            </table>

            <!-- Price Breakdown -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${BRAND.border};padding-top:4px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0;color:#8a7060;font-size:14px;">Subtotal</td>
                <td style="padding:6px 0;text-align:right;color:${BRAND.text};font-size:14px;">₹${subtotal.toLocaleString('en-IN')}</td>
              </tr>
              ${order.discountAmount && order.discountAmount > 0 ? `
              <tr>
                <td style="padding:6px 0;color:${BRAND.sage};font-size:14px;">💚 Discount${order.couponCode ? ` (${order.couponCode})` : ' (Launch offer)'}</td>
                <td style="padding:6px 0;text-align:right;color:${BRAND.sage};font-size:14px;font-weight:600;">−₹${order.discountAmount.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:6px 0;color:#8a7060;font-size:14px;">🚚 Shipping</td>
                <td style="padding:6px 0;text-align:right;font-size:14px;${order.shippingCost && order.shippingCost > 0 ? `color:${BRAND.text}` : `color:${BRAND.sage};font-weight:600;`}">
                  ${order.shippingCost && order.shippingCost > 0 ? `₹${order.shippingCost}` : 'FREE'}
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 4px;border-top:2px solid ${BRAND.border};font-size:18px;font-weight:700;color:${BRAND.burgundy};">Total Paid</td>
                <td style="padding:12px 0 4px;border-top:2px solid ${BRAND.border};text-align:right;font-size:18px;font-weight:700;color:${BRAND.burgundy};">₹${order.total.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <!-- Delivery Address -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:${BRAND.cream};border-radius:10px;padding:16px 18px;">
                  <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#8a7060;font-weight:600;">📦 Delivering to</p>
                  <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.8;">
                    <strong>${addr.fullName}</strong><br>
                    ${addr.address}<br>
                    ${addr.city} – ${addr.pincode}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Payment Status -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#f0faf0;border:1px solid #c8e6c9;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0;font-size:14px;color:#2e7d32;">
                    ✅ <strong>Payment Successful</strong> via Razorpay
                    ${order.razorpayPaymentId ? `<br><span style="font-size:12px;color:#5a8a5a;margin-top:4px;display:block;">Payment ID: ${order.razorpayPaymentId}</span>` : ''}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Estimated Delivery -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#fff8e1;border:1px solid #ffe082;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0;font-size:14px;color:#7a6000;">
                    📅 <strong>Estimated Delivery:</strong> 3–6 business days<br>
                    <span style="font-size:12px;color:#9a8000;margin-top:4px;display:block;">We'll email you a tracking link once your order ships.</span>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Track Order CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td align="center">
                  <a href="${trackUrl}" style="display:inline-block;background:${BRAND.burgundy};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:15px;letter-spacing:0.3px;">
                    Track My Order →
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${BRAND.cream};padding:20px 32px;text-align:center;border-top:1px solid ${BRAND.border};">
            <p style="margin:0 0 6px;font-size:13px;color:#9a8374;">
              Questions? We're here to help!
            </p>
            <p style="margin:0 0 6px;font-size:13px;color:#9a8374;">
              📞 ${SITE_CONFIG.contact.phone} &nbsp;·&nbsp; ✉️ ${SITE_CONFIG.contact.email}
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#c0a898;">${SITE_CONFIG.legal.companyName} · ${SITE_CONFIG.address.full}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: customerEmail,
    subject: `✅ Order Confirmed — ${order.id} | Frizly Crunch`,
    html,
  });

  console.log(`[Mailer] Customer confirmation sent to ${customerEmail} for order ${order.id}`);
}

// ---------------------------------------------------------------------------
// Admin notification email
// ---------------------------------------------------------------------------
export async function sendAdminOrderNotification(order: {
  id: string;
  items: Array<{ product: { name: string; price: number }; qty: number }>;
  shippingAddress: { fullName: string; phone: string; address: string; city: string; pincode: string; email?: string };
  total: number;
  discountAmount?: number;
  couponCode?: string | null;
  shippingCost?: number;
  paymentMethod: string;
  razorpayPaymentId?: string;
  createdAt: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'hello@frizlycrunch.com';
  if (!adminEmail) {
    console.warn('[Mailer] ADMIN_EMAIL not set — skipping admin notification');
    return;
  }

  if (!process.env.SMTP_USER && !process.env.RESEND_API_KEY) {
    console.warn('[Mailer] No SMTP/Resend credentials — skipping email');
    return;
  }

  const transporter = createTransporter();
  const { shippingAddress: addr } = order;
  const subtotal = order.total - (order.shippingCost || 0) + (order.discountAmount || 0);
  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const totalItems = order.items.reduce((sum, i) => sum + i.qty, 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order ${order.id}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,30,30,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.burgundy};padding:28px 32px;">
            <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Frizly Crunch · New Order</p>
            <h1 style="margin:0 0 4px;color:${BRAND.gold};font-size:24px;font-weight:700;">🛒 Order ${order.id}</h1>
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">${orderDate} IST &nbsp;·&nbsp; ${totalItems} item${totalItems !== 1 ? 's' : ''}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            <!-- Customer Info -->
            <h2 style="margin:0 0 12px;color:${BRAND.burgundy};font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">👤 Customer Details</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border-radius:10px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;width:120px;font-size:13px;color:#8a7060;font-weight:600;">Name</td>
                      <td style="padding:4px 0;font-size:14px;color:${BRAND.text};font-weight:600;">${addr.fullName}</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#8a7060;font-weight:600;">Phone</td>
                      <td style="padding:4px 0;font-size:14px;color:${BRAND.text};">📞 ${addr.phone}</td>
                    </tr>
                    ${addr.email ? `
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#8a7060;font-weight:600;">Email</td>
                      <td style="padding:4px 0;font-size:14px;color:${BRAND.text};">✉️ ${addr.email}</td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Delivery Address -->
            <h2 style="margin:0 0 12px;color:${BRAND.burgundy};font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">📦 Ship To</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border-radius:10px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 18px;font-size:14px;color:${BRAND.text};line-height:1.8;">
                  <strong>${addr.fullName}</strong><br>
                  ${addr.address}<br>
                  ${addr.city} – ${addr.pincode}
                </td>
              </tr>
            </table>

            <!-- Items Table -->
            <h2 style="margin:0 0 12px;color:${BRAND.burgundy};font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">🛍️ Items Ordered</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:${BRAND.cream};">
                  <th style="padding:10px 14px;text-align:left;color:${BRAND.burgundy};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                  <th style="padding:10px 14px;text-align:center;color:${BRAND.burgundy};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                  <th style="padding:10px 14px;text-align:right;color:${BRAND.burgundy};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
                </tr>
              </thead>
              <tbody>${formatItemsHtml(order.items)}</tbody>
            </table>

            <!-- Price Breakdown -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${BRAND.border};margin-bottom:24px;">
              <tr>
                <td style="padding:8px 0 4px;color:#8a7060;font-size:14px;">Subtotal</td>
                <td style="padding:8px 0 4px;text-align:right;color:${BRAND.text};font-size:14px;">₹${subtotal.toLocaleString('en-IN')}</td>
              </tr>
              ${order.discountAmount && order.discountAmount > 0 ? `
              <tr>
                <td style="padding:4px 0;color:${BRAND.sage};font-size:14px;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td>
                <td style="padding:4px 0;text-align:right;color:${BRAND.sage};font-size:14px;font-weight:600;">−₹${order.discountAmount.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:4px 0;color:#8a7060;font-size:14px;">Shipping</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;${order.shippingCost && order.shippingCost > 0 ? `color:${BRAND.text}` : `color:${BRAND.sage};font-weight:600`}">
                  ${order.shippingCost && order.shippingCost > 0 ? `₹${order.shippingCost}` : 'FREE'}
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 4px;border-top:2px solid ${BRAND.border};font-size:20px;font-weight:700;color:${BRAND.burgundy};">TOTAL COLLECTED</td>
                <td style="padding:12px 0 4px;border-top:2px solid ${BRAND.border};text-align:right;font-size:20px;font-weight:700;color:${BRAND.burgundy};">₹${order.total.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <!-- Payment Confirmation -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="background:#f0faf0;border:1px solid #c8e6c9;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0;font-size:14px;color:#2e7d32;">
                    ✅ <strong>Payment Confirmed</strong> — ${order.paymentMethod === 'razorpay' ? 'Razorpay (Online)' : order.paymentMethod}
                    ${order.razorpayPaymentId ? `<br><span style="font-size:12px;color:#5a8a5a;margin-top:4px;display:block;">Payment ID: <code style="background:#e8f5e9;padding:2px 6px;border-radius:4px;">${order.razorpayPaymentId}</code></span>` : ''}
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${BRAND.cream};padding:16px 32px;text-align:center;border-top:1px solid ${BRAND.border};">
            <p style="margin:0;font-size:12px;color:#9a8374;">Frizly Crunch Operations · ${SITE_CONFIG.contact.phone}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: adminEmail,
    subject: `🛒 New Order ${order.id} — ₹${order.total.toLocaleString('en-IN')} — ${addr.fullName}`,
    html,
  });

  console.log(`[Mailer] Admin notification sent for order ${order.id}`);
}

// ---------------------------------------------------------------------------
// Shipping update email (call when status changes to SHIPPED)
// ---------------------------------------------------------------------------
export async function sendShippingUpdateEmail(order: {
  id: string;
  shippingAddress: { fullName: string; email?: string };
  trackingNumber?: string;
  courierName?: string;
}) {
  const customerEmail = order.shippingAddress.email;
  if (!customerEmail) return;

  if (!process.env.SMTP_USER && !process.env.RESEND_API_KEY) return;

  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f9f5ef;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,30,30,0.08);">
    <div style="background:#7A8F6A;padding:28px 32px;text-align:center;">
      <h1 style="color:white;margin:0 0 4px;font-size:24px;">Your order is on its way! 🚚</h1>
      <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Order ${order.id}</p>
    </div>
    <div style="padding:28px 32px;text-align:center;">
      <p style="color:#3d2c1e;font-size:15px;line-height:1.7;">
        Hey ${order.shippingAddress.fullName.split(' ')[0]}, your Frizly Crunch order has been shipped!
        ${order.courierName ? `<br><strong>Courier:</strong> ${order.courierName}` : ''}
        ${order.trackingNumber ? `<br><strong>Tracking #:</strong> ${order.trackingNumber}` : ''}
      </p>
      <a href="${SITE_CONFIG.contact.website.startsWith('http') ? '' : 'https://'}${SITE_CONFIG.contact.website}/track?id=${order.id}"
         style="display:inline-block;background:#6B1E1E;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold;margin-top:16px;">
        Track My Order
      </a>
    </div>
    <div style="background:#fdf9f4;padding:14px 32px;text-align:center;font-size:12px;color:#9a8374;">
      📞 ${SITE_CONFIG.contact.phone} · ✉️ ${SITE_CONFIG.contact.email}
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: customerEmail,
    subject: `🚚 Your Frizly Crunch order ${order.id} is shipped!`,
    html,
  });
}

// ---------------------------------------------------------------------------
// Contact form notification
// ---------------------------------------------------------------------------
export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  if (!process.env.SMTP_USER && !process.env.RESEND_API_KEY) return;

  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f9f5ef;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,30,30,0.08);">
    <div style="background:#6B1E1E;padding:24px 32px;text-align:center;">
      <h1 style="color:#D4AF37;margin:0 0 4px;font-size:22px;">New Contact Message 📬</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#3d2c1e;font-size:14px;line-height:1.7;margin:0 0 16px;">
        <strong>From:</strong> ${data.name} (${data.email})<br>
        <strong>Subject:</strong> ${data.subject}
      </p>
      <div style="background:#fdf9f4;padding:16px;border-radius:10px;font-size:14px;color:#3d2c1e;line-height:1.6;white-space:pre-wrap;">${data.message}</div>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: adminEmail,
    replyTo: data.email,
    subject: `New Message from ${data.name}: ${data.subject}`,
    html,
  });
  console.log('[Mailer] Contact form notification sent to admin');
}

// ---------------------------------------------------------------------------
// Customer WhatsApp order confirmation (Meta Cloud API)
// ---------------------------------------------------------------------------
export async function sendCustomerWhatsAppConfirmation(order: {
  id: string;
  shippingAddress: { fullName: string; phone: string };
  total: number;
}) {
  const phone = order.shippingAddress.phone;
  if (!phone) return;

  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn('[Mailer] WhatsApp API credentials missing (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID). Skipping WhatsApp message.');
    return;
  }

  // Clean phone number: remove non-numeric chars, ensure it has country code (defaulting to 91 for India)
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  // Format message text
  const message = `🎉 *Order Confirmed!* 🎉\n\nHi ${order.shippingAddress.fullName.split(' ')[0]},\n\nYour Frizly Crunch order *${order.id}* has been successfully placed.\n\nTotal: ₹${order.total}\n\nWe will notify you once it's shipped! 🚚`;

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: message }
      })
    });

    if (!response.ok) {
      console.error('[Mailer] Failed to send WhatsApp:', await response.text());
    } else {
      console.log(`[Mailer] WhatsApp confirmation sent to ${formattedPhone}`);
    }
  } catch (error) {
    console.error('[Mailer] Error sending WhatsApp:', error);
  }
}

