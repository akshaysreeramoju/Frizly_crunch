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
      total,
    } = body;

    // --- Verify Razorpay signature ---
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    // --- Create internal order record ---
    const orderId = generateOrderId();
    const order = {
      id: orderId,
      items,
      shippingAddress,
      paymentMethod: 'razorpay',
      razorpayOrderId,
      razorpayPaymentId,
      userId: userId || null,
      discountPercent: discountPercent || 0,
      discountAmount: discountAmount || 0,
      total,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };

    // Save to orders.json
    const ordersFile = path.join(process.cwd(), 'orders.json');
    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFile, 'utf-8');
      orders = JSON.parse(fileData);
    } catch {
      // File doesn't exist yet
    }
    orders.push(order);
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));

    // --- Send notifications ---
    await Promise.allSettled([
      sendAdminOrderNotification(order),
      sendCustomerOrderConfirmation(order),
      sendCustomerWhatsAppConfirmation(order),
    ]).catch((e) => console.error('Notification error:', e));

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
