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
  offer: string | null;
  offerDetails: any | null;
  deliveryDetails: DeliveryDetails | null;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  applyCoupon: (code: string | null) => Promise<{ success: boolean; error?: string }>;
  applyOffer: (code: string | null) => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => void;
  addItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

import { useProfile } from '@/features/profile/hooks/useProfile';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<CartStateStatus>('loading');
  const [coupon, setCoupon] = useState<string | null>(null);
  const [offer, setOffer] = useState<string | null>(null);
  const [offerDetails, setOfferDetails] = useState<any | null>(null);
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

  const recalculateCart = async (items: CartItem[], currentCoupon?: string | null, currentOffer?: string | null) => {
    try {
      setStatus('loading');
      
      if (items.length === 0) {
        setCart(prev => prev ? { ...prev, items: [], summary: { subtotal: 0, discount: 0, tax: 0, deliveryFee: 0, total: 0 } } : null);
        setStatus('empty');
        return;
      }

      // Mutual exclusivity: if coupon is applied, offer is null; if offer is applied, coupon is null
      let finalCoupon = currentCoupon !== undefined ? currentCoupon : coupon;
      let finalOffer = currentOffer !== undefined ? currentOffer : offer;

      if (finalCoupon) {
        finalOffer = 'NONE'; // Disable offer if coupon is explicitly used
      }

      // We need to map CartItem to the API expected structure
      const apiItems = items.map((item: any) => ({
        serviceType: item.serviceType || item.type,
        manualId: (item.serviceType === 'manual' || item.type === 'manual') ? (item.referenceId || item.id.split('_')[1] || item.id) : undefined,
        documentId: ['hall_ticket', 'custom', 'code_tantra_files'].includes(item.serviceType || item.type) ? (item.referenceId || item.id.split('_')[1] || item.id) : undefined,
        pages: item.printOptions?.pages || item.printOptions?.totalPages || item.config?.pages || item.meta?.totalPages || 0,
        printOptions: {
          copies: item.quantity,
          color: item.printOptions?.color ?? item.config?.color,
          singleSided: item.printOptions?.singleSided ?? item.config?.singleSided,
          bindingType: item.printOptions?.bindingType ?? item.config?.bindingType,
          paperSize: item.printOptions?.paperSize ?? item.config?.paperSize
        }
      }));

      const res = await import('@/lib/api/workerClient').then(m => m.workerClient.calculatePricing({
        items: apiItems,
        deliveryMethod: 'delivery',
        couponCode: finalCoupon || undefined,
        offerCode: finalOffer || undefined
      }));

      // Update cart summary and items with authoritative backend data
      const updatedItems = items.map((item, index) => {
        const apiItem = res.items[index];
        if (apiItem) {
          return {
            ...item,
            priceBreakdown: {
              base: apiItem.unitPrice || 0,
              originalBase: apiItem.originalUnitPrice || apiItem.unitPrice || 0,
              printing: apiItem.printingCost || 0,
              originalPrinting: apiItem.originalPrintingCost || apiItem.printingCost || 0,
              binding: apiItem.bindingCost || 0,
              originalBinding: apiItem.originalBindingCost || apiItem.bindingCost || 0,
              color: 0,
              total: apiItem.subtotal || 0,
              originalTotal: apiItem.originalSubtotal || apiItem.subtotal || 0
            }
          };
        }
        return item;
      });

      const totalDiscount = res.summary.discount || res.summary.couponDiscount || res.summary.offerDiscount || 0;

      setCart(prev => {
        const newSummary = { 
          subtotal: res.summary.subtotal, 
          originalSubtotal: res.summary.originalSubtotal || res.summary.subtotal,
          originalPrintingCost: res.summary.originalPrintingCost || res.summary.printingCost || 0,
          printingCost: res.summary.printingCost || res.summary.subtotal || 0,
          originalBindingCost: res.summary.originalBindingCost || 0,
          bindingCost: res.summary.bindingCost || 0,
          discount: totalDiscount, 
          offerDiscount: res.summary.offerDiscount || 0,
          tax: 0, 
          deliveryFee: res.summary.deliveryFee || 0,
          platformFee: res.summary.platformFee || 0,
          launchSavings: res.summary.launchSavings || 0,
          isLaunchActive: res.summary.isLaunchActive || false,
          appliedOffer: res.appliedOffer || null,
          appliedCoupon: res.appliedCoupon || null,
          previousTotal: prev?.summary?.total !== res.summary.grandTotal ? prev?.summary?.total : prev?.summary?.previousTotal,
          total: res.summary.grandTotal 
        };
        return prev 
          ? { ...prev, items: updatedItems, summary: newSummary }
          : { cartId: `cart_${Date.now()}`, items: updatedItems, summary: newSummary };
      });

      if (res.couponError && finalCoupon) {
        setCoupon(null);
        throw new Error(res.couponError);
      } else {
        setCoupon(res.appliedCoupon || null);
      }

      if (res.offerError && finalOffer && finalOffer !== 'NONE') {
        setOffer(null);
        setOfferDetails(null);
        throw new Error(res.offerError);
      } else {
        setOffer(res.appliedOffer || null);
        setOfferDetails(res.offerDetails || null);
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
    const items = cart.items.filter(i => i.id !== id);
    recalculateCart(items);
  };

  const applyCoupon = async (code: string | null) => {
    if (cart) {
      try {
        // Enforce mutual exclusivity: clearing offer when coupon applied
        await recalculateCart(cart.items, code, 'NONE');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    return { success: false, error: 'Cart is empty' };
  };

  const applyOffer = async (code: string | null) => {
    if (cart) {
      try {
        // Enforce mutual exclusivity: clearing coupon when offer applied
        await recalculateCart(cart.items, null, code || 'NONE');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    return { success: false, error: 'Cart is empty' };
  };

  const addItem = (item: CartItem) => {
    let newItems: CartItem[] = [];
    if (!cart) {
      newItems = [item];
      setCart({
        cartId: `cart_${Date.now()}`,
        items: newItems,
        summary: { subtotal: item.priceBreakdown?.total || 0, discount: 0, tax: 0, deliveryFee: 0, total: item.priceBreakdown?.total || 0 }
      });
    } else {
      const existingItemIndex = cart.items.findIndex(i => i.id === item.id);
      newItems = [...cart.items];
      if (existingItemIndex > -1) {
        newItems[existingItemIndex].quantity += item.quantity;
      } else {
        newItems.push(item);
      }
      
      const tempSubtotal = newItems.reduce((acc, curr) => acc + (curr.priceBreakdown?.total || 0) * curr.quantity, 0);
      setCart(prev => prev ? {
        ...prev,
        items: newItems,
        summary: { ...prev.summary, subtotal: tempSubtotal, total: tempSubtotal + prev.summary.deliveryFee - prev.summary.discount }
      } : null);
    }
    
    recalculateCart(newItems);
  };

  return (
    <CartContext.Provider value={{
      cart,
      status,
      coupon,
      offer,
      offerDetails,
      deliveryDetails,
      setDeliveryDetails: setDeliveryDetailsState,
      updateQuantity,
      removeItem,
      applyCoupon,
      applyOffer,
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
