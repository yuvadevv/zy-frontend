'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, Tag, Flame, Music2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { workerClient } from '@/lib/api/workerClient';

export const CampusFestHero = () => {
  const shouldReduceMotion = useReducedMotion();

  // Fetch active verified offers to dynamically render valid claim info
  const { data: offersData } = useQuery({
    queryKey: ['public_offers_hero'],
    queryFn: () => workerClient.getOffers(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const activeOffer = offersData?.offers?.[0];
  const discountDisplay = activeOffer 
    ? (activeOffer.discount_type === 'percentage' ? `${activeOffer.discount_value}% OFF` : `₹${activeOffer.discount_value} OFF`)
    : 'Campus Fest Special';

  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B00] via-[#F25C00] to-[#C83E00] p-6 text-white shadow-xl shadow-orange-950/10 mx-1 border border-orange-400/20"
    >
      {/* Dandiya Sticks & Festive Geometric Motifs (SVG Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        {/* Subtle Diya / Warm Festive Light Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-300/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-12 w-52 h-52 bg-yellow-400/20 rounded-full blur-3xl" />
        
        {/* Crossed Dandiya sticks vector */}
        <svg 
          className="absolute -right-6 -bottom-6 w-52 h-52 text-white/30" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dandiya Stick 1 */}
          <line x1="30" y1="180" x2="170" y2="40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <line x1="50" y1="160" x2="65" y2="145" stroke="#FFE484" strokeWidth="10" strokeLinecap="round" />
          <line x1="135" y1="75" x2="150" y2="60" stroke="#FFE484" strokeWidth="10" strokeLinecap="round" />
          
          {/* Dandiya Stick 2 (Crossed) */}
          <line x1="170" y1="180" x2="30" y2="40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <line x1="150" y1="160" x2="135" y2="145" stroke="#FFE484" strokeWidth="10" strokeLinecap="round" />
          <line x1="65" y1="75" x2="50" y2="60" stroke="#FFE484" strokeWidth="10" strokeLinecap="round" />

          {/* Festive geometric mandala ring */}
          <circle cx="100" cy="110" r="42" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="100" cy="110" r="26" stroke="#FFE484" strokeWidth="1.5" />
        </svg>

        {/* Dussehra / Navratri Arch Dots pattern */}
        <div className="absolute top-3 left-1/3 flex gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-200/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-200/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-200/50" />
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        {/* Festive Badge with restrained Amber/Gold Accents */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-amber-100 border border-amber-200/20 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Dussehra & Campus Fest 2026
          </span>
          <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-bold text-amber-200/90">
            <Music2 className="w-3 h-3 text-amber-300" /> Dandiya Season
          </span>
        </div>

        {/* Main Headline & Offer Value */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-[1.15] text-white">
            {discountDisplay}
            <span className="block text-lg sm:text-xl font-bold text-amber-100/95 tracking-normal mt-0.5">
              on student printing & lab manuals
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1.5 max-w-[280px] leading-relaxed font-medium">
            Celebrate the festive rhythm! Instant discounts applied automatically during checkout.
          </p>
        </div>

        {/* Action Button & Offer validity indicator */}
        <div className="pt-2 flex items-center gap-3">
          <Link 
            href="/app/offers" 
            className="inline-flex items-center justify-center gap-2 bg-white text-[#FF6B00] font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-950/20 hover:bg-orange-50 active:scale-95 transition-all text-sm group"
          >
            <Tag className="w-4 h-4 text-[#FF6B00]" />
            <span>Explore Offers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Limited Festive Window
            </span>
            <span className="text-[11px] font-medium text-white/80">
              Verified campus pricing
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
