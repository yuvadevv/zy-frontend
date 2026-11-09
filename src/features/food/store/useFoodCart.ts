'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FoodProduct, FoodCartItem, FoodOrder, FoodPaymentMethod, CustomizationOption } from '../types';

interface FoodCartState {
  items: FoodCartItem[];
  vendorId: string | null;
  vendorName: string | null;
  counterLocation: string | null;

  // Conflict modal state when student adds an item from a different vendor
  conflictItem: FoodProduct | null;
  isConflictModalOpen: boolean;

  // Cart Drawer open/close state
  isCartDrawerOpen: boolean;

  // Active / Last placed order
  activeOrder: FoodOrder | null;
  orderHistory: FoodOrder[];

  // Actions
  addItem: (product: FoodProduct, quantity?: number, selectedOptions?: Record<string, CustomizationOption>, notes?: string) => void;
  confirmVendorSwitch: () => void;
  cancelVendorSwitch: () => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  placeOrder: (paymentMethod: FoodPaymentMethod) => FoodOrder;
  setActiveOrder: (order: FoodOrder) => void;
  clearActiveOrder: () => void;

  // Computeds
  getItemQuantity: (productId: string) => number;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getGrandTotal: () => number;
}

export const useFoodCart = create<FoodCartState>()(
  persist(
    (set, get) => ({
      items: [],
      vendorId: null,
      vendorName: null,
      counterLocation: null,
      conflictItem: null,
      isConflictModalOpen: false,
      isCartDrawerOpen: false,
      activeOrder: null,
      orderHistory: [],

      addItem: (product, quantity = 1, selectedOptions, notes) => {
        const { items, vendorId } = get();

        // 1. If cart has items from another vendor, trigger conflict modal
        if (items.length > 0 && vendorId && vendorId !== product.vendorId) {
          set({
            conflictItem: product,
            isConflictModalOpen: true,
          });
          return;
        }

        // Calculate unit price with options
        let extraOptionsPrice = 0;
        if (selectedOptions) {
          Object.values(selectedOptions).forEach((opt) => {
            extraOptionsPrice += opt.extraPrice || 0;
          });
        }
        const unitPrice = product.price + extraOptionsPrice;

        // Generate cart item key based on product id
        const cartItemId = `${product.id}`;

        const existingIndex = items.findIndex((item) => item.id === cartItemId);

        let newItems: FoodCartItem[];
        if (existingIndex > -1) {
          newItems = [...items];
          const newQty = newItems[existingIndex].quantity + quantity;
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newQty,
            totalPrice: newQty * unitPrice,
          };
        } else {
          const newItem: FoodCartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            quantity,
            selectedOptions,
            notes,
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
          newItems = [...items, newItem];
        }

        set({
          items: newItems,
          vendorId: product.vendorId,
          vendorName: product.vendorName,
          counterLocation: product.counterLocation,
        });
      },

      confirmVendorSwitch: () => {
        const { conflictItem } = get();
        if (!conflictItem) {
          set({ isConflictModalOpen: false, conflictItem: null });
          return;
        }

        const unitPrice = conflictItem.price;
        const newItem: FoodCartItem = {
          id: `${conflictItem.id}`,
          productId: conflictItem.id,
          product: conflictItem,
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice,
        };

        set({
          items: [newItem],
          vendorId: conflictItem.vendorId,
          vendorName: conflictItem.vendorName,
          counterLocation: conflictItem.counterLocation,
          conflictItem: null,
          isConflictModalOpen: false,
        });
      },

      cancelVendorSwitch: () => {
        set({
          conflictItem: null,
          isConflictModalOpen: false,
        });
      },

      updateQuantity: (cartItemId, newQuantity) => {
        const { items } = get();
        if (newQuantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        const newItems = items.map((item) => {
          if (item.id === cartItemId) {
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity,
            };
          }
          return item;
        });

        set({ items: newItems });
      },

      removeItem: (cartItemId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== cartItemId);
        if (newItems.length === 0) {
          set({
            items: [],
            vendorId: null,
            vendorName: null,
            counterLocation: null,
          });
        } else {
          set({ items: newItems });
        }
      },

      clearCart: () => {
        set({
          items: [],
          vendorId: null,
          vendorName: null,
          counterLocation: null,
          conflictItem: null,
          isConflictModalOpen: false,
        });
      },

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      placeOrder: (paymentMethod) => {
        const { items, vendorId, vendorName, counterLocation, orderHistory } = get();
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const platformFee = 0; // Direct campus counter pickup - zero extra fees
        const tax = 0; // Authentic campus dining prices are all-inclusive
        const grandTotal = subtotal;

        // Generate counter pickup token like #F-108
        const randomNum = Math.floor(100 + Math.random() * 900);
        const tokenNumber = `#F-${randomNum}`;
        const orderId = `BLZ-FOOD-${Date.now().toString().slice(-6)}`;

        const order: FoodOrder = {
          orderId,
          tokenNumber,
          vendorId: vendorId || 'unknown',
          vendorName: vendorName || 'Campus Counter',
          counterLocation: counterLocation || 'Main Counter',
          items: [...items],
          subtotal,
          platformFee,
          tax,
          grandTotal,
          paymentMethod,
          paymentStatus: paymentMethod === 'ONLINE_UPI' ? 'PAID' : 'PENDING_AT_COUNTER',
          status: 'PLACED',
          createdAt: Date.now(),
          estimatedPickupMinutes: 10,
        };

        set({
          activeOrder: order,
          orderHistory: [order, ...orderHistory],
          items: [],
          vendorId: null,
          vendorName: null,
          counterLocation: null,
          isCartDrawerOpen: false,
        });

        return order;
      },

      setActiveOrder: (order) => {
        const { orderHistory } = get();
        set({
          activeOrder: order,
          orderHistory: [
            order,
            ...orderHistory.filter(
              (o) =>
                (o.id || o.orderId || o.orderNumber) !==
                (order.id || order.orderId || order.orderNumber)
            ),
          ],
          items: [],
          vendorId: null,
          vendorName: null,
          counterLocation: null,
          isCartDrawerOpen: false,
        });
      },

      clearActiveOrder: () => set({ activeOrder: null }),

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getGrandTotal: () => {
        return get().getSubtotal();
      },
    }),
    {
      name: 'blintzy_food_cart_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        vendorId: state.vendorId,
        vendorName: state.vendorName,
        counterLocation: state.counterLocation,
        activeOrder: state.activeOrder,
        orderHistory: state.orderHistory,
      }),
    }
  )
);

