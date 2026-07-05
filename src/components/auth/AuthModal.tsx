'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z" />
    <path fill="#FF3D00" d="M6.3 14.7l7 5.1C15 16.2 19.1 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.1 29.5 4 24 4 16.2 4 9.4 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.3 0 10.2-1.9 13.9-5.1l-6.4-5.4C29.5 35.3 26.9 36 24 36c-5.2 0-9.6-3.4-11.2-8l-7 5.4C9.2 39.7 16 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.4 5.4C41.1 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z" />
  </svg>
);

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, authError, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Auto-close modal if user becomes logged in (e.g. after redirect returns)
  useEffect(() => {
    if (user && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [user, isAuthModalOpen, closeAuthModal]);

  const handleClose = () => {
    if (!isRedirecting) closeAuthModal();
  };

  const handleGoogleLogin = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // For popup: signInWithGoogle resolves after the user picks an account.
      // The useEffect above watching `user` will auto-close the modal once
      // onAuthStateChanged fires. No need to closeAuthModal() explicitly.
    } catch {
      // Error is handled inside signInWithGoogle (sets authError)
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-brand-dark/60 z-[3000] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-[3001] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[28px] w-full max-w-[420px] shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="relative bg-gradient-to-br from-brand-burgundy to-[#4a1010] px-4 sm:px-8 pt-8 pb-10 text-center">
                <button onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-2 mb-3">
                  <Image
                    src="/images/logo-gold.png"
                    alt="Frizly Crunch Gold Logo"
                    width={32}
                    height={28}
                    className="w-8 h-7 object-contain shrink-0"
                  />
                  <span className="font-display font-bold text-lg tracking-wide">
                    <span style={{color: '#5cb85c'}}>FRIZLY</span> <span style={{color: '#d4a96a'}}>CRUNCH</span>
                  </span>
                </div>

                <h2 className="text-white font-display text-2xl font-bold mb-1">Welcome Back</h2>
                <p className="text-white/60 text-sm">Sign in to track orders &amp; save your info</p>
              </div>

              {/* Body */}
              <div className="px-4 sm:px-8 py-8 flex flex-col gap-5">

                {authError && (
                  <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2 text-center">{authError}</p>
                )}

                {/* Google Button */}
                {isRedirecting ? (
                  <div className="w-full flex flex-col items-center justify-center gap-3 border-2 border-brand-burgundy/30 bg-brand-cream/50 rounded-2xl px-5 py-4 text-center">
                    <div className="w-5 h-5 border-2 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-brand-dark">Redirecting to Google…</p>
                    <p className="text-xs text-brand-text-lt">You will be brought back automatically after sign-in.</p>
                  </div>
                ) : (
                  <button
                    id="google-signin-btn"
                    onClick={handleGoogleLogin}
                    onTouchEnd={(e) => { e.preventDefault(); handleGoogleLogin(e); }}
                    disabled={isLoading}
                    style={{ cursor: 'pointer' }}
                    className="w-full flex items-center justify-center gap-3 border-2 border-brand-cream-dk rounded-2xl px-5 py-3.5 font-semibold text-brand-dark hover:border-brand-burgundy/40 hover:bg-brand-cream/50 disabled:opacity-60 transition-all"
                  >
                    <GoogleIcon />
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </button>
                )}

                <p className="text-center text-[0.7rem] text-brand-text-lt leading-relaxed">
                  By continuing, you agree to our Terms of Service.<br />
                  Your data is safe with us. 🔒
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
