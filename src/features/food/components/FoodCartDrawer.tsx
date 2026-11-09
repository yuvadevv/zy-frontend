'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Store, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useFoodCart } from '../store/useFoodCart';
import { DietaryBadge } from './DietaryBadge';
import { FoodPaymentMethod } from '../types';

interface FoodCartDrawerProps {
  onOrderPlaced: () => void;
}

export const FoodCartDrawer: React.FC<FoodCartDrawerProps> = ({ onOrderPlaced }) => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getGrandTotal,
    vendorName,
    counterLocation,
    placeOrder,
  } = useFoodCart();

  const [paymentMethod, setPaymentMethod] = useState<FoodPaymentMethod>('ONLINE_UPI');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCartDrawerOpen) return null;

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();

  const handleCheckout = () => {
    setIsPlacing(true);
    setTimeout(() => {
      placeOrder(paymentMethod);
      setIsPlacing(false);
      onOrderPlaced();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs select-none">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={closeCartDrawer} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6B00] border border-orange-200/60 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#151515]">
                  Campus Food Cart
                </h2>
                <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                  <Store className="w-3 h-3 text-[#FF6B00]" />
                  <span>{counterLocation || 'Campus Counter'}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 text-xs font-bold text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-gray-100"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCartDrawer}
                className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Your food cart is empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Explore campus meals, curries, pizzas, and rolls to start your order.
                </p>
                <button
                  onClick={closeCartDrawer}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#151515] text-white text-xs font-bold hover:bg-black transition active:scale-95"
                >
                  Explore Food
                </button>
              </div>
            ) : (
              <>
                {/* Outlets note */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-2.5 text-xs">
                  <Info className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900">
                      Preparing at {vendorName || 'Campus Counter'}
                    </span>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-0.5">
                      Direct pickup at {counterLocation || 'the designated counter'}. No delivery delays.
                    </p>
                  </div>
                </div>

                {/* Items list */}
                <div className="flex flex-col divide-y divide-gray-100">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <DietaryBadge type={cartItem.product.dietary} size="sm" />
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {cartItem.product.name}
                          </h4>
                        </div>
                        <span className="text-xs font-black text-[#151515]">
                          ₹{cartItem.totalPrice}
                        </span>
                        {cartItem.notes && (
                          <span className="text-[10px] text-gray-500 italic">
                            Note: {cartItem.notes}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center bg-gray-100 rounded-xl px-1.5 py-1 text-xs font-bold shrink-0">
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-black active:scale-90 transition"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                        <span className="px-2 font-black text-xs min-w-[20px] text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="p-1 text-gray-600 hover:text-black active:scale-90 transition"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2 flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-900">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ONLINE_UPI')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                        paymentMethod === 'ONLINE_UPI'
                          ? 'border-[#FF6B00] bg-orange-50/50 text-[#151515] ring-1 ring-[#FF6B00]'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-4 h-4 text-[#FF6B00]" />
                        {paymentMethod === 'ONLINE_UPI' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                        )}
                      </div>
                      <span className="font-bold text-xs">Pay Online</span>
                      <span className="text-[10px] text-gray-500">UPI / QR Scan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH_AT_COUNTER')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                        paymentMethod === 'CASH_AT_COUNTER'
                          ? 'border-[#FF6B00] bg-orange-50/50 text-[#151515] ring-1 ring-[#FF6B00]'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        {paymentMethod === 'CASH_AT_COUNTER' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                        )}
                      </div>
                      <span className="font-bold text-xs">Pay at Counter</span>
                      <span className="text-[10px] text-gray-500">Cash / UPI on pickup</span>
                    </button>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Items Total</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Counter Pickup</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between font-black text-sm text-[#151515]">
                    <span>To Pay</span>
                    <span className="text-[#FF6B00]">₹{grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-150 shrink-0 flex flex-col gap-2">
              <button
                onClick={handleCheckout}
                disabled={isPlacing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 active:scale-[0.99] transition-all text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-sm shadow-orange-500/25 disabled:opacity-60"
              >
                <span>{isPlacing ? 'Confirming Order...' : 'Place Order'}</span>
                <div className="flex items-center gap-1.5">
                  <span>₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
              <span className="text-[10px] text-center text-gray-500 font-medium">
                Counter pickup only • Instant token generation
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

