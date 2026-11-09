'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBootstrapConfig } from '@/features/bootstrap/services/bootstrapService';
import toast from 'react-hot-toast';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Printer, FileText, CheckCircle2, MapPin } from 'lucide-react';
import { publicContent } from '@/config/publicContent';
import { Campus3DHeroCanvas, LandmarkInfo } from './Campus3DHeroCanvas';
import { TiltCard } from './TiltCard';

export function Hero() {
  const { data: bootstrapData } = useQuery({
    queryKey: ['bootstrap'],
    queryFn: fetchBootstrapConfig,
    staleTime: 1000 * 60,
  });
  const isComingSoon = bootstrapData?.data?.coming_soon;

  const handleRestrictedAction = (e: React.MouseEvent) => {
    if (isComingSoon) {
      e.preventDefault();
      toast('This feature is currently disabled during Coming Soon mode.', { icon: '🔒' });
    }
  };

  const [activeLandmark, setActiveLandmark] = useState<LandmarkInfo | null>(null);

  // Scroll Progress link for non-intrusive camera translation
  const { scrollYProgress } = useScroll();
  const campusScroll = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const [scrollVal, setScrollVal] = useState(0);

  React.useEffect(() => {
    return campusScroll.on('change', (v) => setScrollVal(v));
  }, [campusScroll]);

  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-white">
      {/* 1. Full-Bleed Interactive 3D Digital Campus Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-0">
        <Campus3DHeroCanvas
          onHoverLandmark={setActiveLandmark}
          scrollProgress={scrollVal}
        />
      </div>

      {/* 2. Soft Directional Gradient Masks to Guarantee 100% Typography Readability */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-white via-white/92 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      {/* 3. Hero Content Container */}
      <div className="container mx-auto px-6 max-w-7xl relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines, Trust Points, and Actions */}
          <div className="lg:col-span-7 flex flex-col items-start pt-4 lg:pt-0">
            {/* Brand Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                {publicContent.hero.badge}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight leading-[1.08] mb-4"
            >
              {publicContent.hero.heading}{' '}
              <span className="text-[#FF6B00] inline-block">
                {publicContent.hero.headingHighlight}
              </span>
            </motion.h1>

            {/* Supporting Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-xl sm:text-2xl font-bold text-[#171717] mb-4 tracking-tight"
            >
              {publicContent.hero.subheadingHeadline}
            </motion.h2>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#737373] leading-relaxed max-w-xl mb-7 font-normal"
            >
              {publicContent.hero.subheading}
            </motion.p>

            {/* Live Service Availability Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-2 mb-8"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Print & Documents (Available)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <span>Campus Food</span>
                <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded font-bold uppercase">Soon</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
                <span>Bus Schedules</span>
                <span className="text-[10px] bg-sky-200/80 px-1.5 py-0.2 rounded font-bold uppercase">Soon</span>
              </div>
            </motion.div>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-9"
            >
              <Link
                href="/app/login"
                onClick={handleRestrictedAction}
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-7 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,107,0,0.35)] transition-all hover:bg-[#e05e00] hover:shadow-[0_6px_25px_rgba(255,107,0,0.45)] active:scale-95"
              >
                <span>{publicContent.hero.primaryCTA}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-[#EAEAEA] bg-white/80 backdrop-blur-sm px-6 text-sm font-semibold text-[#171717] transition-all hover:bg-white hover:border-[#FF6B00]/40 active:scale-95 shadow-xs"
              >
                <span>{publicContent.hero.secondaryCTA}</span>
              </a>
            </motion.div>

            {/* Honest Product Guarantees (No Unverified Claims) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 pt-5 border-t border-[#EAEAEA]/80 text-xs font-medium text-[#737373]"
            >
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>PDF Cloud Upload</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Classroom Desk Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Transparent Per-Page Pricing</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Supporting Floating 3D Smartphone (Complements the 3D Campus) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center relative">
            <TiltCard
              maxRotation={8}
              perspective={1200}
              glareOpacity={0.12}
              className="w-full max-w-[340px]"
            >
              {/* Smartphone Frame (Titanium finish with authentic BLINTZY student app interface) */}
              <div className="relative rounded-[2.5rem] bg-[#171717] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border-[3px] border-[#2E2E2E]">
                {/* Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>

                {/* Inner Screen */}
                <div className="relative rounded-[2rem] bg-white overflow-hidden pt-8 pb-5 px-4 text-[#171717] select-none border border-gray-100">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#171717] mb-3 px-1">
                    <span>9:41</span>
                    <span className="text-[10px] text-[#737373]">BLINTZY Campus</span>
                  </div>

                  {/* Student App Header Preview */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <div>
                      <div className="text-[10px] text-[#737373] font-medium">Delivering To</div>
                      <div className="text-xs font-bold text-[#171717] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF6B00]" />
                        <span>Room SH-101 • C-Block</span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      B
                    </div>
                  </div>

                  {/* Authentic Quick Services Grid from Student App */}
                  <div className="text-[11px] font-bold text-[#171717] mb-2">Available Services</div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-[#F7F7F5] p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <div className="w-6 h-6 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] mb-2">
                        <Printer className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[11px] font-bold">Custom Prints</div>
                      <div className="text-[9px] text-[#737373]">Upload PDF</div>
                    </div>
                    <div className="bg-[#F7F7F5] p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[11px] font-bold">Lab Manuals</div>
                      <div className="text-[9px] text-[#737373]">Branch records</div>
                    </div>
                  </div>

                  {/* Live Order Card Preview */}
                  <div className="bg-gradient-to-br from-[#FFF8F2] to-white p-3 rounded-xl border border-[#FF6B00]/20">
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span className="text-[#171717]">Order #BZ-4108</span>
                      <span className="text-[#FF6B00]">Printing &bull; In Progress</span>
                    </div>
                    <div className="text-[10px] text-[#737373] mb-2">
                      12 Pages &bull; Duplex &bull; Spiral Bound
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF6B00] h-full w-2/3 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Hint Tag */}
            <div className="mt-4 text-[11px] font-semibold text-[#737373] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#EAEAEA] shadow-xs">
              ✦ Move cursor to explore interactive campus landmarks
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
