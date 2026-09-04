"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, CartStateStatus } from '../types';
import { PrintConfig } from '@/features/manuals/types';
import { TAX_RATE } from '../constants';

interface CartContextType {
  cart: Cart | null;
  status: CartStateStatus;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  applyCoupon: (code: string) => void;
  refreshCart: () => void;
  addItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<CartStateStatus>('loading');
  const [coupon, setCoupon] = useState<string | null>(null);

  const fetchCart = () => {
    setStatus('loading');
    setTimeout(() => {
      // Simulate API call or local storage load
      const initialCart: Cart = { cartId: `cart_${Date.now()}`, items: [], summary: { subtotal: 0, discount: 0, tax: 0, deliveryFee: 0, total: 0 } };
      setCart(initialCart);
      setStatus('empty');
    }, 100);
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchCart();
  }, []);

  const recalculateCart = (items: CartItem[]) => {
    let subtotal = 0;
    const updatedItems = items.map(item => {
      // The total is already calculated when the item is added and stored in priceBreakdown
      // We only multiply by quantity if we are supporting multiple identical items via cart
      // For BLINTZY, copies are inside config, so quantity is usually 1.
      subtotal += item.priceBreakdown.total * item.quantity;
      return item;
    });

    const discount = coupon ? subtotal * 0.1 : 0;
    const discountedTotal = subtotal - discount;
    const tax = 0; // Removing tax to match unified pricing display
    const grandTotal = discountedTotal + tax;

    setCart(prev => {
      const newSummary = { subtotal, discount, tax, deliveryFee: 0, total: grandTotal };
      return prev 
        ? { ...prev, items: updatedItems, summary: newSummary }
        : { cartId: `cart_${Date.now()}`, items: updatedItems, summary: newSummary };
    });
    
    if (updatedItems.length === 0) {
      setStatus('empty');
    } else {
      setStatus('success');
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (!cart) return;
    const items = cart.items.map(item => item.id === id ? { ...item, quantity } : item);
    recalculateCart(items);
  };

  const removeItem = (id: string) => {
    if (!cart) return;
    // Remove item logic
    const items = cart.items.filter(i => i.id !== id);
    recalculateCart(items);
  };

  const applyCoupon = (code: string) => {
    setCoupon(code);
    if (cart) recalculateCart(cart.items);
  };

  const addItem = (item: CartItem) => {
    if (!cart) {
      // Create new cart if null
      recalculateCart([item]);
      return;
    }
    const existingItemIndex = cart.items.findIndex(i => i.id === item.id);
    let newItems = [...cart.items];
    if (existingItemIndex > -1) {
      newItems[existingItemIndex].quantity += item.quantity;
    } else {
      newItems.push(item);
    }
    recalculateCart(newItems);
  };

  return (
    <CartContext.Provider value={{
      cart,
      status,
      updateQuantity,
      removeItem,
      applyCoupon,
      refreshCart: fetchCart,
      addItem
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
