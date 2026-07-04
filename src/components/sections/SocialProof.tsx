'use client';

import { motion } from 'framer-motion';

export function SocialProof() {
  return (
    <section className="py-20 bg-brand-burgundy text-brand-cream">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center max-w-4xl mx-auto">
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="font-display text-4xl md:text-5xl font-bold mb-2">10,000+</div>
            <div className="text-sm tracking-widest uppercase opacity-80 font-semibold">Happy Customers</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="font-display text-4xl md:text-5xl font-bold mb-2">50,000+</div>
            <div className="text-sm tracking-widest uppercase opacity-80 font-semibold">Packs Delivered</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-brand-gold">100%</div>
            <div className="text-sm tracking-widest uppercase opacity-80 font-semibold">Natural Always</div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
