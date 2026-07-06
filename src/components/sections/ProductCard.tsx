'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  priority?: boolean
}
export function ProductCard({ product, onQuickView, priority = false }: ProductCardProps) {
  const { dispatch } = useCart();
  const { user, openAuthModal } = useAuth();

  const handleAdd = () => {
    if (!user) {
      openAuthModal();
      toast('🔒 Please login to add items to cart');
      return;
    }//
    dispatch({ type: 'ADD_ITEM', payload: { product } });
    toast(`🛒 ${product.name} added to cart!`);
  };

  const isBestseller = ['custard-apple', 'mango'].includes(product.id);

  return (
    <div className="group rounded-[24px] bg-white overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(107,30,30,0.20)] transition-all duration-300 relative flex flex-col h-full border border-brand-cream-dk">
      {isBestseller && (
        <div className="absolute top-4 -left-2 bg-gradient-to-br from-brand-gold to-brand-gold-lt text-brand-dark text-[0.7rem] font-bold tracking-[0.08em] uppercase py-1.5 pl-3 pr-4 rounded-r-md z-10 shadow-md">
          Bestseller
          <div className="absolute -bottom-[5px] left-0 border-l-[5px] border-l-[#9A7A20] border-b-[5px] border-b-transparent" />
        </div>
      )}

      {/* Image Wrap — clicking navigates to product detail page */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-brand-cream to-brand-cream-dk">
        <Image
          src={product.img}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 300px"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-brand-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
            className="font-body text-sm font-semibold text-brand-dark bg-brand-gold px-5 py-2.5 rounded-full translate-y-3 group-hover:translate-y-0 hover:bg-white hover:-translate-y-0.5 transition-all duration-300 tracking-wide"
          >
            Quick View
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[0.7rem] font-semibold text-brand-sage tracking-[0.08em] uppercase mb-1.5">
          {product.category === 'fruit' ? 'Fruit' : 'Vegetable'}
        </div>
        <Link href={`/products/${product.id}`} className="hover:text-brand-burgundy transition-colors">
          <h3 className="font-display text-xl font-bold text-brand-dark mb-1">
            {product.name}
          </h3>
        </Link>



        <p className="text-[0.78rem] text-brand-text-lt leading-[1.5] mb-3 line-clamp-2">
          {product.desc}
        </p>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {product.benefits.slice(0, 3).map((b) => (
            <span
              key={b}
              className="text-[0.68rem] font-semibold text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-2.5 py-0.5 rounded-full whitespace-nowrap"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-brand-cream-dk mb-4">
          <div>
            <div className="font-bold text-brand-dark">₹{product.price}</div>
            <div className="text-[0.65rem] font-medium text-brand-text-lt mt-0.5">Net Wt. {product.weight}</div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full font-body text-[0.78rem] font-bold text-white bg-gradient-to-br from-brand-burgundy to-brand-burgundy-lt px-5 py-3 min-h-[44px] flex items-center justify-center rounded-xl tracking-wide hover:from-brand-gold hover:to-brand-gold-lt hover:text-brand-dark hover:scale-[1.02] hover:shadow-sm transition-all"
        >
          + Quick Add
        </button>
      </div>
    </div>
  );
}
