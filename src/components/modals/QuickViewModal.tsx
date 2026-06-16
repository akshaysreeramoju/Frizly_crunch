'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/Toast';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { dispatch } = useCart();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    dispatch({ type: 'ADD_ITEM', payload: { product } });
    toast(`🛒 ${product.name} added to cart!`);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/70 z-[3000] p-4 flex items-center justify-center backdrop-blur-sm"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] w-full max-w-[700px] max-h-[85vh] overflow-y-auto relative shadow-[0_40px_80px_rgba(26,16,8,0.35)]"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-burgundy hover:rotate-90 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square relative md:rounded-l-[24px] overflow-hidden bg-brand-cream">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>
                <div className="p-8 flex flex-col">
                  <span className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-brand-sage mb-2 block">
                    {product.category === 'fruit' ? '🍓 Fruit' : '🥕 Vegetable'}
                  </span>
                  <h2 className="font-display text-[1.75rem] font-bold text-brand-dark mb-2">
                    {product.name}
                  </h2>
                  <p className="text-sm text-brand-text-lt leading-[1.75] mb-5">
                    {product.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.benefits.map((b) => (
                      <span
                        key={b}
                        className="text-[0.75rem] font-semibold text-brand-burgundy bg-brand-burgundy/5 border border-brand-burgundy/15 px-3 py-1 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-6 mt-auto border-t border-brand-cream-dk pt-4">
                    <div>
                      <div className="font-display text-2xl font-bold text-brand-dark">₹{product.price}</div>
                      <p className="text-[0.7rem] text-brand-text-lt font-semibold mt-0.5">
                        📦 Net Weight: {product.weight} per pack
                      </p>
                    </div>
                  </div>
                  
                  <Button fullWidth onClick={handleAdd}>
                    + Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
