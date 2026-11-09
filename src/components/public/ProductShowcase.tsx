'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileText,
  Shield,
  Smartphone
} from 'lucide-react';
import { TiltCard } from './TiltCard';

interface ShowcaseStep {
  id: string;
  badge: string;
  title: string;
  desc: string;
  screenTitle: string;
  screenSubtitle: string;
  renderScreen: () => React.ReactNode;
}

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const steps: ShowcaseStep[] = [
    {
      id: 'upload',
      badge: 'Step 1 • Document Ingestion',
      title: 'Seamless PDF Upload',
      desc: 'Select or drag-and-drop academic PDFs, lab manuals, or hall tickets from your smartphone or laptop. Automatic page count and layout verification in seconds.',
      screenTitle: 'Upload Documents',
      screenSubtitle: 'PDF Files Supported',
      renderScreen: () => (
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            <div className="p-4 rounded-2xl border-2 border-dashed border-[#FF6B00]/40 bg-orange-50/50 flex flex-col items-center justify-center text-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center mb-2 shadow-xs">
                <FileUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#171717]">Operating_Systems_Lab.pdf</span>
              <span className="text-[10px] text-[#737373] mt-0.5">34 Pages • 4.2 MB • Verified</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-xs font-semibold text-[#171717]">Page Analysis</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">34 Pages Detected</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold text-[#171717]">File Encryption</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Secure Upload</span>
              </div>
            </div>
          </div>

          <div className="w-full py-2.5 rounded-xl bg-[#FF6B00] text-white text-center text-xs font-bold shadow-xs">
            Configure Print Specs →
          </div>
        </div>
      ),
    },
    {
      id: 'configure',
      badge: 'Step 2 • Specifications',
      title: 'Precision Print Controls',
      desc: 'Select Black & White or Full Color, Single-Sided or Duplex, and professional Spiral Binding. Exact pricing calculates dynamically before ordering.',
      screenTitle: 'Print Options',
      screenSubtitle: 'Instant Price Calculation',
      renderScreen: () => (
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block mb-1">Color Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl border-2 border-[#FF6B00] bg-orange-50/50 flex flex-col items-center">
                  <span className="text-xs font-bold text-[#171717]">Black & White</span>
                  <span className="text-[10px] text-[#FF6B00] font-semibold">Standard Print</span>
                </div>
                <div className="p-2.5 rounded-xl border border-[#EAEAEA] bg-white flex flex-col items-center opacity-70">
                  <span className="text-xs font-bold text-[#171717]">Full Color</span>
                  <span className="text-[10px] text-[#737373]">Color Print</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block mb-1">Sides & Binding</span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-semibold">
                  <span>Print Type</span>
                  <span className="text-[#FF6B00] font-bold">Double Sided (Duplex)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-semibold">
                  <span>Binding Type</span>
                  <span className="text-[#FF6B00] font-bold">Spiral Bound</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717]">Calculated Total</span>
              <span className="text-sm font-black text-[#FF6B00]">INR Breakdown</span>
            </div>
          </div>

          <div className="w-full py-2.5 rounded-xl bg-[#FF6B00] text-white text-center text-xs font-bold shadow-xs">
            Select Delivery Location →
          </div>
        </div>
      ),
    },
    {
      id: 'delivery',
      badge: 'Step 3 • Logistics',
      title: 'Classroom Desk Delivery',
      desc: 'Skip campus print shop counter lines. Select your department, block, and room number. Finished orders are brought directly to your classroom.',
      screenTitle: 'Delivery Details',
      screenSubtitle: 'Classroom Destination',
      renderScreen: () => (
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#171717]">Classroom Destination</div>
                  <div className="text-[10px] text-[#737373]">Computer Science Engineering</div>
                </div>
              </div>
              
              <div className="space-y-1 pl-9 text-[11px]">
                <div className="flex justify-between text-[#404040]">
                  <span>Block:</span>
                  <span className="font-bold text-[#171717]">C-BLOCK • 2nd Floor</span>
                </div>
                <div className="flex justify-between text-[#404040]">
                  <span>Room:</span>
                  <span className="font-bold text-[#FF6B00]">Room SH-101</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Classroom Routing</span>
                <span className="text-[11px] text-emerald-700">Scheduled for Room Delivery</span>
              </div>
            </div>
          </div>

          <div className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-center text-xs font-bold shadow-xs">
            Order Confirmed ✓
          </div>
        </div>
      ),
    },
    {
      id: 'tracking',
      badge: 'Step 4 • Full Visibility',
      title: 'Live Order Tracking',
      desc: 'Transparent step-by-step progress from order placement and printing through classroom delivery with distinct order IDs.',
      screenTitle: 'Order Details',
      screenSubtitle: 'Lifecycle Progress',
      renderScreen: () => (
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAEAEA]">
              <div>
                <span className="text-[10px] font-bold text-[#737373] block">ORDER ID</span>
                <span className="font-mono text-xs font-bold text-[#171717]">BZ-ORD-204</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                Printing
              </span>
            </div>

            {/* Stepper */}
            <div className="space-y-2.5 pl-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-[#171717]">Order Received</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#FF6B00] flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
                <span className="text-xs font-bold text-[#FF6B00]">Printing & Binding</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-50">
                <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                <span className="text-xs font-medium text-[#737373]">Out for Delivery</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-50">
                <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                <span className="text-xs font-medium text-[#737373]">Delivered to Room SH-101</span>
              </div>
            </div>
          </div>

          <div className="w-full py-2.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center text-xs font-semibold text-[#171717]">
            Classroom Delivery
          </div>
        </div>
      ),
    },
  ];

  // Auto advance tabs every 6s if idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [steps.length]);

  const currentStep = steps[activeTab];

  return (
    <section id="product" className="py-24 bg-[#F7F7F5] relative overflow-hidden border-b border-[#EAEAEA]">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EAEAEA] text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-4 shadow-2xs">
            <Smartphone className="w-3.5 h-3.5" />
            <span>PRODUCT EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight mb-4">
            Designed for Campus Reality. <br />
            <span className="text-[#FF6B00]">
              Built for Effortless Printing.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            The full BLINTZY printing flow—from your mobile phone to physical classroom delivery in four simple steps.
          </p>
        </div>

        {/* Interactive Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Interactive Feature Stepper (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {steps.map((step, idx) => {
              const isActive = idx === activeTab;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveTab(idx)}
                  className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-white border-[#FF6B00]/40 shadow-[0_8px_30px_rgba(255,107,0,0.08)] ring-1 ring-[#FF6B00]/20'
                      : 'bg-white/60 border-[#EAEAEA] hover:bg-white hover:border-[#D0D0CE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      isActive ? 'text-[#FF6B00]' : 'text-[#737373]'
                    }`}>
                      {step.badge}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-orange-50 text-[#FF6B00]' : 'text-[#737373]'
                    }`}>
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#171717] mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#737373] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D Smartphone Device Mockup (6 cols) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <TiltCard maxRotation={6} perspective={1200} className="w-[300px] sm:w-[320px]">
              {/* Smartphone Outer Chassis */}
              <div className="relative w-full h-[600px] bg-[#171717] rounded-[3rem] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.18)] border-4 border-[#2A2A2A]">
                
                {/* Side Buttons */}
                <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-[#333] rounded-l-md" />
                <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-[#333] rounded-l-md" />
                <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-[#333] rounded-r-md" />

                {/* Smartphone Screen Glass */}
                <div className="relative w-full h-full bg-[#FFFFFF] rounded-[2.5rem] overflow-hidden flex flex-col justify-between border border-[#EAEAEA]">
                  
                  {/* Status Bar & Dynamic Island */}
                  <div className="h-9 w-full bg-white flex items-center justify-between px-6 pt-2 shrink-0 z-30">
                    <span className="text-[11px] font-bold text-[#171717]">9:41</span>
                    {/* Dynamic Island Pill */}
                    <div className="w-20 h-4.5 bg-[#171717] rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                      <div className="w-1 h-1 rounded-full bg-[#333]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#171717]">BLINTZY</span>
                  </div>

                  {/* App Screen Header */}
                  <div className="px-5 py-2 border-b border-[#F0F0EE] bg-white shrink-0">
                    <div className="text-xs font-bold text-[#171717]">{currentStep.screenTitle}</div>
                    <div className="text-[10px] text-[#737373]">{currentStep.screenSubtitle}</div>
                  </div>

                  {/* Dynamic Screen Content with Animated Transition */}
                  <div className="flex-1 overflow-hidden relative bg-white">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="h-full"
                      >
                        {currentStep.renderScreen()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Home Indicator */}
                  <div className="h-5 w-full bg-white flex items-center justify-center pb-1 shrink-0">
                    <div className="w-28 h-1 bg-gray-300 rounded-full" />
                  </div>

                </div>

                {/* Specular Highlight Sheen */}
                <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
