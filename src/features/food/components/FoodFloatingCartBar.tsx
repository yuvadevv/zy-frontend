'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useFoodCart } from '../store/useFoodCart';
import { APP_ROUTES } from '@/constants/routes';

export const FoodFloatingCartBar: React.FC = () => {
  const router = useRouter();
  const { getTotalCount, getGrandTotal, counterLocation } = useFoodCart();
  const totalCount = getTotalCount();
  const grandTotal = getGrandTotal();

  if (totalCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 select-none"
      >
        <button
          onClick={() => router.push(APP_ROUTES.FOOD.CART)}
          className="w-full bg-[#151515] hover:bg-black text-white p-3 sm:py-3.5 sm:px-4 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-zinc-700/80 flex items-center justify-between gap-3 active:scale-[0.99] transition-all cursor-pointer"
          aria-label="View Food Cart"
        >
          {/* Left: Cart Info & Counter */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-xs font-black text-[#FF6B00]">
                  ₹{grandTotal}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium truncate">
                {counterLocation || 'Counter Pickup'}
              </span>
            </div>
          </div>

          {/* Right: CTA Arrow */}
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00] stroke-[2.5]" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

