'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Using Suspense boundary for useSearchParams in Next.js 15 App Router
export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-16 bg-brand-cream text-center">Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('id');

  const [orderIdInput, setOrderIdInput] = useState(urlOrderId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (urlOrderId) {
      handleTrack(urlOrderId);
    }
  }, [urlOrderId]);

  const handleTrack = async (idToTrack: string) => {
    if (!idToTrack.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/track?orderId=${encodeURIComponent(idToTrack)}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Order not found. Please check your ID.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: string) => {
    if (!order) return 'pending';
    const statusMap = {
      'PROCESSING': 0,
      'SHIPPED': 1,
      'DELIVERED': 2
    };
    const currentStatusLevel = statusMap[order.status as keyof typeof statusMap] || 0;
    const stepLevel = statusMap[step as keyof typeof statusMap] || 0;

    if (currentStatusLevel > stepLevel) return 'completed';
    if (currentStatusLevel === stepLevel) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-8 flex flex-col items-center">
      <div className="max-w-[800px] w-full">
        
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-brand-dark mb-4">Track Your Order</h1>
          <p className="text-brand-text-lt">Enter your Order ID (e.g. FZ-A1B2C3) to see the current status.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-cream-dk flex gap-3 mb-10 max-w-[500px] mx-auto">
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Order ID"
            className="flex-1 bg-transparent px-4 py-2 outline-none text-lg font-bold text-brand-dark uppercase placeholder:normal-case placeholder:font-normal"
            onKeyDown={(e) => e.key === 'Enter' && handleTrack(orderIdInput)}
          />
          <Button onClick={() => handleTrack(orderIdInput)} disabled={loading}>
            {loading ? 'Searching...' : <><Search className="w-4 h-4 mr-1" /> Track</>}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium mb-10 border border-red-100">
            {error}
          </div>
        )}

        {/* Tracking Timeline */}
        {order && (
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-brand-cream-dk">
            
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-brand-cream-dk pb-6 mb-10">
              <div>
                <div className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-brand-text-lt mb-1">
                  Order ID
                </div>
                <div className="font-display text-3xl font-bold text-brand-burgundy">
                  {order.id}
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-brand-text-lt mb-1">
                  Placed On
                </div>
                <div className="font-bold text-brand-dark">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'
                  })}
                </div>
              </div>
            </div>

            <div className="relative mb-12">
              {/* Progress Line */}
              <div className="absolute top-8 left-8 right-8 h-1 bg-brand-cream-dk hidden md:block rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-brand-gold transition-all duration-1000"
                   style={{ width: order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '50%' : '0%' }}
                 />
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
                
                {/* Step 1 */}
                <Step 
                  icon={Clock} 
                  title="Processing" 
                  desc="We are preparing your snacks."
                  status={getStepStatus('PROCESSING')} 
                />
                
                {/* Step 2 */}
                <Step 
                  icon={Truck} 
                  title="Shipped" 
                  desc="Your order is on the way."
                  status={getStepStatus('SHIPPED')} 
                />
                
                {/* Step 3 */}
                <Step 
                  icon={CheckCircle2} 
                  title="Delivered" 
                  desc="Package arrived successfully."
                  status={getStepStatus('DELIVERED')} 
                />

              </div>
            </div>

            <div className="bg-[#F7F1E8]/50 rounded-2xl p-6 border border-brand-gold/20">
              <h4 className="font-display font-bold text-brand-dark mb-4 border-b border-brand-gold/20 pb-3">Shipping Details</h4>
              <p className="text-brand-text font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-brand-text-lt text-sm mt-1">{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
              <p className="text-brand-text-lt text-sm mt-1">Phone: {order.shippingAddress.phone}</p>
              <p className="text-brand-text-lt text-sm mt-1">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
            </div>
            
            <p className="text-center text-xs text-brand-text-lt mt-6 italic">
              Note: For this demo, orders automatically shift to 'SHIPPED' after 2 minutes, and 'DELIVERED' after 4 minutes.
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, desc, status }: { icon: any, title: string, desc: string, status: 'pending' | 'active' | 'completed' }) {
  const getStyles = () => {
    switch (status) {
      case 'completed': return 'bg-brand-gold text-white border-brand-gold';
      case 'active': return 'bg-white text-brand-burgundy border-brand-burgundy shadow-[0_0_0_4px_rgba(107,30,30,0.1)]';
      case 'pending': return 'bg-white text-brand-cream-dk border-brand-cream-dk';
    }
  };

  return (
    <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/3">
      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${getStyles()}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-left md:text-center">
        <div className={`font-bold text-lg ${status === 'pending' ? 'text-brand-text-lt/50' : 'text-brand-dark'}`}>
          {title}
        </div>
        <div className={`text-[0.8rem] ${status === 'pending' ? 'text-brand-text-lt/40' : 'text-brand-text-lt'}`}>
          {desc}
        </div>
      </div>
    </div>
  );
}
