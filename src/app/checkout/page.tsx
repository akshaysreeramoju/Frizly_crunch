'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { ShieldCheck, Truck, Gift, Lock } from 'lucide-react';
import { LAUNCH_TIERS } from '@/lib/coupons';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch, cartTotal, totalItems, discountPercent, discountAmount, discountedTotal } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
  });

  const cartItems = Object.values(state.items);

  // Pre-fill from logged-in user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
        email:    prev.email    || user.email || '',
        phone:    prev.phone    || user.phoneNumber?.replace('+91', '').trim() || '',
      }));
    }
  }, [user]);

  // Load Razorpay checkout.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl font-bold text-brand-dark mb-4">Your Cart is Empty</h1>
        <p className="text-brand-text-lt mb-8">Add some delicious freeze-dried snacks before checking out.</p>
        <Button onClick={() => router.push('/#products')}>Shop Now</Button>
      </div>
    );
  }

  const effectiveDiscountPercent = appliedCoupon ? couponDiscountPercent : discountPercent;
  const effectiveDiscountAmount = Math.round((cartTotal * effectiveDiscountPercent) / 100);
  const subTotalAfterDiscount = cartTotal - effectiveDiscountAmount;
  const shippingCost = cartTotal < 899 && cartTotal > 0 ? 99 : 0;
  const finalTotal = subTotalAfterDiscount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(couponInput.trim().toUpperCase());
        setCouponDiscountPercent(data.discountPercent);
        setCouponInput('');
        toast('✅ Coupon applied successfully!');
      } else {
        setCouponError(data.message);
      }
    } catch {
      setCouponError('Failed to apply coupon.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create Razorpay order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, currency: 'INR' }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      // 2. Open Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Frizly Crunch',
        description: `${totalItems} pack${totalItems !== 1 ? 's' : ''}${discountPercent > 0 ? ` · ${discountPercent}% off` : ''}`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`,
        },
        theme: { color: '#6B1E1E' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          // 3. Verify & save order — with a 30-second safety timeout
          // so the button never stays stuck on "Processing…" forever.
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30_000);
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                items: cartItems,
                shippingAddress: { ...formData },
                userId: user?.uid || null,
                discountPercent: effectiveDiscountPercent,
                discountAmount: effectiveDiscountAmount,
                couponCode: appliedCoupon || null,
                shippingCost,
                total: finalTotal,
              }),
            });
            clearTimeout(timeoutId);
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast('🎉 Payment successful! Order confirmed.');
              dispatch({ type: 'CLEAR_CART' });
              router.push(`/order/${verifyData.orderId}`);
            } else {
              // Handle inline — do NOT throw here. The outer try/catch in
              // handleSubmit is already done; any throw from inside Razorpay's
              // async handler callback silently disappears, leaving the
              // button stuck on "Processing..." forever.
              toast(`❌ ${verifyData.message || 'Verification failed. Please contact support.'}`);
              setIsSubmitting(false);
            }
          } catch (err: any) {
            clearTimeout(timeoutId);
            // NEVER re-throw from inside this handler — same reason as above.
            if (err?.name === 'AbortError') {
              toast('⚠️ Confirmation timed out. Your payment may have gone through — check your email or contact support.');
            } else {
              toast(`❌ ${err instanceof Error ? err.message : 'Verification failed. Contact support — your payment may have gone through.'}`);
            }
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => setIsSubmitting(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast('❌ Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      toast(`❌ ${error instanceof Error ? error.message : 'Something went wrong.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-2 text-center md:text-left">
          Secure Checkout
        </h1>
        <div className="flex items-center gap-2 justify-center md:justify-start mb-8 text-brand-sage text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Secure · Razorpay Encrypted Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 md:gap-10 items-start">

          {/* ── Left: Shipping Form ── */}
          <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-4 sm:p-6 md:p-10 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-burgundy" /> Shipping Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none transition-colors"
                  placeholder="Priya Sharma" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">
                  Email <span className="normal-case font-normal">(order updates)</span>
                </label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange}
                  className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none transition-colors"
                  placeholder="priya@example.com" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">Delivery Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange}
                  className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none transition-colors"
                  placeholder="House / Flat No., Street, Area" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange}
                  className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none transition-colors"
                  placeholder="Hyderabad" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">PIN Code</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                  className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none transition-colors"
                  placeholder="500001" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none transition-colors"
                  placeholder="98765 43210" />
              </div>
            </div>

            {/* Visible Payment Options */}
            <div className="mb-6">
              <h3 className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt mb-3">
                Payment Method
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center gap-3 p-4 border-2 border-brand-burgundy bg-brand-burgundy/5 rounded-xl cursor-pointer">
                  <input type="radio" name="paymentMethod" value="razorpay" defaultChecked className="w-4 h-4 text-brand-burgundy focus:ring-brand-burgundy" />
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-dark text-sm">Online Payment</span>
                    <span className="text-[0.65rem] text-brand-text-lt">UPI, Cards, Netbanking</span>
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-2 mt-3 pl-1 opacity-70">
                {/* Simulated payment method logos */}
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold">UPI</div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold">VISA</div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold">MasterCard</div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold">Razorpay</div>
              </div>
            </div>

            <Button fullWidth size="lg" type="submit" disabled={isSubmitting} id="checkout-pay-btn" className="sticky bottom-4 z-10 shadow-xl">
              {isSubmitting ? 'Processing...' : `Proceed to Pay ₹${finalTotal} →`}
            </Button>

            <p className="text-center text-xs text-brand-text-lt mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL · Secured by Razorpay
            </p>
          </form>

          {/* ── Right: Order Summary ── */}
          <div className="flex flex-col gap-4 sticky top-24">

            {/* Launching Offer */}
            <div className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/10 border border-brand-gold/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-brand-gold" />
                <span className="font-bold text-brand-dark text-sm tracking-wide uppercase">🎉 Launching Offer</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {LAUNCH_TIERS.slice().reverse().map((tier) => (
                  <div key={tier.minPacks}
                    className={`flex items-center gap-2 text-sm ${totalItems >= tier.minPacks ? 'text-brand-dark font-semibold' : 'text-brand-text-lt'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0 ${totalItems >= tier.minPacks ? 'bg-brand-gold text-brand-dark' : 'bg-brand-cream-dk text-brand-text-lt'}`}>
                      {totalItems >= tier.minPacks ? '✓' : tier.minPacks}
                    </span>
                    {tier.minPacks}+ pack{tier.minPacks > 1 ? 's' : ''} → {tier.percent}% off
                  </div>
                ))}
              </div>
              {discountPercent > 0 && !appliedCoupon && (
                <div className="mt-2 pt-2 border-t border-brand-gold/30 text-sm font-bold text-brand-burgundy">
                  ✅ {discountPercent}% off applied automatically!
                </div>
              )}
            </div>

            {/* Coupon Input */}
            <div className="bg-white rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm">
              <h3 className="font-display font-bold text-brand-dark mb-3">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none uppercase"
                  disabled={!!appliedCoupon}
                />
                <Button onClick={handleApplyCoupon} disabled={!couponInput.trim() || !!appliedCoupon || isApplyingCoupon}>
                  {isApplyingCoupon ? 'Applying...' : appliedCoupon ? 'Applied' : 'Apply'}
                </Button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              {appliedCoupon && (
                <div className="mt-2 text-sm text-brand-sage font-bold flex justify-between items-center bg-brand-sage/10 p-2 rounded-lg">
                  <span>{appliedCoupon} applied ({couponDiscountPercent}% off)</span>
                  <button onClick={() => { setAppliedCoupon(''); setCouponDiscountPercent(0); }} className="text-red-500 hover:underline text-xs">Remove</button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">Order Summary</h2>
              <div className="flex flex-col gap-4 mb-6 max-h-[260px] overflow-y-auto pr-1">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-brand-cream rounded-md overflow-hidden shrink-0 border border-brand-cream-dk">
                      <Image src={product.img} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-brand-dark">{product.name}</div>
                      <div className="text-[0.7rem] text-brand-text-lt">Qty: {qty}</div>
                    </div>
                    <div className="font-bold text-sm text-brand-dark">₹{product.price * qty}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-cream-dk pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-brand-text-lt">
                  <span>Subtotal ({totalItems} pack{totalItems !== 1 ? 's' : ''})</span>
                  <span>₹{cartTotal}</span>
                </div>
                {effectiveDiscountAmount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-brand-sage">
                    <span>{appliedCoupon ? `🎉 ${appliedCoupon} Coupon` : `🎉 ${effectiveDiscountPercent}% Launching Offer`}</span>
                    <span>−₹{effectiveDiscountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-brand-text-lt">
                  <span>Shipping {subTotalAfterDiscount < 899 && <span className="text-[0.65rem] text-brand-text-lt">(Free above ₹899)</span>}</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-semibold" : "text-brand-dark"}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between font-display text-2xl font-bold text-brand-dark mt-4 pt-4 border-t border-brand-cream-dk">
                  <span>Total</span>
                  <span className="text-brand-burgundy">₹{finalTotal}</span>
                </div>
                {effectiveDiscountAmount > 0 && (
                  <p className="text-center text-xs text-brand-sage font-semibold mt-1">
                    🎊 You save ₹{effectiveDiscountAmount} on this order!
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
