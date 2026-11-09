'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Sliders, Printer, MapPin, ArrowRight } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const steps = [
  {
    step: '01',
    icon: UploadCloud,
    title: 'Upload Document',
    tag: 'Cloud Upload',
    desc: 'Select PDFs straight from your phone or laptop. Automatic page count and layout verification in seconds.',
  },
  {
    step: '02',
    icon: Sliders,
    title: 'Choose Print Settings',
    tag: 'Clear Pricing',
    desc: 'Configure black & white or vibrant color, single or double-sided, stapled or spiral binding with transparent pricing.',
  },
  {
    step: '03',
    icon: Printer,
    title: 'Hub Processing',
    tag: 'Queue-Free',
    desc: 'Your order is routed directly to a campus print hub for immediate digital queue processing without standing in line.',
  },
  {
    step: '04',
    icon: MapPin,
    title: 'Classroom Desk Delivery',
    tag: 'Direct to Room',
    desc: 'Your finished order is brought straight to your department and classroom room number before your class starts.',
  },
];

export function HowItWorks() {
  return (
    <SectionContainer id="how-it-works" className="bg-[#F7F7F5] border-t border-[#EAEAEA]">
      <SectionHeading
        badge="How It Works"
        title="Four Simple Steps. Zero Waiting."
        subtitle="Designed to replace long lines, broken printers, and thumb drives with clean digital convenience."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {steps.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-7 border border-[#EAEAEA] shadow-xs hover:shadow-[0_12px_30px_rgba(255,107,0,0.08)] hover:border-[#FF6B00]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] flex items-center justify-center text-[#171717] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] transition-all duration-300">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-2xl font-black tracking-tight text-[#EAEAEA] group-hover:text-[#FF6B00]/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="inline-block text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider bg-[#FF6B00]/10 px-2.5 py-0.5 rounded-full mb-3">
                  {item.tag}
                </div>

                <h3 className="text-lg font-bold text-[#171717] mb-2.5 group-hover:text-[#FF6B00] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#737373] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Progress connector indicator */}
              <div className="mt-6 pt-4 border-t border-[#F7F7F5] flex items-center text-xs font-semibold text-[#737373] group-hover:text-[#171717]">
                <span>Stage {i + 1} of 4</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#FF6B00]" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
