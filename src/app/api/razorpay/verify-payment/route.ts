import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
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

    // --- Persist to Supabase (server-side, using service-role key to bypass RLS) ---
    // We do this server-side so it always runs, regardless of client auth state.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY; // fallback to the secret key in .env.local

    if (supabaseUrl && supabaseServiceKey) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      });

      let customerId = null;

      // Upsert customer record
      if (userId) {
        const { data: custData, error: custErr } = await adminClient.from('customers').upsert(
          {
            firebase_uid: userId,
            full_name: shippingAddress?.fullName,
            email: shippingAddress?.email,
            phone: shippingAddress?.phone,
            saved_address: shippingAddress,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'firebase_uid' }
        ).select('id').single();
        if (custErr) {
          console.error('[verify-payment] ❌ Supabase customers upsert error:', custErr);
        } else if (custData) {
          customerId = custData.id;
          console.log(`[verify-payment] ✅ Supabase customer upserted for uid=${userId}`);
        }
      }

      // Insert order record
      const { error: orderErr } = await adminClient.from('orders').insert({
        id: orderId,
        tracking_id: trackingId,
        customer_id: customerId,
        firebase_uid: userId || 'guest',
        items,
        shipping_address: shippingAddress,
        total_amount: total,
        discount_amount: discountAmount || 0,
        shipping_cost: shippingCost || 0,
        payment_status: 'PAID',
        order_status: 'Processing',
        created_at: new Date().toISOString(),
      });
      if (orderErr) {
        console.error('[verify-payment] ❌ Supabase orders insert error:', orderErr);
      } else {
        console.log(`[verify-payment] ✅ Supabase order saved: ${orderId}`);
      }
    } else {
      console.error('[verify-payment] ⚠️ Supabase env vars missing — skipping DB write.');
    }

    // --- Send notifications then respond ---
    // Emails are raced against an 8-second deadline so the API always
    // responds promptly and the user is never stuck on "Processing…".
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
    // Return full order object so client-side can display the confirmation page
    return NextResponse.json({ success: true, orderId, order });

  } catch (error) {
    console.error('[verify-payment] Unhandled error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

