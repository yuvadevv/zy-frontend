'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Store, 
  X, 
  ArrowRight,
  ChefHat,
  ShoppingBag
} from 'lucide-react';
import { useFoodCart } from '../store/useFoodCart';

interface FoodOrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoodOrderSuccessModal: React.FC<FoodOrderSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeOrder, clearActiveOrder } = useFoodCart();

  if (!isOpen || !activeOrder) return null;

  const handleDone = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[26px] overflow-hidden shadow-2xl p-5 sm:p-6 border border-gray-150 flex flex-col gap-4 text-center"
        >
          {/* Close button */}
          <button
            onClick={handleDone}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Success Check Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Order Confirmed
            </span>
            <h2 className="text-xl font-black text-[#151515] mt-2">
              Food is being prepared!
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Show your token at the counter when called.
            </p>
          </div>

          {/* Big Token Number Card */}
          <div className="p-4 rounded-2xl bg-[#151515] text-white flex flex-col items-center justify-center gap-1 shadow-lg">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Pickup Token Number
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-wider text-[#FF6B00]">
              {activeOrder.tokenNumber}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300 font-semibold">
              <Store className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{activeOrder.counterLocation}</span>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col gap-2.5 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-[#FF6B00]" />
                <span>Live Kitchen Status</span>
              </span>
              <span className="text-[11px] font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                In Kitchen (~10 mins)
              </span>
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="h-1.5 rounded-full bg-[#FF6B00]" />
              <div className="h-1.5 rounded-full bg-orange-200 animate-pulse" />
              <div className="h-1.5 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold">
              <span className="text-gray-900">1. Placed</span>
              <span className="text-[#FF6B00]">2. Cooking</span>
              <span>3. Ready for Pickup</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="text-left text-xs text-gray-600 bg-gray-50/70 p-3 rounded-xl border border-gray-150 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-bold text-gray-900 text-[11px] border-b border-gray-200/80 pb-1">
              <span>Order Details ({activeOrder.items.length} items)</span>
              <span className="text-[#FF6B00]">₹{activeOrder.grandTotal}</span>
            </div>
            {activeOrder.items.map((item: any, idx: number) => {
              const name = item.product?.name || item.product_name || item.name || `Item ${idx + 1}`;
              const price = item.totalPrice ?? item.item_total ?? item.itemTotal ?? 0;
              return (
                <div key={item.id || idx} className="flex items-center justify-between text-[11px]">
                  <span className="truncate pr-2">
                    {item.quantity} × {name}
                  </span>
                  <span className="font-semibold text-gray-800">
                    ₹{price}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={handleDone}
            className="w-full py-3 px-4 rounded-xl bg-[#151515] hover:bg-black text-white text-xs sm:text-sm font-black transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Back to Food Menu</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

