'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Laptop, FileText, Printer, Package, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import { publicContent } from '@/config/publicContent';
import { staggerContainer, fadeInUp, fadeIn, scaleUp } from './animations';

const FloatingElement = ({ children, delay = 0, yOffset = 15, duration = 4 }: any) => (
  <motion.div
    animate={{ y: [0, -yOffset, 0] }}
    transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export function Hero() {
  const { badge, heading, headingHighlight, subheading, primaryCTA, secondaryCTA } = publicContent.hero;

  return (
    <section className="relative min-h-[90dvh] pt-28 pb-16 overflow-hidden flex items-center bg-gray-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-400/20 blur-[100px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/20 blur-[100px]" 
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start text-left"
          >
            
            <motion.div variants={fadeInUp} className="mb-6">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                {heading} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                  {headingHighlight}
                </span>
              </h1>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              {subheading}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/app/login"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 text-base font-bold text-white shadow-[0_8px_30px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(249,115,22,0.4)] active:scale-95"
              >
                {primaryCTA}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#demo"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 text-base font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                {secondaryCTA}
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Animated Ecosystem */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative h-[600px] w-full hidden lg:block"
          >
            {/* Base platform line */}
            <div className="absolute bottom-20 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Ecosystem Nodes */}
            
            {/* 1. Upload */}
            <div className="absolute left-[10%] top-[30%]">
              <FloatingElement delay={0} yOffset={10} duration={3}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100 relative z-10 group hover:border-orange-500 transition-colors">
                    <Laptop className="w-10 h-10 text-gray-700 group-hover:text-orange-500 transition-colors" />
                    {/* Small PDF flying out */}
                    <motion.div 
                      animate={{ x: [0, 80], y: [0, -30], opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 1 }}
                      className="absolute right-0 top-0 bg-red-100 p-1.5 rounded-md shadow-sm"
                    >
                      <FileText className="w-4 h-4 text-red-500" />
                    </motion.div>
                  </div>
                  <span className="text-sm font-semibold text-gray-500">Upload</span>
                </div>
              </FloatingElement>
            </div>

            {/* Connecting Arc 1 */}
            <svg className="absolute left-[20%] top-[25%] w-[150px] h-[100px] pointer-events-none" style={{ zIndex: 0 }}>
              <motion.path 
                d="M 10 70 Q 75 10 140 70" 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="2" 
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="opacity-40"
              />
            </svg>

            {/* 2. Print */}
            <div className="absolute left-[40%] top-[40%]">
              <FloatingElement delay={1} yOffset={15} duration={4}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-3xl bg-orange-500 shadow-[0_10px_40px_rgba(249,115,22,0.3)] flex items-center justify-center relative z-10">
                    <Printer className="w-12 h-12 text-white" />
                    {/* Printing paper animation */}
                    <motion.div 
                      animate={{ y: [-10, 20], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute bottom-[-15px] bg-white w-10 h-12 shadow-sm rounded-sm border border-gray-200"
                    />
                  </div>
                  <span className="text-sm font-bold text-orange-600">Vendor Prints</span>
                </div>
              </FloatingElement>
            </div>

            {/* Connecting Arc 2 */}
            <svg className="absolute left-[55%] top-[35%] w-[150px] h-[100px] pointer-events-none" style={{ zIndex: 0 }}>
              <motion.path 
                d="M 10 70 Q 75 10 140 30" 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="2" 
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="opacity-40"
              />
            </svg>

            {/* 3. Delivery */}
            <div className="absolute right-[10%] top-[15%]">
              <FloatingElement delay={0.5} yOffset={12} duration={3.5}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100 relative z-10 group hover:border-orange-500 transition-colors">
                    <Package className="w-10 h-10 text-gray-700 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500">Packaging</span>
                </div>
              </FloatingElement>
            </div>

            {/* Connecting Arc 3 */}
            <svg className="absolute right-[15%] top-[30%] w-[50px] h-[150px] pointer-events-none" style={{ zIndex: 0 }}>
              <motion.path 
                d="M 20 10 Q 50 75 20 140" 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="2" 
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="opacity-40"
              />
            </svg>

            {/* 4. Classroom */}
            <div className="absolute right-[15%] bottom-[15%]">
              <FloatingElement delay={1.5} yOffset={8} duration={3}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-3xl bg-gray-900 shadow-2xl flex items-center justify-center relative z-10">
                    <GraduationCap className="w-12 h-12 text-white" />
                    {/* Location pin popping up */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -top-4 -right-2 bg-orange-500 p-2 rounded-full shadow-lg border-2 border-white"
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">Classroom Delivery</span>
                </div>
              </FloatingElement>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
