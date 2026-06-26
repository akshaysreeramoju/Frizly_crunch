import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Guard: keys not configured yet
    if (!keyId || keyId.includes('PASTE') || !keySecret || keySecret.includes('PASTE')) {
      console.error('[Razorpay] API keys are not configured in .env.local');
      return NextResponse.json(
        { success: false, message: 'Payment gateway not configured. Please add Razorpay API keys to .env.local' },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    // amount must be in paise (₹1 = 100 paise)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `fz_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    const err = error as { description?: string; message?: string; statusCode?: number };
    const detail = err?.description || err?.message || 'Unknown error';
    console.error('[Razorpay] create-order error:', detail);
    return NextResponse.json(
      { success: false, message: `Payment error: ${detail}` },
      { status: 500 }
    );
  }
}
