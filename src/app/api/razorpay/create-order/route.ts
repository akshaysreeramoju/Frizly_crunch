import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

function getRequestHostname(req: Request) {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (origin) {
    try {
      return new URL(origin).hostname.toLowerCase();
    } catch {
      // fall through
    }
  }

  const host = req.headers.get('host') || '';
  return host.split(':')[0].toLowerCase();
}

function isLocalTestingHost(hostname: string) {
  if (!hostname) return true;

  const normalized = hostname.toLowerCase();
  return [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
  ].includes(normalized) || normalized.endsWith('.local') || normalized.endsWith('.vercel.app') || normalized.includes('ngrok') || normalized.includes('localhost');
}

export async function POST(req: Request) {
  try {
    const hostname = getRequestHostname(req);
    const useTestMode = isLocalTestingHost(hostname);

    const keyId = useTestMode
      ? process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID
      : process.env.RAZORPAY_KEY_ID;
    const keySecret = useTestMode
      ? process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET
      : process.env.RAZORPAY_KEY_SECRET;
    const publicKeyId = useTestMode
      ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    // Guard: keys not configured yet
    if (!keyId || keyId.includes('PASTE') || !keySecret || keySecret.includes('PASTE')) {
      console.error('[Razorpay] API keys are not configured in .env.local');
      return NextResponse.json(
        {
          success: false,
          message: useTestMode
            ? 'Razorpay test keys are not configured. Add RAZORPAY_TEST_KEY_ID, RAZORPAY_TEST_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID to .env.local for local testing.'
            : 'Payment gateway not configured. Please add Razorpay API keys to .env.local',
        },
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
      keyId: publicKeyId,
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
