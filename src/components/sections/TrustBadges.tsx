import { ShieldCheck, Lock, Truck, RefreshCcw } from 'lucide-react';

export function TrustBadges() {
  return (
    <section className="bg-brand-cream-dk/30 py-6 border-y border-brand-cream-dk">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="flex items-center justify-center gap-3 text-brand-dark">
            <ShieldCheck className="w-6 h-6 text-brand-sage" />
            <span className="font-semibold text-sm">FSSAI Certified</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-brand-dark">
            <Lock className="w-6 h-6 text-brand-sage" />
            <span className="font-semibold text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-brand-dark">
            <Truck className="w-6 h-6 text-brand-sage" />
            <span className="font-semibold text-sm">Free Shipping &gt; ₹499</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-brand-dark">
            <RefreshCcw className="w-6 h-6 text-brand-sage" />
            <span className="font-semibold text-sm">Easy Returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}
