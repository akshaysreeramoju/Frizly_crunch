'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

let toastTimeout: NodeJS.Timeout;
let notify: (msg: string) => void;

export function toast(message: string) {
  if (notify) notify(message);
}

export function ToastContainer() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    notify = (msg: string) => {
      setMessage(msg);
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        setMessage(null);
      }, 3000);
    };
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-[5000] flex items-center gap-3 rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-brand-cream shadow-[0_20px_60px_rgba(107,30,30,0.20)] border-l-4 border-brand-gold whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
