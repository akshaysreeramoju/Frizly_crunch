'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch, cartTotal, totalItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    paymentMethod: 'cod' // default to Cash on Delivery
  });

  const cartItems = Object.values(state.items);

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl font-bold text-brand-dark mb-4">Your Cart is Empty</h1>
        <p className="text-brand-text-lt mb-8">Add some delicious freeze-dried snacks before checking out.</p>
        <Button onClick={() => router.push('/#products')}>Shop Now</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            phone: formData.phone
          },
          paymentMethod: formData.paymentMethod
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast('🎉 Order placed successfully!');
        dispatch({ type: 'CLEAR_CART' });
        router.push(`/order/${data.orderId}`);
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error(error);
      toast('❌ Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8 text-center md:text-left">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-6 md:p-10 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-dark mb-6">1. Shipping Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none" placeholder="Priya Sharma" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none" placeholder="123 Main St, Apt 4B" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none" placeholder="Mumbai" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">PIN Code</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none" placeholder="400001" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="p-3 border-2 border-brand-cream-dk rounded-xl focus:border-brand-burgundy outline-none" placeholder="+91 98765 43210" />
              </div>
            </div>

            <h2 className="font-display text-xl font-bold text-brand-dark mb-6 pt-6 border-t border-brand-cream-dk">2. Payment Method</h2>
            
            <div className="flex flex-col gap-4 mb-10">
              <label className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-brand-burgundy bg-brand-burgundy/5' : 'border-brand-cream-dk hover:border-brand-burgundy/50'}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-5 h-5 accent-brand-burgundy" />
                <div>
                  <div className="font-bold text-brand-dark">Cash on Delivery (COD)</div>
                  <div className="text-sm text-brand-text-lt">Pay in cash when your order arrives.</div>
                </div>
              </label>

              <label className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${formData.paymentMethod === 'card' ? 'border-brand-burgundy bg-brand-burgundy/5' : 'border-brand-cream-dk hover:border-brand-burgundy/50'}`}>
                <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="w-5 h-5 accent-brand-burgundy" />
                <div className="flex-1">
                  <div className="font-bold text-brand-dark flex justify-between">
                    Credit / Debit Card <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">MOCK</span>
                  </div>
                  <div className="text-sm text-brand-text-lt">For demo purposes. No real charge will be made.</div>
                </div>
              </label>
              
              {formData.paymentMethod === 'card' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mt-2 flex flex-col gap-3">
                   <input disabled type="text" placeholder="Card Number (XXXX-XXXX-XXXX-XXXX)" className="p-2 border rounded bg-white text-sm" />
                   <div className="flex gap-3">
                     <input disabled type="text" placeholder="MM/YY" className="p-2 border rounded bg-white w-1/2 text-sm" />
                     <input disabled type="text" placeholder="CVC" className="p-2 border rounded bg-white w-1/2 text-sm" />
                   </div>
                   <p className="text-xs text-brand-text-lt text-center mt-1">Mock UI only. Select "Place Order" to continue.</p>
                </div>
              )}
            </div>

            <Button fullWidth size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : `Place Order • ₹${cartTotal}`}
            </Button>
          </form>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm h-fit sticky top-24">
            <h2 className="font-display text-xl font-bold text-brand-dark mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-cream rounded-md flex items-center justify-center text-xl shrink-0">
                    {product.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-brand-dark">{product.name}</div>
                    <div className="text-[0.7rem] text-brand-text-lt">Qty: {qty}</div>
                  </div>
                  <div className="font-bold text-sm text-brand-dark">
                    ₹{product.price * qty}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-cream-dk pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-brand-text-lt">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-text-lt">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-display text-2xl font-bold text-brand-dark mt-4 pt-4 border-t border-brand-cream-dk">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
