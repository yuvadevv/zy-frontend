"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const BusTrackingCard = () => {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center overflow-hidden relative">
      <div className="w-[64px] h-[64px] bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3">
        <span className="text-[36px]">🚌</span>
      </div>
      <h3 className="text-[17px] font-black text-gray-900 mb-1 leading-tight">Live College Bus Tracking</h3>
      
      <p className="text-[13px] font-medium text-gray-500 mb-6 max-w-[200px] leading-tight">
        Know exactly when your college bus arrives.
      </p>

      {/* Animation Track */}
      <div className="w-full max-w-[240px] flex items-center relative mb-5">
        {/* Dotted Line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-[3px] border-dashed border-gray-200" />
        
        {/* Animated Bus */}
        <motion.div
          animate={{ left: ["-10%", "90%"] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
          className="absolute z-10 bg-white px-1 -translate-y-1/2 top-1/2"
        >
          <span className="text-[22px] drop-shadow-sm">🚌</span>
        </motion.div>
        
        {/* Destination Pin */}
        <div className="absolute right-0 z-10 bg-white px-1 -translate-y-[65%] top-1/2">
          <span className="text-[22px] drop-shadow-sm">📍</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
      </div>
    </div>
  );
};
