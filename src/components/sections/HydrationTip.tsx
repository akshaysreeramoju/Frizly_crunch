'use client';

import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export function HydrationTip() {
  return (
    <section className="bg-[#EAF6FA] py-12 border-y border-[#BCE1EE]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-16 h-16 bg-[#D6EAF8] rounded-full flex items-center justify-center mb-4 text-[#3498DB]"
        >
          <Droplets className="w-8 h-8 fill-current" />
        </motion.div>
        
        <h3 className="font-display text-2xl font-bold text-[#2C3E50] mb-3">
          Freeze-dried fruits keep the crunch, while water keeps you refreshed. Don't forget both! 💧
        </h3>
        <p className="text-[#34495E] font-medium max-w-2xl text-sm md:text-base">
          Freeze-dried fruits are low in moisture, so make water part of your snacking routine for the best experience.
        </p>
      </div>
    </section>
  );
}
