'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Sparkles } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { fadeInUp } from './animations';

const comparisonRows = [
  {
    feature: 'Ordering Method',
    traditional: 'Physical line at print shop with USB stick',
    blintzy: 'Cloud upload from your phone or laptop',
  },
  {
    feature: 'Waiting Time',
    traditional: 'Waiting in crowded campus print shops',
    blintzy: 'Order ahead from anywhere on campus',
  },
  {
    feature: 'Delivery to Class',
    traditional: 'Manual counter pickup required before class',
    blintzy: 'Direct desk delivery to your classroom or lab',
  },
  {
    feature: 'Pricing Transparency',
    traditional: 'Unclear rates and physical change disputes',
    blintzy: 'Real-time itemized pricing before you confirm',
  },
  {
    feature: 'File & Font Integrity',
    traditional: 'Formatting shifts on unknown shop computers',
    blintzy: 'Standard PDF pipeline preserving layout & margins',
  },
  {
    feature: 'Order Visibility',
    traditional: 'No updates; guessing when your job is ready',
    blintzy: 'Clear status updates: Received, In-Print, Delivered',
  },
];

export function ComparisonTable() {
  return (
    <SectionContainer id="why-blintzy" className="bg-white border-t border-[#EAEAEA]">
      <SectionHeading
        badge="Why BLINTZY"
        title="The Smarter Choice for Campus Life."
        subtitle="Compare traditional campus printing hassles with BLINTZY's modern digital campus infrastructure."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeInUp}
        className="max-w-5xl mx-auto"
      >
        <div className="rounded-2xl border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#F7F7F5] border-b border-[#EAEAEA] py-5 px-6 items-center text-sm font-bold">
            <div className="col-span-4 text-[#737373] uppercase tracking-wider text-xs">
              Campus Experience
            </div>
            <div className="col-span-4 text-center text-[#737373] uppercase tracking-wider text-xs">
              Traditional Print Shop
            </div>
            <div className="col-span-4 text-center text-[#FF6B00] uppercase tracking-wider text-xs flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BLINTZY Platform</span>
            </div>
          </div>

          {/* Rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 py-4.5 px-6 items-center text-sm border-b last:border-b-0 border-[#EAEAEA] transition-colors hover:bg-[#F7F7F5]/50 ${
                i % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white'
              }`}
            >
              <div className="col-span-4 font-semibold text-[#171717] pr-2">
                {row.feature}
              </div>

              {/* Traditional Column */}
              <div className="col-span-4 flex items-center gap-2.5 px-2 text-[#737373]">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm">{row.traditional}</span>
              </div>

              {/* BLINTZY Column */}
              <div className="col-span-4 flex items-center gap-2.5 px-2 text-[#171717] font-medium bg-[#FF6B00]/[0.02] py-1 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-[#171717] font-semibold">{row.blintzy}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-[#737373]">
          Designed specifically to make everyday college printing simple, reliable, and queue-free.
        </div>
      </motion.div>
    </SectionContainer>
  );
}
