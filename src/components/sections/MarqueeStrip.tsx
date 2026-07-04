import React from 'react';

const MESSAGES = [
  'Free delivery on orders above ₹899',
  'Custard Apple', 'Mango', 'Pineapple', 'Banana', 'Apple',
  'Pink Guava', 'Papaya', 'Chikoo', 'Amla', 'Carrot',
  'Sweetcorn', 'Beetroot'
];

export function MarqueeStrip() {
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div className="relative bg-gradient-to-br from-brand-burgundy to-brand-burgundy-lt py-3.5 overflow-hidden">
      {/* Fades */}
      <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-brand-burgundy to-transparent z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-brand-burgundy to-transparent z-10" />

      {/* Track */}
      <div className="flex w-max animate-marquee text-brand-cream text-sm font-medium tracking-wide">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <span className="whitespace-nowrap flex items-center">{item}</span>
            <span className="mx-8">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
