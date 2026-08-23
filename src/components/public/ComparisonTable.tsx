'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { fadeInUp } from './animations';

const features = [
  { label: "Long Queues", old: false, new: true, newLabel: "Upload Anywhere" },
  { label: "Order Tracking", old: false, new: true, newLabel: "Track Orders" },
  { label: "Delivery", old: false, new: true, newLabel: "Classroom Delivery" },
  { label: "Speed", old: false, new: true, newLabel: "Fast" },
  { label: "Experience", old: false, new: true, newLabel: "Smart" },
];

export function ComparisonTable() {
  return (
    <SectionContainer className="bg-white">
      <SectionHeading 
        badge="Why BLINTZY"
        title="The Smarter Choice." 
        subtitle="See why thousands of students are switching to digital campus printing."
      />

      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="hidden md:block p-8 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Features</h3>
          </div>
          <div className="p-8 bg-gray-50 border-b border-r md:border-r-0 border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-500">Traditional Printing</h3>
          </div>
          <div className="p-8 bg-orange-500 border-b border-orange-600 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <h3 className="text-xl font-extrabold text-white relative z-10">BLINTZY</h3>
          </div>

          {/* Rows */}
          {features.map((feature, i) => (
            <React.Fragment key={i}>
              <div className="hidden md:flex p-6 border-b border-gray-100 items-center">
                <span className="font-semibold text-gray-700">{feature.label}</span>
              </div>
              <div className="p-6 border-b border-r md:border-r-0 border-gray-100 flex flex-col items-center justify-center gap-2 bg-gray-50/30">
                <span className="md:hidden text-xs font-semibold text-gray-400 uppercase tracking-wider">{feature.label}</span>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <X className="w-5 h-5 text-red-400" />
                  <span className="hidden sm:inline">No {feature.label}</span>
                </div>
              </div>
              <div className="p-6 border-b border-orange-100 flex flex-col items-center justify-center gap-2 bg-orange-50/50">
                <span className="md:hidden text-xs font-semibold text-orange-400 uppercase tracking-wider">{feature.label}</span>
                <div className="flex items-center gap-2 text-orange-600 font-bold">
                  <Check className="w-5 h-5" />
                  <span className="hidden sm:inline">{feature.newLabel}</span>
                </div>
              </div>
            </React.Fragment>
          ))}
          
        </div>
      </motion.div>
    </SectionContainer>
  );
}
