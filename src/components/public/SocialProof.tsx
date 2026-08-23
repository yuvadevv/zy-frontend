'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { publicContent } from '@/config/publicContent';
import { staggerContainer, fadeInUp } from './animations';

export function SocialProof() {
  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {publicContent.socialProof.trustedBy.map((item, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              className="flex items-center justify-center text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
