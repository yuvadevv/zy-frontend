'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, ArrowRight, Printer, GraduationCap } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, scaleUp } from './animations';

export function SolutionFlow() {
  const steps = [
    { icon: Laptop, label: 'Upload' },
    { icon: ArrowRight, label: 'Choose Print', isArrow: true },
    { icon: Printer, label: 'Vendor Prints' },
    { icon: ArrowRight, label: 'Delivered', isArrow: true },
    { icon: GraduationCap, label: 'Delivered' }
  ];

  return (
    <SectionContainer className="bg-white border-y border-gray-100">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <SectionHeading 
          badge="The Solution"
          title="Meet BLINTZY" 
          subtitle="A seamless, end-to-end digital printing ecosystem designed for modern campuses."
        />
        
        <motion.div 
          variants={staggerContainer}
          className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto py-12"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            if (step.isArrow) {
              return (
                <motion.div key={i} variants={scaleUp} className="hidden md:block">
                  <Icon className="w-8 h-8 text-gray-300" />
                </motion.div>
              );
            }
            return (
              <motion.div 
                key={i} 
                variants={scaleUp}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-white shadow-[0_8px_30px_rgba(249,115,22,0.12)] flex items-center justify-center group-hover:bg-orange-500 group-hover:-translate-y-2 transition-all duration-300">
                  <Icon className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <span className="font-bold text-gray-900">{step.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
