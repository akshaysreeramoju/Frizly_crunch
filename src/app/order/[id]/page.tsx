'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, dynamic route params should be awaited if we use them synchronously, 
  // but we can use React.use() to unwrap the Promise
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
      <div className="bg-white rounded-[32px] p-10 md:p-16 max-w-[600px] w-full shadow-sm">
        
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="font-display text-4xl font-bold text-brand-dark mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-brand-text-lt leading-[1.8] mb-8">
          Thank you for choosing Frizly Crunch! Your delicious, healthy snacks are being prepared. You will receive an email confirmation shortly.
        </p>

        <div className="bg-brand-cream-dk/50 rounded-2xl p-6 mb-10 border border-brand-cream-dk border-dashed">
          <p className="text-[0.8rem] font-bold tracking-[0.1em] uppercase text-brand-text-lt mb-1">
            Order ID
          </p>
          <p className="font-display text-2xl font-bold text-brand-burgundy tracking-wider">
            {orderId}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/track?id=${orderId}`} className="w-full sm:w-auto">
            <Button fullWidth className="bg-brand-dark text-white hover:bg-black">
              <Package className="w-4 h-4 mr-1" />
              Track Order
            </Button>
          </Link>
          <Link href="/#products" className="w-full sm:w-auto">
            <Button variant="outline" fullWidth>
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
