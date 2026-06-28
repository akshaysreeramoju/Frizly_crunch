'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { PRODUCTS, PRODUCT_LIST } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/Toast';
import { Star, ShieldCheck, Truck, RefreshCcw, Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/sections/ProductCard';

export function ProductDetailClient({ slug }: { slug: string }) {
  const product = PRODUCTS[slug];
  const { dispatch } = useCart();

  if (!product) {
    notFound();
  }

  const handleAdd = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
    toast(`🛒 ${product.name} added to cart!`);
    dispatch({ type: 'OPEN_CART' });
  };

  // Smart recommendations: same category first, fill with others
  const sameCategory = PRODUCT_LIST.filter(p => p.id !== product.id && p.category === product.category);
  const otherCategory = PRODUCT_LIST.filter(p => p.id !== product.id && p.category !== product.category);
  const related = [...sameCategory, ...otherCategory].slice(0, 4);


  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-32 pb-16">

      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-6">
        <nav className="flex items-center gap-1.5 text-sm text-brand-text-lt font-medium">
          <Link href="/" className="hover:text-brand-burgundy transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/#products" className="hover:text-brand-burgundy transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-dark font-semibold">{product.name}</span>
        </nav>
      </div>
      
      {/* Product Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-20">
        <div className="bg-white rounded-[32px] p-4 sm:p-8 md:p-12 shadow-sm border border-brand-cream-dk flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: Images Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-brand-cream border border-brand-cream-dk">
              <Image 
                src={product.img} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails (Mocked) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer ${i === 1 ? 'border-brand-burgundy' : 'border-transparent hover:border-brand-cream-dk'}`}>
                  <Image src={product.img} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-6 border-b border-brand-cream-dk pb-6">
              <div className="text-xs font-bold tracking-[0.1em] uppercase text-brand-sage mb-2">
                {product.category === 'fruit' ? '🍓 Freeze-Dried Fruit' : '🥕 Freeze-Dried Vegetable'}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-dark mb-4 leading-tight">
                {product.name} <span className="text-3xl">{product.emoji}</span>
              </h1>
              
              {/* Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-brand-gold">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-semibold text-brand-dark">4.8</span>
                <span className="text-sm text-brand-text-lt underline cursor-pointer">(124 Reviews)</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-3 mb-2">
                <span className="font-display text-3xl font-bold text-brand-burgundy">₹{product.price}</span>
                <span className="text-sm font-medium text-brand-text-lt mb-1">per pack</span>
              </div>
              <p className="text-xs text-brand-text-lt">Net Weight: <strong className="text-brand-dark">{product.weight}</strong></p>
            </div>

            <p className="text-brand-text-lt leading-relaxed mb-8">
              {product.desc}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {product.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm font-semibold text-brand-sage bg-brand-sage/5 p-3 rounded-xl border border-brand-sage/10">
                  <CheckIcon />
                  {b}
                </div>
              ))}
            </div>

            {/* Sticky Add to Cart (Mobile) / Normal (Desktop) */}
            <div className="mt-auto fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-brand-cream-dk z-40 lg:relative lg:p-0 lg:bg-transparent lg:border-none lg:z-auto">
              <Button size="lg" fullWidth onClick={handleAdd} className="h-14 text-lg">
                Add to Cart — ₹{product.price}
              </Button>
              <div className="hidden lg:flex items-center justify-center gap-4 mt-4 text-[0.65rem] font-bold tracking-wide text-brand-text-lt uppercase">
                <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure Payment</div>
                <div className="flex items-center gap-1"><Truck className="w-4 h-4" /> Fast Delivery</div>
                <div className="flex items-center gap-1"><RefreshCcw className="w-4 h-4" /> Easy Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Facts Table */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-20">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-brand-cream-dk flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h3 className="font-display text-2xl font-bold text-brand-dark mb-4">Nutritional Facts</h3>
            <p className="text-brand-text-lt mb-6">100% natural {product.name}. Values per 100g of freeze-dried product.</p>
            <div className="flex items-center gap-2 text-brand-sage font-bold bg-brand-sage/10 px-4 py-3 rounded-xl border border-brand-sage/20 w-max">
              <Heart className="w-5 h-5 fill-brand-sage" />
              100% Natural Ingredients
            </div>
          </div>
          <div className="md:w-2/3 border-2 border-brand-dark rounded-xl overflow-hidden bg-white">
            <div className="bg-brand-dark text-white font-bold p-3 text-lg border-b-4 border-brand-dark">Nutrition Facts</div>
            <div className="p-4 flex flex-col gap-2 font-medium text-brand-dark">
              <div className="flex justify-between border-b border-gray-200 pb-2"><span>Calories</span> <span>340 kcal</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2"><span>Total Carbohydrates</span> <span>85g</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 pl-4 text-brand-text-lt"><span>Dietary Fiber</span> <span>12g</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 pl-4 text-brand-text-lt"><span>Total Sugars (Natural)</span> <span>65g</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 pl-4 font-bold text-brand-burgundy"><span>Added Sugars</span> <span>0g</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2"><span>Protein</span> <span>4g</span></div>
              <div className="flex justify-between pb-1"><span>Total Fat</span> <span>0.5g</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section Mock */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-20">
        <h3 className="font-display text-3xl font-bold text-brand-dark mb-8 text-center">What Customers Are Saying</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: "Priya S.", loc: "Mumbai", r: "Absolutely love the crunch! Best healthy snack I've had." },
            { n: "Rahul K.", loc: "Delhi", r: "Perfect for my kids' lunchboxes. No added sugar is a huge plus." },
            { n: "Anita M.", loc: "Bangalore", r: "Tastes exactly like the real fruit but with an amazing texture." }
          ].map((rev, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream-dk">
              <div className="flex text-brand-gold mb-3">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-brand-text font-medium italic mb-4">"{rev.r}"</p>
              <div className="flex items-center justify-between mt-auto border-t border-brand-cream-dk pt-4">
                <span className="font-bold text-sm text-brand-dark">{rev.n}</span>
                <span className="text-xs text-brand-text-lt">{rev.loc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* You May Also Like */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[1280px] mx-auto px-4 md:px-8"
      >
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-brand-sage bg-brand-sage/10 px-4 py-1.5 rounded-full border border-brand-sage/20 mb-4">More to Explore</span>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-2">You May Also Like</h3>
          <p className="text-brand-text-lt">Handpicked freeze-dried snacks just for you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {related.map(p => (
            <ProductCard key={p.id} product={p} onQuickView={() => {}} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 font-body font-bold text-sm text-brand-burgundy border-2 border-brand-burgundy px-8 py-3 rounded-full hover:bg-brand-burgundy hover:text-white transition-all duration-300"
          >
            View All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
