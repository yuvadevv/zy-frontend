'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { APP_ROUTES } from '@/constants/routes';

export const CampusFoodPromoBanner = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full px-1 select-none"
    >
      <Link
        href={APP_ROUTES.CAMPUS_FOOD}
        className="group relative overflow-hidden rounded-[20px] bg-white border border-orange-200/80 p-2.5 sm:p-3 shadow-[0_2px_10px_rgba(255,107,0,0.04)] hover:shadow-md hover:border-orange-300 transition-all active:scale-[0.99] flex items-center justify-between gap-3"
      >
        {/* Left: Thumbnail & Essential Copy */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 bg-orange-50 border border-orange-100">
            <img
              src="/images/banners/banner_campus_food.webp"
              alt="Campus Food"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#FF6B00] leading-none mb-1">
              COMING SOON · RCE
            </span>

            <h3 className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-[#FF6B00] transition-colors leading-tight truncate">
              Your Campus Cravings 🍕
            </h3>

            <p className="text-[11px] text-gray-500 font-medium leading-tight truncate mt-0.5">
              Your favourites, just a little closer. 😋
            </p>
          </div>
        </div>

        {/* Right: Clean Single CTA Affordance */}
        <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#FF6B00] pl-1 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
          <span className="hidden xs:inline sm:inline">Discover Campus Food</span>
          <span>→</span>
        </div>
      </Link>
    </motion.section>
  );
};
