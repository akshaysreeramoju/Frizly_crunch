'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
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

  // Listen to Firebase auth state — persists across refreshes automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
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
    return () => unsubscribe();
  }, []);

  const openAuthModal = () => { setAuthError(''); setIsAuthModalOpen(true); };
  const closeAuthModal = () => { setIsAuthModalOpen(false); setAuthError(''); };

  const signInWithGoogle = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      closeAuthModal();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in failed. Please try again.');
      }
    }
  };

  const sendOTP = async (phone: string, recaptchaContainerId: string) => {
    setAuthError('');
    try {
      // Create invisible reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: 'invisible',
        callback: () => {},
      });
      confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('OTP error:', error);
      setAuthError('Failed to send OTP. Check the number and try again.');
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
