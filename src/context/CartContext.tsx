'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/lib/types';
import { getAutoDiscount } from '@/lib/coupons';

interface CartState {
  items: Record<string, CartItem>;
  isCartOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QTY'; payload: { id: string; delta: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: { items: Record<string, CartItem> } };

const initialState: CartState = {
  items: {},
  isCartOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product } = action.payload;
      const existing = state.items[product.id];
      return {
        ...state,
        items: {
          ...state.items,
          [product.id]: {
            product,
            qty: existing ? existing.qty + 1 : 1,
          },
        },
      };
    }
    case 'REMOVE_ITEM': {
      const { [action.payload.id]: removed, ...rest } = state.items;
      void removed;
      return { ...state, items: rest };
    }
    case 'UPDATE_QTY': {
      const { id, delta } = action.payload;
      const existing = state.items[id];
      if (!existing) return state;

      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        const { [id]: removed, ...rest } = state.items;
        void removed;
        return { ...state, items: rest };
      }

      return {
        ...state,
        items: {
          ...state.items,
          [id]: { ...existing, qty: newQty },
        },
      };
    }
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'OPEN_CART':
      return { ...state, isCartOpen: true };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'CLEAR_CART':
      return { ...state, items: {} };
    case 'INIT_CART':
      return { ...state, items: action.payload.items };
    default:
      return state;
  }
}

interface CartContextProps {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  cartTotal: number;
  /** Discount percentage applied automatically based on quantity (5/10/15%) */
  discountPercent: number;
  /** Amount saved in ₹ */
  discountAmount: number;
  /** Final amount after discount — use this for payments */
  discountedTotal: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('frizly_cart');
      if (savedCart) {
        dispatch({ type: 'INIT_CART', payload: { items: JSON.parse(savedCart) } });
      }
    } catch (e) {
      console.error('Failed to load cart from local storage', e);
    }
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    try {
      localStorage.setItem('frizly_cart', JSON.stringify(state.items));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [state.items]);

  const totalItems = Object.values(state.items).reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const cartTotal = Object.values(state.items).reduce(
    (sum, item) => sum + (item.qty * (item.product.price || 0)),
    0
  );

  // Auto-discount: computed live whenever totalItems changes
  const discountPercent = getAutoDiscount(totalItems);
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const discountedTotal = cartTotal - discountAmount;

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      totalItems,
      cartTotal,
      discountPercent,
      discountAmount,
      discountedTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
