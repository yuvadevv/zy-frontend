'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FoodProduct, FoodCartItem, FoodOrder, FoodPaymentMethod, CustomizationOption, FoodVendorGroup } from '../types';

interface FoodCartState {
  items: FoodCartItem[];
  vendorId: string | null;
  vendorName: string | null;
  counterLocation: string | null;

  // Conflict modal state (deprecated/no-op in unified multi-counter cart)
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
  getVendorGroups: () => FoodVendorGroup[];
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
        const { items } = get();

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
          isConflictModalOpen: false,
          conflictItem: null,
        });
      },

      confirmVendorSwitch: () => {
        set({ isConflictModalOpen: false, conflictItem: null });
      },

      cancelVendorSwitch: () => {
        set({ isConflictModalOpen: false, conflictItem: null });
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
        const platformFee = 0;
        const tax = 0;
        const grandTotal = subtotal;

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

      getVendorGroups: () => {
        const { items } = get();
        const groupsMap = new Map<string, FoodVendorGroup>();

        for (const item of items) {
          const vId = item.product.vendorId || 'vendor_canteen_stall';
          const vName = item.product.vendorName || (vId === 'vendor_college_mess' ? 'College Mess Dining' : 'Campus Canteen Stall');
          const vLocation = item.product.counterLocation || (vId === 'vendor_college_mess' ? 'Dining Hall Counter' : 'Counter 1 (Main Food Court)');

          if (!groupsMap.has(vId)) {
            groupsMap.set(vId, {
              vendorId: vId,
              vendorName: vName,
              counterLocation: vLocation,
              items: [],
              subtotal: 0,
            });
          }

          const group = groupsMap.get(vId)!;
          group.items.push(item);
          group.subtotal += item.totalPrice;
        }

        return Array.from(groupsMap.values());
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

