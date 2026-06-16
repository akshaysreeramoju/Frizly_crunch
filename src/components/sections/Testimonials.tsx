'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    text: "The strawberry is absolutely incredible! Tastes exactly like fresh strawberries but in a crunchy, guilt-free form. My kids go crazy for it!",
    name: "Priya Sharma",
    location: "Mumbai",
    avatarColor: "#FFB6C1",
    initial: "P"
  },
  {
    id: 2,
    text: "As a fitness enthusiast, I'm always looking for clean snacks. Frizly Crunch mango is my go-to pre-workout snack — pure, natural, and energising!",
    name: "Rahul Verma",
    location: "Delhi",
    avatarColor: "#FFD700",
    initial: "R"
  },
  {
    id: 3,
    text: "The beetroot is my daughter's new obsession! She used to hate vegetables, but now she begs for these every day. Thank you Frizly Crunch!",
    name: "Anjali Mehta",
    location: "Bangalore",
    avatarColor: "#DDA0DD",
    initial: "A"
  },
  {
    id: 4,
    text: "I travel a lot and these are the perfect on-the-go snacks. Lightweight, nutritious, and so delicious. The amla is surprisingly addictive!",
    name: "Sandeep Nair",
    location: "Chennai",
    avatarColor: "#90EE90",
    initial: "S"
  }
];

export function Testimonials() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  const handlePrev = () => setCurrentIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="py-24 px-8 max-w-[1280px] mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="section-header"
      >
        <span className="section-label">Customer Love</span>
        <h2 className="section-title">What People Are <em>Saying</em></h2>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden px-4">
          <motion.div 
            className="flex gap-6"
            animate={{ 
              x: `calc(-${currentIdx * 100}% - ${currentIdx * 1.5}rem)`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${TESTIMONIALS.length * 100}%` }}
          >
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="w-full sm:w-[calc(50%-0.75rem)] shrink-0 bg-white rounded-[24px] p-8 shadow-sm border border-brand-cream-dk hover:shadow-md hover:border-brand-gold/30 transition-all duration-300"
              >
                <div className="text-brand-gold text-lg tracking-[0.1em] mb-4">★★★★★</div>
                <p className="text-[0.95rem] text-brand-text leading-[1.8] italic mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center font-display text-[1.1rem] font-bold text-brand-dark shrink-0"
                    style={{ backgroundColor: t.avatarColor }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold text-[0.9rem] text-brand-dark">{t.name}</div>
                    <div className="text-[0.75rem] text-brand-text-lt">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-brand-cream-dk text-brand-burgundy flex items-center justify-center hover:bg-brand-burgundy hover:text-white hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIdx ? 'bg-brand-burgundy scale-125' : 'bg-brand-cream-dk hover:bg-brand-burgundy/50'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-brand-cream-dk text-brand-burgundy flex items-center justify-center hover:bg-brand-burgundy hover:text-white hover:scale-110 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
