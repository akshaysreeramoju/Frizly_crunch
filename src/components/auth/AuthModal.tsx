'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Step = 'choose' | 'phone' | 'otp';

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z" />
    <path fill="#FF3D00" d="M6.3 14.7l7 5.1C15 16.2 19.1 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.1 29.5 4 24 4 16.2 4 9.4 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.3 0 10.2-1.9 13.9-5.1l-6.4-5.4C29.5 35.3 26.9 36 24 36c-5.2 0-9.6-3.4-11.2-8l-7 5.4C9.2 39.7 16 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.4 5.4C41.1 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z" />
  </svg>
);

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, sendOTP, verifyOTP, authError, setAuthError } = useAuth();
  const [step, setStep] = useState<Step>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const resetModal = () => {
    setStep('choose');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setIsSending(false);
    setIsVerifying(false);
    setCountdown(0);
    setAuthError('');
  };

  const handleClose = () => {
    closeAuthModal();
    setTimeout(resetModal, 400);
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    resetModal();
  };

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '');
    const fullPhone = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
    if (!/^\+91[6-9]\d{9}$/.test(fullPhone)) {
      setAuthError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setIsSending(true);
    setAuthError('');
    try {
      await sendOTP(fullPhone, 'recaptcha-container');
      setStep('otp');
      setCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setAuthError('Enter all 6 digits.'); return; }
    setIsVerifying(true);
    setAuthError('');
    try {
      await verifyOTP(code);
      resetModal();
    } finally {
      setIsVerifying(false);
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
                  <svg viewBox="0 0 40 36" fill="none" className="w-8 h-7">
                    <path d="M20 2C17 8 8 10 4 16C2 19 3 23 6 25C9 27 13 26 15 23C16 21 16 18 18 16C19 15 20 15 20 15" fill="#D4AF37" />
                    <path d="M20 2C23 8 32 10 36 16C38 19 37 23 34 25C31 27 27 26 25 23C24 21 24 18 22 16C21 15 20 15 20 15" fill="#7A8F6A" />
                    <line x1="20" y1="15" x2="20" y2="36" stroke="#F7F1E8" strokeWidth="2" />
                  </svg>
                  <span className="text-brand-cream font-display font-bold text-lg tracking-wide">FRIZLY CRUNCH</span>
                </div>

                <h2 className="text-white font-display text-2xl font-bold mb-1">
                  {step === 'choose' ? 'Welcome Back' : step === 'phone' ? 'Enter Mobile' : 'Verify OTP'}
                </h2>
                <p className="text-white/60 text-sm">
                  {step === 'choose' ? 'Sign in to track orders & save your info'
                    : step === 'phone' ? 'We\'ll send a 6-digit OTP to your number'
                    : `OTP sent to +91 ${phone.slice(-10)}`}
                </p>
              </div>

              {/* Invisible reCAPTCHA container */}
              <div id="recaptcha-container" />

              {/* Body */}
              <div className="px-4 sm:px-8 py-7">
                <AnimatePresence mode="wait">

                  {/* ── Step: Choose ── */}
                  {step === 'choose' && (
                    <motion.div key="choose"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-4">

                      {/* Google Button */}
                      <button onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border-2 border-brand-cream-dk rounded-2xl px-5 py-3.5 font-semibold text-brand-dark hover:border-brand-burgundy/40 hover:bg-brand-cream/50 transition-all">
                        <GoogleIcon />
                        Continue with Google
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-brand-cream-dk" />
                        <span className="text-xs text-brand-text-lt font-medium">OR</span>
                        <div className="flex-1 h-px bg-brand-cream-dk" />
                      </div>

                      {/* Phone Button */}
                      <button onClick={() => setStep('phone')}
                        className="w-full flex items-center justify-center gap-3 bg-brand-burgundy text-white rounded-2xl px-5 py-3.5 font-semibold hover:bg-brand-burgundy-lt transition-colors">
                        <Phone className="w-5 h-5" />
                        Continue with Mobile OTP
                      </button>

                      <p className="text-center text-[0.7rem] text-brand-text-lt leading-relaxed">
                        By continuing, you agree to our Terms of Service.<br />
                        Your data is safe with us. 🔒
                      </p>
                    </motion.div>
                  )}

                  {/* ── Step: Phone ── */}
                  {step === 'phone' && (
                    <motion.div key="phone"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-5">
                      <div>
                        <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt mb-2 block">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center px-4 bg-brand-cream border-2 border-brand-cream-dk rounded-xl text-sm font-semibold text-brand-text">
                            🇮🇳 +91
                          </div>
                          <input
                            type="tel" inputMode="numeric"
                            value={phone} onChange={e => { setPhone(e.target.value); setAuthError(''); }}
                            onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                            placeholder="98765 43210"
                            maxLength={10}
                            className="flex-1 p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none text-brand-dark font-medium transition-colors"
                          />
                        </div>
                      </div>

                      {authError && (
                        <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">{authError}</p>
                      )}

                      <button onClick={handleSendOTP} disabled={isSending}
                        className="w-full flex items-center justify-center gap-2 bg-brand-burgundy text-white rounded-2xl px-5 py-3.5 font-semibold hover:bg-brand-burgundy-lt disabled:opacity-60 transition-colors">
                        {isSending ? 'Sending OTP...' : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                      </button>

                      <button onClick={() => { setStep('choose'); setAuthError(''); }}
                        className="text-sm text-brand-text-lt hover:text-brand-burgundy transition-colors text-center">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* ── Step: OTP ── */}
                  {step === 'otp' && (
                    <motion.div key="otp"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-5">

                      {/* 6-digit OTP boxes */}
                      <div>
                        <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt mb-3 block text-center">
                          Enter 6-digit OTP
                        </label>
                        <div className="flex gap-2 justify-center">
                          {otp.map((digit, i) => (
                            <input
                              key={i}
                              ref={el => { otpRefs.current[i] = el; }}
                              type="text" inputMode="numeric"
                              maxLength={1} value={digit}
                              onChange={e => handleOtpChange(i, e.target.value)}
                              onKeyDown={e => handleOtpKeyDown(i, e)}
                              className={`flex-1 max-w-[44px] text-center text-xl font-bold border-2 rounded-xl outline-none transition-all ${
                                digit ? 'border-brand-burgundy bg-brand-burgundy/5 text-brand-burgundy' : 'border-brand-cream-dk focus:border-brand-burgundy'
                              }`}
                              style={{ height: '52px' }}
                            />
                          ))}
                        </div>
                      </div>

                      {authError && (
                        <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2 text-center">{authError}</p>
                      )}

                      <button onClick={handleVerifyOTP} disabled={isVerifying || otp.join('').length !== 6}
                        className="w-full flex items-center justify-center gap-2 bg-brand-burgundy text-white rounded-2xl px-5 py-3.5 font-semibold hover:bg-brand-burgundy-lt disabled:opacity-60 transition-colors">
                        {isVerifying ? 'Verifying...' : <><CheckCircle2 className="w-4 h-4" /> Verify & Login</>}
                      </button>

                      {/* Resend */}
                      <div className="text-center text-sm text-brand-text-lt">
                        {countdown > 0 ? (
                          <span>Resend OTP in <strong className="text-brand-burgundy">{countdown}s</strong></span>
                        ) : (
                          <button onClick={() => { setOtp(['','','','','','']); handleSendOTP(); }}
                            className="flex items-center gap-1 mx-auto text-brand-burgundy hover:underline font-medium">
                            <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
                          </button>
                        )}
                      </div>

                      <button onClick={() => { setStep('phone'); setOtp(['','','','','','']); setAuthError(''); }}
                        className="text-sm text-brand-text-lt hover:text-brand-burgundy transition-colors text-center">
                        ← Change Number
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
