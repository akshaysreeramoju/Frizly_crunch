'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

const HERO_IMAGES = [
  '/images/products/strawberry.jpg',
  '/images/products/mango.jpg',
  '/images/products/pineapple.jpg',
  '/images/products/guava.jpg',
  '/images/products/carrot.jpg',
];

const BADGES = [
  ['🍓 Strawberry', '🥭 Mango', '🍍 Pineapple'],
  ['🥭 Mango', '🍌 Banana', '🎯 Natural'],
  ['🍍 Pineapple', '💚 Healthy', '✨ Pure'],
  ['🫐 Pink Guava', '🌿 Natural', '🔥 Tasty'],
  ['🥕 Carrot', '❄️ Freeze-Dried', '💛 Crispy'],
];

export function Hero() {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-[#FDF6EE] via-[#F2E8D5] to-[#E8D5BE] overflow-hidden pt-32 pb-16 px-8 flex items-center">
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-brand-burgundy/5 border border-brand-burgundy/15 text-brand-burgundy text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
            100% Natural · No Additives · Made in India
          </div>

          <h1 className="text-clamp-title font-black leading-[1.05] mb-5 text-brand-dark">
            <span className="block">Real Food.</span>
            <span className="block text-brand-burgundy italic font-display">Reinvented.</span>
          </h1>

          <p className="text-lg text-brand-text-lt leading-[1.8] mb-8 max-w-[440px] mx-auto lg:mx-0">
            Premium freeze-dried fruits & vegetables — bursting with flavour, nutrition, and that satisfying <em className="text-brand-burgundy not-italic font-medium">crunch</em>. 100% natural, pure goodness preserved.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
            <Link href="#products">
              <Button>Explore Products</Button>
            </Link>
            <Link href="#process">
              <Button variant="outline">How We Do It</Button>
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6">
            <div className="flex flex-col">
              <span className="font-display text-3xl font-bold text-brand-burgundy leading-none">50g</span>
              <span className="text-[0.7rem] font-medium text-brand-text-lt tracking-wide uppercase mt-1">Net Weight</span>
            </div>
            <div className="w-[1px] h-10 bg-brand-cream-dk" />
            <div className="flex flex-col">
              <span className="font-display text-3xl font-bold text-brand-burgundy leading-none">0g</span>
              <span className="text-[0.7rem] font-medium text-brand-text-lt tracking-wide uppercase mt-1">Added Sugar</span>
            </div>
            <div className="w-[1px] h-10 bg-brand-cream-dk" />
            <div className="flex flex-col">
              <span className="font-display text-3xl font-bold text-brand-burgundy leading-none">100%</span>
              <span className="text-[0.7rem] font-medium text-brand-text-lt tracking-wide uppercase mt-1">Real Fruit</span>
            </div>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative z-10 flex items-center justify-center h-[400px]"
        >
          <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">

            {/* Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-gold/25 animate-rotate" />
            <div className="absolute inset-[12.5%] rounded-full border-2 border-dashed border-brand-burgundy/15 animate-rotate-reverse" />

            {/* Floating Image */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full overflow-hidden bg-white shadow-[0_0_40px_rgba(212,175,55,0.25),0_20px_60px_rgba(107,30,30,0.25)]"
            >
              <Image
                src={HERO_IMAGES[imgIdx]}
                alt="Frizly Crunch Hero"
                fill
                className="object-cover transition-all duration-500 ease-in-out"
                sizes="(max-width: 640px) 200px, 260px"
                priority
              />
            </motion.div>

            {/* Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-[10%] left-0 bg-[#F7F1E8]/90 backdrop-blur-md border border-brand-gold/30 px-4 py-2 rounded-full text-sm font-semibold text-brand-text shadow-sm whitespace-nowrap"
            >
              {BADGES[imgIdx][0]}
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[15%] -left-[5%] bg-[#F7F1E8]/90 backdrop-blur-md border border-brand-gold/30 px-4 py-2 rounded-full text-sm font-semibold text-brand-text shadow-sm whitespace-nowrap"
            >
              {BADGES[imgIdx][1]}
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute top-[20%] -right-[5%] bg-[#F7F1E8]/90 backdrop-blur-md border border-brand-gold/30 px-4 py-2 rounded-full text-sm font-semibold text-brand-text shadow-sm whitespace-nowrap"
            >
              {BADGES[imgIdx][2]}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 hidden lg:flex"
      >
        <span className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-brand-text-lt">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-brand-text-lt" />
        </motion.div>
      </motion.div>
    </section>
  );
}
