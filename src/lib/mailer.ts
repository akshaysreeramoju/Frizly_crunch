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

const FROM_ADDRESS = `"Frizly Crunch" <${process.env.SMTP_USER || 'orders@frizlycrunch.com'}>`;

// ---------------------------------------------------------------------------
// Helper: format order items for email
// ---------------------------------------------------------------------------
function formatItemsHtml(items: Array<{ product: { name: string; price: number }; qty: number }>) {
  return items
    .map(
      ({ product, qty }) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8d8;">${product.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8d8;text-align:center;">${qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8d8;text-align:right;">₹${product.price * qty}</td>
      </tr>`
    )
    .join('');
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
  paymentMethod: string;
  razorpayPaymentId?: string;
  createdAt: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
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

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f9f5ef;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,30,30,0.08);">
    
    <!-- Header -->
    <div style="background:#6B1E1E;padding:24px 32px;">
      <h1 style="color:#D4AF37;margin:0;font-size:22px;letter-spacing:1px;">🛒 NEW ORDER — ${order.id}</h1>
      <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    </div>

    <!-- Body -->
    <div style="padding:24px 32px;">
      
      <!-- Customer Info -->
      <h2 style="color:#6B1E1E;font-size:16px;margin:0 0 12px;">📦 Ship To</h2>
      <div style="background:#fdf9f4;border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:14px;line-height:1.8;color:#3d2c1e;">
        <strong>${addr.fullName}</strong><br>
        ${addr.address}<br>
        ${addr.city} – ${addr.pincode}<br>
        📞 ${addr.phone}${addr.email ? `<br>✉️ ${addr.email}` : ''}
      </div>

      <!-- Items -->
      <h2 style="color:#6B1E1E;font-size:16px;margin:0 0 12px;">🛍️ Items Ordered</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr style="background:#fdf9f4;">
            <th style="padding:8px 12px;text-align:left;color:#6B1E1E;">Product</th>
            <th style="padding:8px 12px;text-align:center;color:#6B1E1E;">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#6B1E1E;">Amount</th>
          </tr>
        </thead>
        <tbody>${formatItemsHtml(order.items)}</tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #f0e8d8;padding-top:14px;font-size:14px;">
        ${order.discountAmount ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#7A8F6A;"><span>Discount${order.couponCode ? ` (${order.couponCode})` : ''}</span><span>−₹${order.discountAmount}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:bold;color:#6B1E1E;margin-top:8px;">
          <span>Total</span><span>₹${order.total}</span>
        </div>
      </div>

      <!-- Payment -->
      <div style="margin-top:16px;padding:12px 16px;background:#fdf9f4;border-radius:10px;font-size:13px;color:#3d2c1e;">
        💳 <strong>Payment:</strong> ${order.paymentMethod === 'razorpay' ? `Razorpay (Paid ✅)` : order.paymentMethod}
        ${order.razorpayPaymentId ? `<br>🔑 Payment ID: ${order.razorpayPaymentId}` : ''}
      </div>
    </div>

    <div style="background:#fdf9f4;padding:14px 32px;text-align:center;font-size:12px;color:#9a8374;">
      Frizly Crunch — ${SITE_CONFIG.contact.phone} · ${SITE_CONFIG.contact.email}
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: adminEmail,
    subject: `🛒 New Order ${order.id} — ₹${order.total} — ${order.shippingAddress.fullName}`,
    html,
  });

  console.log(`[Mailer] Admin notification sent for order ${order.id}`);
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

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f9f5ef;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,30,30,0.08);">
    
    <!-- Header -->
    <div style="background:#6B1E1E;padding:28px 32px;text-align:center;">
      <h1 style="color:#D4AF37;margin:0 0 4px;font-size:26px;">Thank you, ${addr.fullName.split(' ')[0]}! 🎉</h1>
      <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Your order has been confirmed.</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="color:#3d2c1e;font-size:15px;line-height:1.7;margin:0 0 20px;">
        We've received your order <strong style="color:#6B1E1E;">${order.id}</strong> and it's being prepared with care.<br>
        You'll receive a shipping update once your order is on its way. 🚚
      </p>

      <!-- Items -->
      <h2 style="color:#6B1E1E;font-size:16px;margin:0 0 12px;">Your Order</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr style="background:#fdf9f4;">
            <th style="padding:8px 12px;text-align:left;color:#6B1E1E;">Product</th>
            <th style="padding:8px 12px;text-align:center;color:#6B1E1E;">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#6B1E1E;">Amount</th>
          </tr>
        </thead>
        <tbody>${formatItemsHtml(order.items)}</tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #f0e8d8;padding-top:14px;font-size:14px;">
        ${order.discountAmount ? `<div style="color:#7A8F6A;margin-bottom:6px;">💚 Discount applied: −₹${order.discountAmount}</div>` : ''}
        <div style="font-size:18px;font-weight:bold;color:#6B1E1E;">Total Paid: ₹${order.total}</div>
      </div>

      <!-- Delivery address -->
      <div style="margin-top:20px;padding:14px 16px;background:#fdf9f4;border-radius:10px;font-size:13px;color:#3d2c1e;line-height:1.8;">
        📦 <strong>Delivering to:</strong><br>
        ${addr.address}, ${addr.city} – ${addr.pincode}
      </div>

      <!-- Track order -->
      <div style="margin-top:20px;text-align:center;">
        <a href="${SITE_CONFIG.contact.website.startsWith('http') ? '' : 'https://'}${SITE_CONFIG.contact.website}/track?id=${order.id}" 
           style="display:inline-block;background:#6B1E1E;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:14px;">
          Track My Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#fdf9f4;padding:16px 32px;text-align:center;font-size:12px;color:#9a8374;line-height:1.8;">
      Questions? Reply to this email or contact us:<br>
      📞 ${SITE_CONFIG.contact.phone} · ✉️ ${SITE_CONFIG.contact.email}<br>
      <span style="font-size:11px;opacity:0.7;">Frizly Crunch Foods Pvt. Ltd. · ${SITE_CONFIG.address.full}</span>
    </div>
  </div>
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

