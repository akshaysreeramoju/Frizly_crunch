'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { LAUNCH_TIERS } from '@/lib/coupons';

export function CartSidebar() {
  const router = useRouter();
  const { state, dispatch, totalItems, cartTotal, discountPercent, discountAmount, discountedTotal } = useCart();
  const { user, openAuthModal } = useAuth();
  const { isCartOpen, items } = state;

  const cartItems = Object.values(items);
  const shippingCost = discountedTotal < 999 && discountedTotal > 0 ? 99 : 0;
  const finalTotal = discountedTotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    dispatch({ type: 'CLOSE_CART' });
    router.push('/checkout');
  };

  // Next tier info (e.g. "Add 1 more for 10% off")
  const nextTier = LAUNCH_TIERS.slice().reverse().find(t => t.minPacks > totalItems);

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

          {/* Sidebar / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-auto md:top-0 md:inset-y-0 md:right-0 md:left-auto md:bottom-auto w-full md:max-w-[400px] max-h-[85vh] md:max-h-full h-full bg-white z-[2000] rounded-t-3xl md:rounded-none shadow-[0_-8px_40px_rgba(26,16,8,0.2)] md:shadow-[-8px_0_40px_rgba(26,16,8,0.2)] flex flex-col"
          >
            {/* Mobile Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-12 h-1.5 bg-brand-cream-dk rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-brand-cream-dk">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl text-brand-dark">Your Cart</h3>
                {totalItems > 0 && (
                  <span className="w-6 h-6 rounded-full bg-brand-burgundy text-white text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="p-2.5 text-brand-text-lt hover:text-brand-burgundy transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Launching Offer Strip */}
            {cartItems.length > 0 && (
              <div className="bg-gradient-to-r from-brand-gold/20 to-brand-gold/10 border-b border-brand-gold/30 px-6 py-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span className="text-[0.72rem] font-bold text-brand-dark tracking-wide uppercase">
                    🎉 Launching Offer
                  </span>
                </div>
                <div className="flex gap-3 mt-1.5">
                  {LAUNCH_TIERS.slice().reverse().map((tier) => (
                    <div
                      key={tier.minPacks}
                      className={`flex items-center gap-1 text-[0.68rem] font-semibold transition-all ${
                        totalItems >= tier.minPacks
                          ? 'text-brand-burgundy'
                          : 'text-brand-text-lt'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[0.55rem] font-bold shrink-0 ${
                        totalItems >= tier.minPacks
                          ? 'bg-brand-gold text-brand-dark'
                          : 'bg-brand-cream-dk text-brand-text-lt'
                      }`}>
                        {totalItems >= tier.minPacks ? '✓' : tier.minPacks}
                      </span>
                      {tier.percent}% off
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                          <div className="text-[0.7rem] text-brand-text-lt mt-0.5">
                            Net Wt. {product.weight} · ₹{product.price} each
                          </div>
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
                          className="p-1 text-brand-text-lt hover:text-brand-burgundy transition-colors ml-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Upsell nudge */}
                  {nextTier && (
                    <motion.div
                      layout
                      className="mt-2 p-3 bg-brand-cream rounded-xl text-center text-[0.75rem] text-brand-text-lt leading-relaxed"
                    >
                      Add <strong className="text-brand-burgundy">{nextTier.minPacks - totalItems} more pack{nextTier.minPacks - totalItems > 1 ? 's' : ''}</strong> to unlock{' '}
                      <strong className="text-brand-burgundy">{nextTier.percent}% off!</strong> 🎉
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t-2 border-brand-cream-dk flex flex-col gap-3 bg-gray-50/50">
                {/* Price breakdown */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm text-brand-text-lt">
                    <span>Subtotal ({totalItems} pack{totalItems !== 1 ? 's' : ''})</span>
                    <span>₹{cartTotal}</span>
                  </div>

                  <AnimatePresence>
                    {discountAmount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between items-center text-sm font-semibold text-brand-sage"
                      >
                        <span>🎉 {discountPercent}% Launching Offer</span>
                        <span>−₹{discountAmount}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-center text-sm text-brand-text-lt">
                    <span>Shipping {discountedTotal < 999 && <span className="text-[0.65rem] text-brand-text-lt">(Free above ₹999)</span>}</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-semibold text-xs" : "text-brand-dark text-sm"}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-brand-cream-dk pt-2 flex justify-between items-center font-bold text-lg text-brand-dark">
                  <span>Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-display text-brand-burgundy">₹{finalTotal}</span>
                    {discountAmount > 0 && (
                      <span className="block text-[0.65rem] font-medium text-brand-text-lt line-through">₹{cartTotal + shippingCost}</span>
                    )}
                  </div>
                </div>

                {/* Savings badge */}
                <AnimatePresence>
                  {discountAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-brand-sage/10 border border-brand-sage/25 rounded-xl px-3 py-2 text-center text-[0.75rem] font-semibold text-brand-sage"
                    >
                      🎊 You&apos;re saving ₹{discountAmount} on this order!
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button fullWidth onClick={handleCheckout} id="cart-checkout-btn">
                  Proceed to Checkout · ₹{finalTotal}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
