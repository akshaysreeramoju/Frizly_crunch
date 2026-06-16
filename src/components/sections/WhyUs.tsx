'use client';

import { motion } from 'framer-motion';

const REASONS = [
  {
    id: 'natural',
    title: '100% Natural',
    desc: 'Made from real, premium-quality fruits and vegetables. Absolutely nothing artificial — no colours, no flavours, no preservatives.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="#F7F1E8" stroke="#6B1E1E" strokeWidth="2"/>
        <path d="M24 12c-4 6-12 8-12 16a12 12 0 0024 0c0-8-8-10-12-16z" fill="#7A8F6A"/>
        <line x1="24" y1="28" x2="24" y2="38" stroke="#6B1E1E" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'fried',
    title: 'Non Fried',
    desc: 'Zero deep-frying. We use advanced freeze-drying technology that preserves the nutritional goodness of every bite.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="#F7F1E8" stroke="#6B1E1E" strokeWidth="2"/>
        <path d="M16 32V18h16v14" fill="none" stroke="#6B1E1E" strokeWidth="2"/>
        <line x1="12" y1="32" x2="36" y2="32" stroke="#6B1E1E" strokeWidth="2"/>
        <line x1="20" y1="22" x2="20" y2="28" stroke="#D4AF37" strokeWidth="2"/>
        <line x1="28" y1="22" x2="28" y2="28" stroke="#D4AF37" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'baked',
    title: 'Non Baked',
    desc: 'No baking required. The freeze-drying process locks in all the natural flavour, colour, and crunch at low temperatures.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="#F7F1E8" stroke="#6B1E1E" strokeWidth="2"/>
        <path d="M14 28h20v2a6 6 0 01-6 6h-8a6 6 0 01-6-6v-2z" fill="#D4AF37"/>
        <path d="M18 28V20a6 6 0 0112 0v8" stroke="#6B1E1E" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'crunch',
    title: 'Only Crunch',
    desc: 'That incredible, satisfying crunch in every bite — it\'s the hallmark of real freeze-dried food done right.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="#F7F1E8" stroke="#6B1E1E" strokeWidth="2"/>
        <path d="M16 24l4 4 8-8" stroke="#7A8F6A" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="8" stroke="#6B1E1E" strokeWidth="2" fill="none"/>
      </svg>
    )
  },
  {
    id: 'sugar',
    title: 'No Added Sugar',
    desc: 'Only the natural sugars present in the fruit itself. Perfect for health-conscious consumers and diabetics.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="#F7F1E8" stroke="#6B1E1E" strokeWidth="2"/>
        <text x="13" y="32" fontSize="18" fill="#6B1E1E" fontFamily="serif" fontWeight="bold">0g</text>
        <line x1="12" y1="14" x2="36" y2="36" stroke="#D4AF37" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'india',
    title: 'Made in India',
    desc: 'Proudly crafted in India. Supporting local agriculture, sourcing the finest seasonal produce from Indian farms.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="#F7F1E8" stroke="#6B1E1E" strokeWidth="2"/>
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z" fill="#FF9933" opacity=".4"/>
        <circle cx="24" cy="24" r="4" fill="#000080" opacity=".5"/>
      </svg>
    )
  }
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-24 px-8 bg-gradient-to-br from-[#FDF9F4] to-[#F2E8D5] relative overflow-hidden">
      {/* Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(107,30,30,0.06),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="section-header"
        >
          <span className="section-label">Why Frizly Crunch?</span>
          <h2 className="section-title">The <em>Clean Snack</em> Promise</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, index) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-[24px] p-8 text-center shadow-sm border border-brand-gold/10 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(107,30,30,0.20)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-burgundy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 w-[72px] h-[72px] mx-auto mb-5 group-hover:scale-110 group-hover:rotate-[5deg] transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="relative z-10 font-display text-[1.2rem] font-bold text-brand-burgundy mb-3">
                {reason.title}
              </h3>
              <p className="relative z-10 text-[0.88rem] text-brand-text-lt leading-[1.7]">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
