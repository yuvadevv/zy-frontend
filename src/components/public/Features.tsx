'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { publicContent } from '@/config/publicContent';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

export function Features() {
  return (
    <SectionContainer id="features" className="bg-gray-50/50">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <SectionHeading 
          badge="Premium Features"
          title="Everything You Need." 
          subtitle="Designed with students in mind. Built for modern campuses."
        />
        
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {publicContent.features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
