import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/siteConfig';

export function Footer() {
  return (
    <footer className="bg-brand-dark pt-16 px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 pb-12 border-b border-brand-cream/10">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3.5 mb-5">
            <Image
              src="/images/logo-gold.png"
              alt="Frizly Crunch Gold Logo"
              width={44}
              height={40}
              className="w-11 h-10 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-[1.1rem] tracking-wide">
                <span style={{color: '#5cb85c'}}>FRIZLY</span> <span style={{color: '#d4a96a'}}>CRUNCH</span>
              </span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
              <li><Link href="/about" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-[0.95rem] text-brand-gold mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/privacy-policy" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Terms & Conditions</Link></li>
              <li><Link href="/shipping-delivery-policy" className="text-sm text-brand-cream/55 hover:text-brand-cream hover:pl-1 transition-all">Shipping Policy</Link></li>
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
          © {SITE_CONFIG.legal.copyrightYear} {SITE_CONFIG.legal.companyName}
        </p>
        <p className="text-xs text-brand-cream/35 tracking-wide">
          100% Natural · Freeze-Dried · Non-Fried · Non-Baked · No Preservatives
        </p>
      </div>
    </footer>
  );
}
