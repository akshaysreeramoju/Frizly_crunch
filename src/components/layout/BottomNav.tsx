'use client';

import Link from 'next/link';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const { totalItems, dispatch } = useCart();
  const { user, openAuthModal } = useAuth();
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-cream-dk z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] ${pathname === '/' ? 'text-brand-burgundy' : 'text-brand-text-lt'}`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[0.65rem] font-bold">Home</span>
        </Link>
        
        <Link 
          href="/products" 
          className={`flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] ${pathname === '/products' ? 'text-brand-burgundy' : 'text-brand-text-lt'}`}
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-[0.65rem] font-bold">Shop</span>
        </Link>

        <button 
          onClick={() => dispatch({ type: 'OPEN_CART' })}
          className="flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] text-brand-text-lt relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-1" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-burgundy text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[0.65rem] font-bold">Cart</span>
        </button>

        {user ? (
          <Link 
            href="/account" 
            className={`flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] ${pathname?.startsWith('/account') ? 'text-brand-burgundy' : 'text-brand-text-lt'}`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[0.65rem] font-bold">Profile</span>
          </Link>
        ) : (
          <button 
            onClick={openAuthModal}
            className="flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] text-brand-text-lt"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[0.65rem] font-bold">Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}
