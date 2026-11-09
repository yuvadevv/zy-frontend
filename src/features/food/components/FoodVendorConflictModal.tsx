'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { useFoodCart } from '../store/useFoodCart';

export const FoodVendorConflictModal: React.FC = () => {
  const {
    isConflictModalOpen,
    conflictItem,
    vendorName,
    counterLocation,
    confirmVendorSwitch,
    cancelVendorSwitch,
  } = useFoodCart();

  if (!isConflictModalOpen || !conflictItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl p-5 border border-gray-150 flex flex-col gap-4"
        >
          {/* Header Icon & Dismiss */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <button
              onClick={cancelVendorSwitch}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-base font-black text-[#151515] leading-snug">
              Order from a different counter?
            </h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5">
              Your cart currently contains food from{' '}
              <strong className="text-gray-900 font-bold">
                {vendorName || 'another counter'} ({counterLocation || 'Counter'})
              </strong>
              .
            </p>
            <div className="mt-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] text-gray-600 leading-relaxed font-medium">
              Because food is freshly prepared at separate campus counters, orders must be placed and collected from one counter at a time.
            </div>
          </div>

          {/* New Item preview */}
          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/70 flex items-center justify-between text-xs">
            <div className="min-w-0">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#FF6B00]">
                New Counter Item
              </span>
              <p className="font-bold text-gray-900 truncate">
                {conflictItem.name}
              </p>
              <span className="text-[10px] text-gray-500 font-medium">
                {conflictItem.counterLocation}
              </span>
            </div>
            <span className="text-xs font-black text-[#151515] shrink-0 pl-2">
              ₹{conflictItem.price}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={cancelVendorSwitch}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition active:scale-95"
            >
              Keep Current Cart
            </button>
            <button
              onClick={confirmVendorSwitch}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black shadow-sm shadow-orange-500/25 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace & Add</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

