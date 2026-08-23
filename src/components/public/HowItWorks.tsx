'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Settings, Printer, GraduationCap } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const steps = [
  { icon: Upload, title: "Upload Documents", desc: "Select PDFs directly from your phone or computer." },
  { icon: Settings, title: "Choose Print Settings", desc: "Select color, copies, and binding options." },
  { icon: Printer, title: "Vendor Prints", desc: "Our campus partners print your order instantly." },
  { icon: GraduationCap, title: "Delivered to Classroom", desc: "Pick it up right from your desk before class." }
];

export function HowItWorks() {
  return (
    <SectionContainer id="how-it-works" className="bg-gray-50/50">
      <SectionHeading 
        badge="How It Works"
        title="Four Steps to Freedom." 
        subtitle="We eliminated everything you hate about printing."
      />
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative"
      >
        {/* Connecting Line */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gray-200" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={i} variants={fadeInUp} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] group-hover:border-orange-200 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 text-white font-bold rounded-full flex items-center justify-center shadow-sm">
                  {i + 1}
                </div>
                <Icon className="w-10 h-10 text-gray-700 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-[250px]">{step.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
