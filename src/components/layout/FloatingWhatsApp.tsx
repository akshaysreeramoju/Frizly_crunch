'use client';

import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';

export function FloatingWhatsApp() {
  if (!SITE_CONFIG.social.whatsapp) return null;

  return (
    <a
      href={SITE_CONFIG.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[80px] md:bottom-6 right-4 md:right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_6px_16px_rgba(37,211,102,0.5)] transition-all z-40"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
