'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Award 
} from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

interface BannerSlide {
  id: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  bgGradient: string;
  icon: React.ElementType;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'launch-rates',
    tag: 'CAMPUS FEST 2026',
    badge: '30% OFF',
    title: 'Flat Festival Printing Rates',
    subtitle: 'B&W Double ₹3.50/sheet • Single ₹2.50 • Colour ₹8.00 • Spiral ₹30',
    ctaText: 'Claim Offers',
    ctaHref: APP_ROUTES.OFFERS,
    bgGradient: 'from-[#FF6B00] via-[#FF7A1A] to-[#FF8C33]',
    icon: Sparkles
  },
  {
    id: 'refer-rewards',
    tag: 'PEER REFERRALS',
    badge: 'FREE PRINTS',
    title: 'Invite Classmates & Earn',
    subtitle: 'Get instant wallet rewards on every verified qualifying print order.',
    ctaText: 'Get Referral Code',
    ctaHref: APP_ROUTES.REFER,
    bgGradient: 'from-[#059669] via-[#10B981] to-[#34D399]',
    icon: Gift
  },
  {
    id: 'ambassador-cup',
    tag: 'CAMPUS LEADERSHIP',
    badge: 'TOP 3 SELECTION',
    title: 'Campus Ambassador Programme',
    subtitle: 'Represent your college branch with official appointments & perks.',
    ctaText: 'Join Programme',
    ctaHref: APP_ROUTES.AMBASSADOR,
    bgGradient: 'from-[#4F46E5] via-[#6366F1] to-[#818CF8]',
    icon: Award
  }
];

export const CampusFestBannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);

  // Auto-slide interval (pauses while dragging)
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    const swipeThreshold = 40;
    const velocityThreshold = 200;

    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Banner Viewport */}
      <div className="relative w-full overflow-hidden rounded-[26px] shadow-lg shadow-orange-950/10 cursor-grab active:cursor-grabbing select-none">
        {/* Horizontal Sliding Track with Full Touch Drag */}
        <motion.div
          className="flex w-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {BANNERS.map((banner) => {
            const Icon = banner.icon;
            return (
              <div
                key={banner.id}
                className={`w-full shrink-0 relative overflow-hidden bg-gradient-to-r ${banner.bgGradient} p-5 sm:p-6 text-white min-h-[195px] flex flex-col justify-between`}
              >
                {/* Pure Translucent White Glows - No Black Shades */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

                {/* Top Row: Tag & Badge */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                    <Icon className="w-3.5 h-3.5 text-white" />
                    <span>{banner.tag}</span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-gray-900 shadow-sm">
                    {banner.badge}
                  </span>
                </div>

                {/* Center Content: Clean Typography */}
                <div className="relative z-10 my-auto py-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-xs">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-white/95 font-medium mt-1 leading-snug max-w-sm">
                    {banner.subtitle}
                  </p>
                </div>

                {/* Bottom Row: Direct Action Button */}
                <div className="relative z-10 pt-2 flex items-center justify-between border-t border-white/20">
                  <Link
                    href={banner.ctaHref}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-900 hover:bg-white/95 text-xs font-black transition-all shadow-sm active:scale-95 group"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Slide Indicator Dots Below the Banner */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to banner slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-6 bg-[#FF6B00]' 
                : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
