'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  /** Open the auth modal */
  openAuthModal: () => void;
  /** Close the auth modal */
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  /** Sign in with Google */
  signInWithGoogle: () => Promise<void>;
  /** Send OTP to phone number (e.g. "+919876543210") */
  sendOTP: (phone: string, recaptchaContainerId: string) => Promise<void>;
  /** Verify the OTP code */
  verifyOTP: (code: string) => Promise<void>;
  /** Update display name */
  updateDisplayName: (name: string) => Promise<void>;
  /** Sign out */
  logout: () => Promise<void>;
  /** Any auth error message */
  authError: string;
  setAuthError: (e: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

let confirmationResult: ConfirmationResult | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  // ── Step 1: Set persistence immediately at startup ─────────────────────────
  // Must be done before any sign-in attempt, including processing redirect results.
  // We do this once, at mount, so it's active even when the page loads after a redirect.
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }, []);

  // ── Step 2: Process the Google redirect result FIRST, then listen to auth state ─
  // getRedirectResult() MUST be awaited before onAuthStateChanged resolves loading=false.
  // If loading turns false first, components that require login may redirect the user
  // away before the auth result is processed — causing the visible redirect loop.
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('[Auth] Redirect sign-in succeeded:', result.user.email);
          closeAuthModal();
        } else {
          console.log('[Auth] No redirect result (normal page load or popup flow).');
        }
      })
      .catch((err: unknown) => {
        console.error('[Auth] getRedirectResult error:', err);
        const error = err as { code?: string; message?: string };
        // Show the exact Firebase error code on-screen so we can diagnose
        // silent failures (e.g. auth/unauthorized-domain) on mobile
        const msg = error.code
          ? `Sign-in error: ${error.code}`
          : error.message
          ? `Sign-in error: ${error.message}`
          : 'Google sign-in failed. Please try again.';
        setAuthError(msg);
        setIsAuthModalOpen(true);
      })
      .finally(() => {
        // After redirect result is resolved (either way), start listening to auth state.
        // This is the ONLY place setLoading(false) is triggered, preventing a flash
        // of the logged-out state before the redirect result is processed.
        unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              phoneNumber: firebaseUser.phoneNumber,
              photoURL: firebaseUser.photoURL,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAuthModal = () => { setAuthError(''); setIsAuthModalOpen(true); };
  const closeAuthModal = () => { setIsAuthModalOpen(false); setAuthError(''); };

  const signInWithGoogle = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // On mobile, popups are blocked or fail silently in Safari and in-app browsers.
      // Go straight to redirect — getRedirectResult() above will handle the result.
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
      );

      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }

      // Desktop: try popup first, fall back to redirect if blocked.
      try {
        await signInWithPopup(auth, provider);
      } catch (popupErr: unknown) {
        const err = popupErr as { code?: string };
        if (err.code === 'auth/popup-blocked') {
          console.warn('[Auth] Popup blocked, falling back to redirect...');
          await signInWithRedirect(auth, provider);
        } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          return; // User dismissed — not an error
        } else {
          throw popupErr;
        }
      }
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      const e = err as { code?: string };
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setAuthError('Google sign-in failed. Please try again.');
      }
    }
  };

  const sendOTP = async (phone: string, recaptchaContainerId: string) => {
    setAuthError('');
    try {
      // Clear existing verifier if any to prevent "already initialized" errors
      const win = window as any;
      if (win.recaptchaVerifier) {
        try {
          win.recaptchaVerifier.clear();
        } catch (e) {
          console.error('Error clearing recaptcha verifier:', e);
        }
      }

      // Create invisible reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: 'invisible',
        callback: () => {},
      });
      
      win.recaptchaVerifier = recaptchaVerifier;
      confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error('OTP error:', error);
      
      let errMsg = 'Failed to send OTP. ';
      if (error.code) {
        if (error.code === 'auth/operation-not-allowed') {
          errMsg += 'Phone sign-in is not enabled in the Firebase Console.';
        } else if (error.code === 'auth/billing-not-enabled') {
          errMsg += 'Firebase project must be on the Blaze plan for Phone Auth, or the SMS region is not enabled in Firebase settings.';
        } else if (error.code === 'auth/invalid-phone-number') {
          errMsg += 'Invalid phone number format.';
        } else if (error.code === 'auth/too-many-requests') {
          errMsg += 'Too many requests. Please try again later.';
        } else if (error.code === 'auth/unauthorized-domain') {
          errMsg += 'This domain is not authorized in the Firebase Console.';
        } else {
          errMsg += `(${error.code})`;
        }
      } else if (error.message) {
        errMsg += error.message;
      } else {
        errMsg += 'Check the number and try again.';
      }
      
      setAuthError(errMsg);
      throw error;
    }
  };

  const verifyOTP = async (code: string) => {
    setAuthError('');
    if (!confirmationResult) {
      setAuthError('Session expired. Please request OTP again.');
      return;
    }
    try {
      await confirmationResult.confirm(code);
      closeAuthModal();
    } catch {
      setAuthError('Invalid OTP. Please try again.');
    }
  };

  const updateDisplayName = async (name: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
      setUser(prev => prev ? { ...prev, displayName: name } : null);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      openAuthModal, closeAuthModal, isAuthModalOpen,
      signInWithGoogle, sendOTP, verifyOTP, updateDisplayName,
      logout, authError, setAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
