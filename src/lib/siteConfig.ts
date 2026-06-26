/**
 * siteConfig.ts
 *
 * Central configuration for all contact details, social links, and brand info.
 * Update these values once and they will propagate across the entire website.
 *
 * ⚠️ PLACEHOLDER VALUES — replace with your actual details before going live.
 */

export const SITE_CONFIG = {
  brand: {
    name: 'Frizly Crunch',
    tagline: 'Real Food. Reinvented.',
    subTagline: '— REAL FOOD. REINVENTED. —',
    freezeDried: '— FREEZE-DRIED —',
  },

  contact: {
    /** Customer-facing phone number (also WhatsApp) */
    phone: '+91 98765 43210', // ← REPLACE with your actual number
    /** Public business email */
    email: 'hello@frizlycrunch.com', // ← REPLACE
    /** Website URL */
    website: 'www.frizlycrunch.com',
  },

  social: {
    /** Full Instagram URL */
    instagram: 'https://instagram.com/frizlycrunch', // ← REPLACE with actual handle
    /** Instagram @handle (for display) */
    instagramHandle: '@frizlycrunch', // ← REPLACE
    facebook: '', // ← Add URL when available
    twitter: '',  // ← Add URL when available
    whatsapp: 'https://wa.me/919876543210', // ← REPLACE with actual number
  },

  address: {
    line1: '456, Green Avenue',
    city: 'New Delhi',
    pincode: '110016',
    country: 'India',
    full: '456, Green Avenue, New Delhi – 110016, India',
  },

  legal: {
    companyName: 'Frizly Crunch Foods Pvt. Ltd.',
    fssaiNumber: '', // ← Add FSSAI license number
    copyrightYear: '2026',
  },
} as const;
