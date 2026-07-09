import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { sendAdminOrderNotification, sendCustomerOrderConfirmation, sendCustomerWhatsAppConfirmation } from '@/lib/mailer';

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'FZ-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  console.log('[verify-payment] Request received');
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      shippingAddress,
      userId,
      discountPercent,
      discountAmount,
      couponCode,
      shippingCost,
      total,
    } = body;

    console.log(`[verify-payment] Verifying signature for order: ${razorpayOrderId}, payment: ${razorpayPaymentId}`);

    // --- Verify Razorpay signature ---
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error('[verify-payment] Signature mismatch — payment verification failed');
      return NextResponse.json(
        { success: false, message: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    console.log('[verify-payment] Signature verified ✅ — creating order record');

    // --- Create internal order record ---
    const orderId = generateOrderId();
    const trackingId = 'TRK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    const order = {
      id: orderId,
      trackingId,
      items,
      shippingAddress,
      paymentMethod: 'razorpay',
      razorpayOrderId,
      razorpayPaymentId,
      userId: userId || null,
      discountPercent: discountPercent || 0,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      shippingCost: shippingCost || 0,
      total,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };

    console.log(`[verify-payment] Order created: ${orderId}`);

    // Save to orders.json locally (will fail silently on Vercel read-only FS — that's OK)
    try {
      const ordersFile = path.join(process.cwd(), 'orders.json');
      let orders = [];
      try {
        const fileData = await fs.readFile(ordersFile, 'utf-8');
        orders = JSON.parse(fileData);
      } catch { /* file doesn't exist */ }
      orders.push(order);
      await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
      console.log('[verify-payment] Order saved to orders.json (local dev)');
    } catch (fsError) {
      console.warn('[verify-payment] orders.json write skipped (Vercel read-only FS):', (fsError as Error).message);
    }

    // --- Send notifications then respond ---
    // Emails are raced against an 8-second deadline so the API always
    // responds promptly and the user is never stuck on "Processing…".
    // SMTP typically finishes within 3-5s; the race just provides a safety net.
    console.log('[verify-payment] Starting email notifications...');
    console.log(`[verify-payment] SMTP_USER=${process.env.SMTP_USER ? 'SET' : 'NOT SET'}, ADMIN_EMAIL=${process.env.ADMIN_EMAIL || 'hello@frizlycrunch.com (default)'}`);

    const EMAIL_TIMEOUT_MS = 8000;
    const emailDeadline = new Promise<void>(resolve => setTimeout(resolve, EMAIL_TIMEOUT_MS));

    await Promise.race([
      Promise.allSettled([
        sendAdminOrderNotification(order).then(() => {
          console.log(`[verify-payment] ✅ Admin email sent for order ${orderId}`);
        }).catch(e => console.error(`[verify-payment] ❌ Admin email FAILED:`, e)),
        sendCustomerOrderConfirmation(order).then(() => {
          console.log(`[verify-payment] ✅ Customer email sent for order ${orderId} to ${shippingAddress?.email}`);
        }).catch(e => console.error(`[verify-payment] ❌ Customer email FAILED:`, e)),
        sendCustomerWhatsAppConfirmation(order).then(() => {
          console.log(`[verify-payment] ✅ WhatsApp sent for order ${orderId}`);
        }).catch(e => console.error(`[verify-payment] ❌ WhatsApp FAILED:`, e)),
      ]),
      emailDeadline.then(() => console.warn(`[verify-payment] ⏱ Email deadline (${EMAIL_TIMEOUT_MS}ms) reached — responding now`)),
    ]);

    console.log(`[verify-payment] Responding with success for order ${orderId}`);
    // Return full order data so client can persist it to Firestore
    return NextResponse.json({ success: true, orderId, order });

  } catch (error) {
    console.error('[verify-payment] Unhandled error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

