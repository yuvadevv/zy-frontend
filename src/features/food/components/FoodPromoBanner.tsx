'use client';

import React from 'react';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const FoodPromoBanner: React.FC = () => {
  return (
    <div className="relative w-full rounded-[22px] overflow-hidden bg-gradient-to-br from-[#181818] via-[#151515] to-[#1a1410] border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-white select-none group">
      {/* Background food imagery with gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/banners/banner_campus_food.webp"
          alt="BLINTZY Fresh Campus Food"
          className="w-full h-full object-cover object-[center_35%] opacity-35 scale-105 group-hover:scale-110 transition-transform duration-700 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#151515] via-[#151515]/85 to-transparent" />
      </div>

      {/* Decorative ambient radial glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF6B00]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 p-4 sm:p-4.5 flex flex-col justify-between min-h-[132px]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B00] text-white shadow-2xs">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>Campus Specials</span>
            </span>
            <span className="text-[10px] font-bold text-orange-300">
              Fast Counter Pickup
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
            Cravings? We've got you. 🍔
          </h2>
          <p className="text-xs text-zinc-300 font-medium mt-1 leading-snug max-w-[280px] sm:max-w-md">
            Skip the lunch rush. Order ahead and pick up directly at the counter.
          </p>
        </div>

        {/* Small CTA & Delivery Promise */}
        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80 text-[10.5px]">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
            <span className="text-[#FF6B00]">⚡</span>
            <span>Hot & Fresh Counter Pickup</span>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-black text-white bg-[#FF6B00] hover:bg-orange-600 active:scale-95 px-3 py-1 rounded-full shadow-2xs transition-all cursor-pointer">
            <span>Order Ahead</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
