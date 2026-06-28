import { Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function GiftBanner() {
  return (
    <section className="bg-brand-gold/10 py-20 border-y border-brand-gold/20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mb-6 text-brand-gold">
          <Gift className="w-8 h-8" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4 max-w-2xl">
          The perfect healthy gift for every occasion — Birthdays, Diwali, Corporate Gifting
        </h2>
        <p className="text-brand-text-lt mb-10 max-w-xl">
          Give the gift of pure, natural health. Our premium freeze-dried fruit and vegetable boxes are beautifully packaged and guarantee a smile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold-lt">
            Build a Gift Box
          </Button>
          <Button size="lg" variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">
            Contact for Bulk Orders <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
