import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
  }

  try {
    const ordersFile = path.join(process.cwd(), 'orders.json');
    const fileData = await fs.readFile(ordersFile, 'utf-8');
    const orders = JSON.parse(fileData);

    const order = orders.find((o: any) => o.id === orderId.toUpperCase());

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // For demo purposes, if order is more than 2 minutes old, change status to SHIPPED
    // If more than 4 mins old, DELIVERED.
    const createdDate = new Date(order.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    
    if (diffMs > 2 * 60 * 1000 && diffMs <= 4 * 60 * 1000) {
      order.status = 'SHIPPED';
    } else if (diffMs > 4 * 60 * 1000) {
      order.status = 'DELIVERED';
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  }
}
