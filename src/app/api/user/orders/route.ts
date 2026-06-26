import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    const uid   = searchParams.get('uid');

    if (!phone && !email && !uid) {
      return NextResponse.json({ success: false, message: 'No identifier provided' }, { status: 400 });
    }

    const ordersFile = path.join(process.cwd(), 'orders.json');
    let orders = [];

    try {
      const fileData = await fs.readFile(ordersFile, 'utf-8');
      orders = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ success: true, orders: [] });
    }

    // Match by uid, phone, or email (any match)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userOrders = orders.filter((order: any) => {
      if (uid && order.userId === uid) return true;
      if (phone && order.shippingAddress?.phone) {
        const clean = (s: string) => s.replace(/[\s+\-()]/g, '');
        if (clean(order.shippingAddress.phone).endsWith(clean(phone))) return true;
      }
      if (email && order.shippingAddress?.email &&
          order.shippingAddress.email.toLowerCase() === email.toLowerCase()) return true;
      return false;
    });

    // Sort newest first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error) {
    console.error('User orders error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
