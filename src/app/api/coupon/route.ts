import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || code.toUpperCase() !== 'CRUNCH20') {
      return NextResponse.json({ success: false, message: 'Invalid coupon code.' });
    }

    const ordersFile = path.join(process.cwd(), 'orders.json');
    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFile, 'utf-8');
      orders = JSON.parse(fileData);
    } catch {
      // File doesn't exist yet
    }

    const usageCount = orders.filter((o: any) => o.couponCode === 'CRUNCH20').length;
    
    if (usageCount >= 5) {
      return NextResponse.json({ success: false, message: 'Coupon code usage limit reached.' });
    }

    return NextResponse.json({ success: true, discountPercent: 20 });
  } catch (error) {
    console.error('Coupon error:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
