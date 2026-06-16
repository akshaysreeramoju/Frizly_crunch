'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

import { useRouter } from 'next/navigation';

export function CartSidebar() {
  const router = useRouter();
  const { state, dispatch, totalItems, cartTotal } = useCart();
  const { isCartOpen, items } = state;

  const cartItems = Object.values(items);

  const handleCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="fixed inset-0 bg-brand-dark/50 z-[1999] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[2000] shadow-[-8px_0_40px_rgba(26,16,8,0.2)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-cream-dk">
              <h3 className="font-display text-xl text-brand-dark">Your Cart</h3>
              <button
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="w-8 h-8 rounded-full bg-brand-cream-dk text-brand-text flex items-center justify-center hover:bg-brand-burgundy hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-brand-text-lt">
                  <ShoppingCart className="w-12 h-12 opacity-40" />
                  <p className="text-sm">Your cart is empty</p>
                  <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'CLOSE_CART' })}>
                    Shop Now
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map(({ product, qty }) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={product.id}
                        className="flex items-center gap-4 py-4 border-b border-brand-cream-dk"
                      >
                        <span className="text-2xl">{product.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-brand-dark">{product.name}</div>
                          <div className="text-[0.7rem] text-brand-text-lt mt-0.5">Net Wt. {product.weight} • ₹{product.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: product.id, delta: -1 } })}
                            className="w-7 h-7 rounded-full bg-brand-cream-dk text-brand-burgundy flex items-center justify-center hover:bg-brand-burgundy hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-sm">{qty}</span>
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: product.id, delta: 1 } })}
                            className="w-7 h-7 rounded-full bg-brand-cream-dk text-brand-burgundy flex items-center justify-center hover:bg-brand-burgundy hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: product.id } })}
                          className="p-1 text-brand-text-lt hover:text-brand-burgundy transition-colors ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t-2 border-brand-cream-dk flex flex-col gap-4 bg-gray-50/50">
                <div className="flex justify-between items-center text-sm text-brand-text-lt">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg text-brand-dark">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <Button fullWidth onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
