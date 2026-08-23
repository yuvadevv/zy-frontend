// src/features/order-history/components/OrderHistorySkeleton.tsx
import React from 'react';

import { motion } from 'framer-motion';

export const OrderHistorySkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4 px-5 pt-2 pb-24"
    >
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white border border-gray-100 rounded-[24px] p-5 flex flex-col gap-4 relative overflow-hidden">
          {/* Shimmer Effect */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 z-10 w-[50%] bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg]"
          />
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 w-1/2">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex flex-col gap-1.5 w-full">
                <div className="h-4 bg-gray-100 rounded-md w-[80%]" />
                <div className="h-3 bg-gray-50 rounded-md w-[50%]" />
              </div>
            </div>
            <div className="h-7 bg-gray-100 rounded-full w-[80px]" />
          </div>
          
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded-sm" />
              <div className="h-3 bg-gray-50 rounded-md w-[70%]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded-sm" />
              <div className="h-3 bg-gray-50 rounded-md w-[40%]" />
            </div>
          </div>
          
          <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-1">
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 bg-gray-100 rounded w-8" />
              <div className="h-5 bg-gray-200 rounded-md w-16" />
            </div>
            <div className="h-8 bg-gray-100 rounded-full w-24" />
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export const PaginationLoader = () => (
  <div className="w-full flex justify-center py-6 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);
