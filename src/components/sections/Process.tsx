'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    icon: '🌿',
    title: 'Fresh Produce',
    desc: 'We select only the ripest, most premium fruits and vegetables sourced directly from trusted Indian farms.'
  },
  {
    num: '02',
    icon: '❄️',
    title: 'Flash Frozen',
    desc: 'Produce is rapidly frozen at -40°C to lock in nutrients, colour, and flavour at their peak freshness.'
  },
  {
    num: '03',
    icon: '🔬',
    title: 'Moisture Removed Under Vacuum',
    desc: 'In a vacuum chamber, ice converts directly to vapour — removing 98% of moisture without heat damage.'
  },
  {
    num: '04',
    icon: '✨',
    title: 'Naturally Crunchy Snack',
    desc: 'The result? A light, airy, incredibly crunchy snack that retains 97% of its original nutrition.'
  }
];

export function Process() {
  return (
    <section id="process" className="py-24 px-8 bg-gradient-to-br from-brand-dark to-brand-dark-mid relative overflow-hidden">
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="section-header light"
        >
          <span className="section-label">Our Craft</span>
          <h2 className="section-title">The Freeze-Dry <em>Journey</em></h2>
          <p className="section-subtitle">
            From farm to pouch — every step is carefully engineered to preserve maximum nutrition and flavour.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-[900px] mx-auto mb-16">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="grid grid-cols-[40px_50px_1fr] md:grid-cols-[60px_60px_1fr] gap-3 md:gap-6 items-start pb-10 relative group"
            >
              {/* Connector line */}
              {index !== STEPS.length - 1 && (
                <div className="absolute left-[calc(40px+25px+0.375rem)] md:left-[calc(60px+28px+0.75rem)] top-[50px] md:top-[56px] bottom-0 w-[2px] bg-gradient-to-b from-brand-gold/30 to-brand-gold/5" />
              )}

              <div className="font-display text-[0.7rem] font-bold text-brand-gold tracking-[0.08em] pt-2 text-center">
                {step.num}
              </div>
              
              <div className="w-[50px] h-[50px] md:w-[56px] md:h-[56px] bg-brand-gold/10 border-2 border-brand-gold/30 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all duration-300 group-hover:bg-brand-gold/20 group-hover:border-brand-gold group-hover:shadow-[0_0_0_8px_rgba(212,175,55,0.1)]">
                {step.icon}
              </div>

              <div>
                <h3 className="font-display text-[1.1rem] md:text-[1.2rem] font-bold text-brand-cream mb-2 pt-2">
                  {step.title}
                </h3>
                <p className="text-[0.88rem] text-brand-cream/65 leading-[1.7]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nutrition Callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-[900px] mx-auto bg-brand-gold/5 border border-brand-gold/25 rounded-[24px] p-8 flex flex-col md:flex-row justify-around items-center gap-6"
        >
          <Stat value="97" suffix="%" label="Nutrients Retained" />
          <div className="w-16 h-[1px] md:w-[1px] md:h-16 bg-brand-gold/20" />
          <Stat value="98" suffix="%" label="Moisture Removed" />
          <div className="w-16 h-[1px] md:w-[1px] md:h-16 bg-brand-gold/20" />
          <Stat value="12" suffix="mo" label="Shelf Life" />
          <div className="w-16 h-[1px] md:w-[1px] md:h-16 bg-brand-gold/20" />
          <Stat value="10" suffix="x" label="Weight of Fresh Fruit" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, suffix, label }: { value: string, suffix: string, label: string }) {
  // In a real app we could use framer-motion useMotionValue + useTransform for number animation
  // For simplicity, we just render it directly here since Framer Motion handles the entrance well
  return (
    <div className="text-center flex flex-col gap-1">
      <span className="font-display text-4xl font-black text-brand-gold leading-none">
        {value}{suffix}
      </span>
      <span className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-brand-cream/60">
        {label}
      </span>
    </div>
  );
}
