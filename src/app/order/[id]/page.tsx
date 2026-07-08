'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          setOrder(orderDoc.data());
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-8 flex items-center justify-center text-brand-text-lt">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Order Not Found</h1>
        <p className="text-brand-text-lt mb-8">We couldn't find an order with this ID.</p>
        <Link href="/#products"><Button>Return to Shop</Button></Link>
      </div>
    );
  }

  const date = order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Recent';

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white rounded-[32px] p-6 md:p-12 shadow-sm">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-3">Order Confirmed!</h1>
          <p className="text-brand-text-lt text-sm md:text-base">Thank you for your purchase. We've received your order.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-brand-cream p-5 rounded-2xl border border-brand-cream-dk">
            <p className="text-xs font-bold tracking-wider uppercase text-brand-text-lt mb-1">Order ID</p>
            <p className="font-display text-xl font-bold text-brand-burgundy mb-4">{orderId}</p>
            
            <p className="text-xs font-bold tracking-wider uppercase text-brand-text-lt mb-1">Date & Time</p>
            <p className="text-brand-dark font-medium text-sm">{date}</p>
          </div>
          <div className="bg-brand-cream p-5 rounded-2xl border border-brand-cream-dk">
            <p className="text-xs font-bold tracking-wider uppercase text-brand-text-lt mb-1">Status</p>
            <div className="flex items-center gap-2 mb-4">
               <span className="px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-bold tracking-wider uppercase">
                {order.status === 'PAID' ? 'PROCESSING' : order.status}
              </span>
            </div>
            
            <p className="text-xs font-bold tracking-wider uppercase text-brand-text-lt mb-1">Payment</p>
            <div className="flex items-center gap-2 text-brand-dark font-medium text-sm">
              <CreditCard className="w-4 h-4 text-green-600" />
              Paid via {order.paymentMethod === 'razorpay' ? 'Razorpay' : order.paymentMethod}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-brand-dark mb-4 border-b border-brand-cream-dk pb-2">Items Ordered</h3>
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-cream border border-brand-cream-dk shrink-0">
                  <Image src={item.product.img} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-dark">{item.product.name}</p>
                  <p className="text-sm text-brand-text-lt">Qty: {item.qty} × ₹{item.product.price}</p>
                </div>
                <div className="font-bold text-brand-dark">
                  ₹{item.product.price * item.qty}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border border-brand-cream-dk mb-8">
          <div className="flex justify-between items-center text-sm text-brand-text-lt mb-2">
            <span>Subtotal</span>
            <span>₹{order.total - (order.shippingCost || 0) + (order.discountAmount || 0)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm text-brand-sage font-medium mb-2">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span>-₹{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm text-brand-text-lt mb-4">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-brand-burgundy border-t border-brand-cream-dk pt-3">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-display text-lg font-bold text-brand-dark mb-4 border-b border-brand-cream-dk pb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-burgundy" /> Delivery Address
          </h3>
          <div className="text-sm text-brand-dark leading-relaxed bg-brand-cream/30 p-4 rounded-xl border border-brand-cream-dk">
            <p className="font-bold mb-1">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
            <p className="mt-2 text-brand-text-lt">📞 {order.shippingAddress?.phone}</p>
            {order.shippingAddress?.email && <p className="text-brand-text-lt">✉️ {order.shippingAddress?.email}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/track?id=${orderId}`} className="w-full sm:w-auto">
            <Button fullWidth className="bg-brand-dark text-white hover:bg-black">
              <Package className="w-4 h-4 mr-2" /> Track Order
            </Button>
          </Link>
          <Link href="/account/orders" className="w-full sm:w-auto">
            <Button variant="outline" fullWidth>
              View All Orders
            </Button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
