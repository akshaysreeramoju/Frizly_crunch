'use client';

import { motion } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';

const REVIEWS = [
  { name: "Priya S.", city: "Mumbai", text: "Absolutely love the crunch! Best healthy snack I've had.", rating: 5 },
  { name: "Rahul K.", city: "Delhi", text: "Perfect for my kids' lunchboxes. No added sugar is a huge plus.", rating: 5 },
  { name: "Anita M.", city: "Bangalore", text: "Tastes exactly like the real fruit but with an amazing texture.", rating: 5 },
  { name: "Vikram R.", city: "Chennai", text: "The mango freeze dried is incredible. Tastes fresh out of the farm.", rating: 5 },
];

export function ReviewsCarousel() {
  return (
    <section className="py-24 bg-brand-cream overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-12 text-center">
        <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-brand-gold mb-3 block">Testimonials</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-dark mb-4">Loved Across India</h2>
      </div>

      <div className="flex gap-6 px-4 md:px-8 pb-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
        {REVIEWS.map((rev, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-3xl shadow-sm border border-brand-cream-dk snap-center"
          >
            <div className="flex text-brand-gold mb-4">
              {[...Array(rev.rating)].map((_, j) => (
                <Star key={j} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-brand-text font-medium italic mb-6 leading-relaxed">"{rev.text}"</p>
            <div className="flex items-center justify-between border-t border-brand-cream-dk pt-4">
              <div>
                <span className="font-bold text-sm text-brand-dark block">{rev.name}</span>
                <span className="text-xs text-brand-text-lt">{rev.city}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-[0.65rem] font-bold">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
