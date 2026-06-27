'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCT_LIST } from '@/lib/products';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { Product } from '@/lib/types';

type FilterType = 'all' | 'fruit' | 'vegetable';

export function Products() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = PRODUCT_LIST.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <section id="products" className="py-24 px-4 md:px-8 max-w-[1280px] mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="section-header"
      >
        <span className="section-label">Our Collection</span>
        <h2 className="section-title">Nature's Best, <em>Freeze-Dried</em></h2>
        <p className="section-subtitle">
          Each pack contains the true essence of real fruit and vegetables — fully natural, goodness preserved, just pure flavour and nutrition locked in every crunch.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {(['all', 'fruit', 'vegetable'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-body text-sm font-semibold px-6 py-2.5 rounded-full border-2 transition-all duration-300 ${
              filter === f
                ? 'bg-brand-burgundy border-brand-burgundy text-white'
                : 'bg-brand-cream-dk border-transparent text-brand-text-lt hover:border-brand-burgundy hover:text-brand-burgundy hover:bg-white'
            }`}
          >
            {f === 'all' && 'All Products'}
            {f === 'fruit' && '🍓 Fruits'}
            {f === 'vegetable' && '🥕 Vegetables'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={product.id}
            >
              <ProductCard 
                product={product} 
                onQuickView={setQuickViewProduct} 
                priority={index < 4}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
