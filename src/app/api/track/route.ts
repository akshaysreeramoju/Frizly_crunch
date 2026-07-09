import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get('trackingId');

  if (!trackingId) {
    return NextResponse.json({ success: false, message: 'Tracking ID is required' }, { status: 400 });
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tracking_id', trackingId.toUpperCase())
      .single();

    if (error || !order) {
      return NextResponse.json({ success: false, message: 'Order not found for this Tracking ID' }, { status: 404 });
    }

    // Map Supabase fields back to camelCase as expected by the frontend
    const mappedOrder = {
      id: order.id,
      trackingId: order.tracking_id,
      createdAt: order.created_at,
      status: order.order_status,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_status,
      items: order.items,
      total: order.total_amount,
    };

    return NextResponse.json({ success: true, order: mappedOrder });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, message: 'Tracking error' }, { status: 500 });
  }
}
