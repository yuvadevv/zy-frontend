import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from './animations';

export const SectionContainer = ({ children, className = '', id = '' }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-24 relative overflow-hidden ${className}`}>
    <div className="container mx-auto px-6 max-w-7xl relative z-10">
      {children}
    </div>
  </section>
);

export const SectionHeading = ({ title, subtitle, badge }: { title: string, subtitle?: string, badge?: string }) => (
  <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
    {badge && (
      <motion.span 
        variants={fadeInUp}
        className="text-sm font-bold tracking-wider text-orange-600 uppercase bg-orange-100 px-3 py-1 rounded-full mb-4"
      >
        {badge}
      </motion.span>
    )}
    <motion.h2 
      variants={fadeInUp}
      className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        variants={fadeInUp}
        className="text-lg text-gray-600 leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);
