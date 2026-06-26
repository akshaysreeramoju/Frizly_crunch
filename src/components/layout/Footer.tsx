import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';

export function Footer() {
  return (
    <footer className="bg-brand-dark pt-16 px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 pb-12 border-b border-brand-cream/10">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3.5 mb-5">
            <svg viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-10">
              <path d="M20 2C17 8 8 10 4 16C2 19 3 23 6 25C9 27 13 26 15 23C16 21 16 18 18 16C19 15 20 15 20 15" fill="#D4AF37"/>
              <path d="M20 2C23 8 32 10 36 16C38 19 37 23 34 25C31 27 27 26 25 23C24 21 24 18 22 16C21 15 20 15 20 15" fill="#7A8F6A"/>
              <line x1="20" y1="15" x2="20" y2="36" stroke="#F7F1E8" strokeWidth="2"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[1.1rem] text-brand-cream tracking-wide">FRIZLY CRUNCH</span>
              <span className="text-[0.6rem] font-medium tracking-[0.15em] text-brand-gold">— REAL FOOD. REINVENTED. —</span>
            </div>
          </div>
          <p className="text-sm text-brand-cream/55 leading-[1.8] mb-6 max-w-[360px]">
            We believe real food in its most natural form is the best food. Freeze-drying preserves nature's goodness in every single crunch.
          </p>
          <div className="flex flex-wrap gap-3">
            {['🇮🇳 Made in India', '🌿 FSSAI Certified', '♻️ Recyclable Packaging'].map(badge => (
              <span key={badge} className="text-xs font-semibold text-brand-cream/80 bg-brand-cream/5 border border-brand-cream/10 px-3.5 py-1.5 rounded-full tracking-wide">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display font-bold text-[0.95rem] text-brand-gold mb-4">Products</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#products" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Freeze-Dried Fruits</Link></li>
              <li><Link href="#products" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Freeze-Dried Vegetables</Link></li>
              <li><Link href="#products" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Bestsellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-[0.95rem] text-brand-gold mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/track" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Track Order</Link></li>
              <li><Link href="/#why-us" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">About Us</Link></li>
              <li><Link href="/#process" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Our Process</Link></li>
              <li><Link href="/#contact" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-[0.95rem] text-brand-gold mb-4">Connect</h4>
            <ul className="flex flex-col gap-2.5">
              {SITE_CONFIG.social.instagram && (
                <li><a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Instagram</a></li>
              )}
              {SITE_CONFIG.social.facebook && (
                <li><a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Facebook</a></li>
              )}
              {SITE_CONFIG.social.twitter && (
                <li><a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Twitter/X</a></li>
              )}
              {SITE_CONFIG.social.whatsapp && (
                <li><a href={SITE_CONFIG.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">WhatsApp</a></li>
              )}
              <li><a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">{SITE_CONFIG.contact.email}</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-xs text-brand-cream/35 tracking-wide">
          © {SITE_CONFIG.legal.copyrightYear} {SITE_CONFIG.legal.companyName} · {SITE_CONFIG.address.full}
        </p>
        <p className="text-xs text-brand-cream/35 tracking-wide">
          100% Natural · Freeze-Dried · Non-Fried · Non-Baked · No Preservatives
        </p>
      </div>
    </footer>
  );
}
