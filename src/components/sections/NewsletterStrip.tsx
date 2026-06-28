'use client';

export function NewsletterStrip() {
  return (
    <section className="py-24 bg-brand-dark text-brand-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent" />
      
      <div className="max-w-[800px] mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Join the Frizly Family</h2>
        <p className="text-brand-cream-dk mb-10 text-lg opacity-80">
          Get recipes, exclusive offers, and early access to our newest seasonal crunches.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email or WhatsApp number" 
            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-brand-gold transition-colors"
          />
          <button className="px-8 py-4 rounded-full bg-brand-gold text-brand-dark font-bold hover:bg-brand-gold-lt transition-colors">
            Subscribe
          </button>
        </form>
        <p className="text-xs text-brand-cream-dk/50 mt-4 italic">No spam. Only good stuff.</p>
      </div>
    </section>
  );
}
