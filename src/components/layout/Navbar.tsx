'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Products', href: '/#products' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Our Process', href: '/#process' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { totalItems, dispatch } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Section highlighting logic
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = '';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 120;
          if (window.scrollY >= top) {
            current = section;
          }
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 bg-[#F7F1E8]/90 backdrop-blur-md shadow-[0_2px_24px_rgba(107,30,30,0.12)]' : 'py-5'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-9 drop-shadow-sm group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2C17 8 8 10 4 16C2 19 3 23 6 25C9 27 13 26 15 23C16 21 16 18 18 16C19 15 20 15 20 15" fill="#6B1E1E"/>
                <path d="M20 2C23 8 32 10 36 16C38 19 37 23 34 25C31 27 27 26 25 23C24 21 24 18 22 16C21 15 20 15 20 15" fill="#7A8F6A"/>
                <line x1="20" y1="15" x2="20" y2="36" stroke="#D4AF37" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-lg text-brand-burgundy tracking-wide">
                FRIZLY CRUNCH
              </span>
              <span className="font-body text-[0.6rem] font-medium tracking-[0.15em] text-brand-gold">
                — FREEZE-DRIED —
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      isActive ? 'text-brand-burgundy' : 'text-brand-text hover:text-brand-burgundy'
                    }`}
                  >
                    {link.label}
                    <span 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-brand-gold rounded-full transition-all duration-300 ${
                        isActive ? 'w-3/5' : 'w-0 hover:w-3/5'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: 'OPEN_CART' })}
              className="relative w-10 h-10 flex items-center justify-center bg-brand-cream-dk rounded-full text-brand-burgundy hover:bg-brand-burgundy hover:text-white hover:scale-110 transition-all"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-brand-gold text-brand-dark text-[0.6rem] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden p-2 text-brand-burgundy"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#F7F1E8]/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 right-8 p-2 text-brand-burgundy hover:rotate-90 transition-transform"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <ul className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-display font-semibold text-brand-dark hover:text-brand-burgundy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
