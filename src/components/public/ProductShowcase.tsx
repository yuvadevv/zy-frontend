'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionContainer, SectionHeading } from './SectionContainer';

const MOCKUPS = [
  { id: 'dashboard', title: 'Dashboard', desc: 'See your active orders at a glance.', color: 'bg-blue-500' },
  { id: 'upload', title: 'Upload', desc: 'Seamlessly upload PDFs from any device.', color: 'bg-green-500' },
  { id: 'checkout', title: 'Checkout', desc: 'Fast, secure, and student-friendly pricing.', color: 'bg-purple-500' },
  { id: 'orders', title: 'Orders', desc: 'View all your past prints in one place.', color: 'bg-orange-500' },
  { id: 'tracking', title: 'Tracking', desc: 'Real-time status updates until delivery.', color: 'bg-red-500' },
  { id: 'profile', title: 'Profile', desc: 'Manage your settings and delivery locations.', color: 'bg-teal-500' },
];

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCKUPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeMockup = MOCKUPS[activeIndex];

  return (
    <SectionContainer className="bg-white border-y border-gray-100 overflow-hidden">
      <SectionHeading 
        badge="Product Showcase"
        title="Beautifully Simple." 
        subtitle="A native app experience wrapped in a lightning-fast web platform."
      />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-6xl mx-auto">
        
        {/* Mockups Container */}
        <div className="relative w-full max-w-[600px] h-[400px] sm:h-[500px] flex items-center justify-center">
          
          {/* Laptop Frame (Hidden on mobile) */}
          <div className="hidden sm:block absolute w-[600px] h-[360px] bg-gray-100 rounded-3xl border-8 border-gray-900 shadow-2xl z-10 overflow-hidden ml-[-100px]">
            {/* Top Bar */}
            <div className="h-6 bg-gray-200 border-b border-gray-300 flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            {/* Content Area */}
            <div className="w-full h-full bg-white relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMockup.id + '-desktop'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center text-white ${activeMockup.color}`}
                >
                  <span className="text-4xl font-bold tracking-widest uppercase opacity-20">{activeMockup.title}</span>
                  <span className="mt-4 opacity-80 text-sm">Desktop View Placeholder</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Phone Frame */}
          <div className="absolute right-0 sm:right-0 w-[240px] h-[480px] bg-gray-900 rounded-[3rem] border-[12px] border-gray-900 shadow-2xl z-20 overflow-hidden">
            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-30"></div>
            {/* Content Area */}
            <div className="w-full h-full bg-white relative rounded-[2rem] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMockup.id + '-mobile'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center text-white ${activeMockup.color}`}
                >
                  <span className="text-xl font-bold tracking-widest uppercase opacity-20">{activeMockup.title}</span>
                  <span className="mt-2 opacity-80 text-xs">Mobile View</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Carousel Indicators & Text */}
        <div className="w-full max-w-sm flex flex-col gap-6 relative z-30">
          {MOCKUPS.map((mockup, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={mockup.id} 
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-orange-50 border border-orange-100 shadow-sm' : 'hover:bg-gray-50 border border-transparent'}`}
                onClick={() => setActiveIndex(index)}
              >
                <h4 className={`text-lg font-bold mb-1 transition-colors ${isActive ? 'text-orange-600' : 'text-gray-900'}`}>{mockup.title}</h4>
                <p className={`text-sm transition-colors ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>{mockup.desc}</p>
                
                {/* Progress Bar */}
                {isActive && (
                  <motion.div className="h-1 bg-orange-200 w-full mt-4 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </SectionContainer>
  );
}
