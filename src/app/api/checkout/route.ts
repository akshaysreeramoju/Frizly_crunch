import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    const { items, shippingAddress, paymentMethod } = body;

    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ success: false, message: 'Invalid order data' }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: any) => sum + (item.qty * (item.product.price || 0)), 0);
    const orderId = generateOrderId();

    const order = {
      id: orderId,
      items,
      shippingAddress,
      paymentMethod,
      total,
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
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

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
