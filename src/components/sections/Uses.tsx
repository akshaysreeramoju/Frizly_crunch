'use client';

import { motion } from 'framer-motion';

const USES = [
  { icon: '🤌', title: 'Eat Directly', desc: 'Enjoy straight from the pack as a crunchy, satisfying healthy snack anytime, anywhere.' },
  { icon: '🥣', title: 'Add to Cereals', desc: 'Toss into your morning granola, oatmeal, or breakfast cereal for a nutritious fruity punch.' },
  { icon: '🥤', title: 'Blend into Smoothies', desc: 'Add to your smoothies and shakes for a concentrated burst of natural fruit flavour.' },
  { icon: '🍨', title: 'Top Desserts & Yogurt', desc: 'Use as a stunning, flavourful topping on ice cream, yogurt, and desserts.' },
  { icon: '✈️', title: 'On-the-Go Snacking', desc: 'Lightweight and shelf-stable. The perfect healthy travel companion for busy lives.' }
];

export function Uses() {
  return (
    <section className="py-24 px-8 bg-gradient-to-br from-brand-dark to-brand-dark-mid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="section-header light"
      >
        <span className="section-label">Versatile Snacking</span>
        <h2 className="section-title">More Ways to <em>Enjoy</em></h2>
      </motion.div>

      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {USES.map((use, i) => (
          <motion.div
            key={use.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-[#F7F1E8]/5 border border-brand-gold/15 rounded-[24px] p-8 text-center backdrop-blur-sm group hover:bg-[#F7F1E8]/10 hover:border-brand-gold/40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
          >
            <span className="text-[2.5rem] mb-4 block group-hover:scale-120 group-hover:rotate-6 transition-transform duration-300">
              {use.icon}
            </span>
            <h3 className="font-display text-[1.05rem] font-bold text-brand-gold mb-2.5">
              {use.title}
            </h3>
            <p className="text-[0.82rem] text-brand-cream/60 leading-[1.65]">
              {use.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
