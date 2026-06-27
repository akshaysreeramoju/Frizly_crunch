'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, dispatch } = useCart();
  const { user, loading, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 120;
          if (window.scrollY >= top) current = section;
        }
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [mobileMenuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userMenuOpen]);

  const UserAvatar = () => {
    if (!user) return null;
    const initial = user.displayName?.[0] || user.email?.[0] || user.phoneNumber?.[1] || 'U';
    if (user.photoURL) {
      return (
        <Image
          src={user.photoURL} alt="Profile"
          width={32} height={32}
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return (
      <span className="font-bold text-sm text-white uppercase">{initial}</span>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-[#F7F1E8]/90 backdrop-blur-md shadow-[0_2px_24px_rgba(107,30,30,0.12)]' : 'py-5'
        }`}>
        <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 flex items-center justify-between gap-1 sm:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group min-w-0">
            <Image
              src="/images/logo.png"
              alt="Frizly Crunch Logo"
              width={48}
              height={48}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain shrink-0"
              priority
            />
            <div className="flex flex-col leading-tight min-w-0 truncate">
              <span className="font-display font-bold text-sm sm:text-[1.35rem] tracking-[0.02em] text-brand-dark group-hover:text-brand-burgundy transition-colors truncate">
                FRIZLY Crunch
              </span>
              <span className="font-body text-[0.55rem] sm:text-[0.6rem] font-bold tracking-[0.25em] text-brand-text-lt/80 uppercase mt-0.5 truncate">
                Real Food. Reinvented.
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.label}>
                  <Link href={link.href}
                    className={`relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${isActive ? 'text-brand-burgundy' : 'text-brand-text hover:text-brand-burgundy'
                      }`}>
                    {link.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-brand-gold rounded-full transition-all duration-300 ${isActive ? 'w-3/5' : 'w-0 hover:w-3/5'
                      }`} />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Cart */}
            <button
              onClick={() => dispatch({ type: 'OPEN_CART' })}
              className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center bg-brand-cream-dk rounded-full text-brand-burgundy hover:bg-brand-burgundy hover:text-white hover:scale-110 transition-all"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-brand-gold text-brand-dark text-[0.6rem] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Auth button */}
            {!loading && (
              user ? (
                /* Logged-in: avatar + dropdown */
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-brand-burgundy flex items-center justify-center hover:scale-110 transition-transform overflow-hidden"
                    aria-label="Account"
                  >
                    <UserAvatar />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-brand-cream-dk overflow-hidden z-10"
                      >
                        <div className="px-4 py-3 border-b border-brand-cream-dk">
                          <div className="text-sm font-bold text-brand-dark truncate">
                            {user.displayName || 'Welcome!'}
                          </div>
                          <div className="text-[0.7rem] text-brand-text-lt truncate">
                            {user.email || user.phoneNumber}
                          </div>
                        </div>
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text hover:bg-brand-cream transition-colors">
                          <User className="w-4 h-4 text-brand-burgundy" />
                          My Profile & Orders
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-brand-cream-dk">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Not logged in: login button */
                <button
                  onClick={openAuthModal}
                  id="navbar-login-btn"
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-burgundy border-2 border-brand-burgundy/30 rounded-full hover:bg-brand-burgundy hover:text-white hover:border-brand-burgundy transition-all"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )
            )}

            <button className="md:hidden p-2 text-brand-burgundy w-10 h-10 shrink-0 flex items-center justify-center" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
              <Menu className="w-6 h-6 shrink-0" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#F7F1E8]/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button className="absolute top-4 right-4 p-3 text-brand-burgundy hover:rotate-90 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>

            <ul className="flex flex-col items-center gap-6 mb-8">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-display font-semibold text-brand-dark hover:text-brand-burgundy transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile auth */}
            {user ? (
              <div className="flex flex-col items-center gap-3">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-burgundy text-white rounded-full font-semibold">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-sm text-red-500 font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-burgundy text-white rounded-full font-semibold">
                <User className="w-4 h-4" /> Login / Sign Up
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
