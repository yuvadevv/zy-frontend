"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, CartStateStatus } from '../types';
import { PrintConfig } from '@/features/manuals/types';
import { TAX_RATE } from '../constants';

export interface DeliveryDetails {
  building: string;
  roomNumber: string;
}

interface CartContextType {
  cart: Cart | null;
  status: CartStateStatus;
  coupon: string | null;
  deliveryDetails: DeliveryDetails | null;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  applyCoupon: (code: string | null) => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => void;
  addItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

import { useProfile } from '@/features/profile/hooks/useProfile';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<CartStateStatus>('loading');
  const [coupon, setCoupon] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetailsState] = useState<DeliveryDetails | null>(null);
  const { academic, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    if (!isProfileLoading && academic && !deliveryDetails) {
      setDeliveryDetailsState({
        building: academic.branchName || 'Main Block',
        roomNumber: academic.classroomNumber || academic.section || 'N/A'
      });
    }
  }, [academic, isProfileLoading]);

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

  const recalculateCart = async (items: CartItem[], currentCoupon?: string | null) => {
    try {
      setStatus('loading');
      
      if (items.length === 0) {
        setCart(prev => prev ? { ...prev, items: [], summary: { subtotal: 0, discount: 0, tax: 0, deliveryFee: 0, total: 0 } } : null);
        setStatus('empty');
        return;
      }

      // We need to map CartItem to the API expected structure
      const apiItems = items.map((item: any) => ({
        serviceType: item.serviceType || item.type,
        manualId: (item.serviceType === 'manual' || item.type === 'manual') ? (item.referenceId || item.id.split('_')[1] || item.id) : undefined,
        documentId: ((item.serviceType || item.type) === 'hall_ticket' || (item.serviceType || item.type) === 'custom') ? (item.referenceId || item.id.split('_')[1] || item.id) : undefined,
        pages: item.printOptions?.pages || item.config?.pages || 0,
        printOptions: {
          copies: item.quantity,
          color: item.printOptions?.color ?? item.config?.color,
          singleSided: item.printOptions?.singleSided ?? item.config?.singleSided,
          bindingType: item.printOptions?.bindingType ?? item.config?.bindingType,
          paperSize: item.printOptions?.paperSize ?? item.config?.paperSize
        }
      }));

      const finalCoupon = currentCoupon !== undefined ? currentCoupon : coupon;

      const res = await import('@/lib/api/workerClient').then(m => m.workerClient.calculatePricing({
        items: apiItems,
        deliveryMethod: 'delivery',
        couponCode: finalCoupon
      }));

      // Update cart summary with authoritative backend data
      setCart(prev => {
        const newSummary = { 
          subtotal: res.summary.subtotal, 
          discount: res.summary.couponDiscount || 0, 
          tax: 0, 
          deliveryFee: res.summary.deliveryFee || 0, 
          total: res.summary.grandTotal 
        };
        return prev 
          ? { ...prev, items, summary: newSummary }
          : { cartId: `cart_${Date.now()}`, items, summary: newSummary };
      });

      if (res.couponError && finalCoupon) {
        setCoupon(null);
        // Will need to handle error in CouponSection directly, but for now we reset the invalid coupon
        throw new Error(res.couponError);
      } else {
        setCoupon(res.appliedCoupon || null);
      }

      setStatus('success');
    } catch (err) {
      console.error('Failed to recalculate cart:', err);
      setStatus('error');
      throw err;
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

  const applyCoupon = async (code: string | null) => {
    if (cart) {
      try {
        await recalculateCart(cart.items, code);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    return { success: false, error: 'Cart is empty' };
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
      coupon,
      deliveryDetails,
      setDeliveryDetails: setDeliveryDetailsState,
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
