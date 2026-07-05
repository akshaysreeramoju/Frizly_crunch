'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-dark text-brand-gold text-xs font-bold tracking-wider uppercase py-2 px-4 relative flex items-center justify-center overflow-hidden h-9 z-50">
      <div className="animate-marquee whitespace-nowrap absolute">
        <span className="mx-4">🎉 Launch Offer: Save up to 15% — Shop Now | Free Shipping above ₹999</span>
        <span className="mx-4">🎉 Launch Offer: Save up to 15% — Shop Now | Free Shipping above ₹999</span>
        <span className="mx-4">🎉 Launch Offer: Save up to 15% — Shop Now | Free Shipping above ₹999</span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-white transition-colors z-10 bg-brand-dark"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
