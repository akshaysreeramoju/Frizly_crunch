import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from '@/lib/mailer';

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
    const { items, shippingAddress, paymentMethod, couponCode, discountAmount, discountPercent, userId } = body;

    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ success: false, message: 'Invalid order data' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { qty: number; product: { price: number } }) =>
        sum + item.qty * (item.product.price || 0),
      0
    );
    const total = subtotal - (discountAmount || 0);
    const orderId = generateOrderId();

    const order = {
      id: orderId,
      items,
      shippingAddress,
      paymentMethod,
      userId: userId || null,
      couponCode: couponCode || null,
      discountPercent: discountPercent || 0,
      discountAmount: discountAmount || 0,
      total,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };

    const ordersFile = path.join(process.cwd(), 'orders.json');
    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFile, 'utf-8');
      orders = JSON.parse(fileData);
    } catch {
      // File doesn't exist yet, it will be created
    }
    orders.push(order);
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));

    // Send email notifications
    await Promise.allSettled([
      sendAdminOrderNotification(order),
      sendCustomerOrderConfirmation(order),
    ]).catch((e) => console.error('Notification error:', e));

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
