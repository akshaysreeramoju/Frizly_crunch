import { NextResponse } from 'next/server';
import { sendCustomerOrderConfirmation } from '@/lib/mailer';

export async function GET() {
  try {
    const testOrder = {
      id: 'TEST-12345',
      items: [
        { product: { name: 'Freeze-Dried Mango', price: 150 }, qty: 2 }
      ],
      shippingAddress: {
        fullName: 'Test User',
        phone: '9876543210',
        address: '123 Test St',
        city: 'Test City',
        pincode: '500001',
        email: 'hello@frizlycrunch.com', // Sending to admin email to verify
      },
      total: 300,
      createdAt: new Date().toISOString(),
    };

    await sendCustomerOrderConfirmation(testOrder);

    return NextResponse.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
