'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { publicContent } from '@/config/publicContent';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { fadeInUp } from './animations';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionContainer id="faq" className="bg-white">
      <SectionHeading 
        badge="FAQ"
        title="Frequently Asked Questions." 
        subtitle="Everything you need to know about printing on campus with BLINTZY."
      />

      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
      >
        {publicContent.faq.map((item, i) => (
          <div 
            key={i}
            className={`border border-gray-100 rounded-2xl overflow-hidden transition-colors ${openIndex === i ? 'bg-orange-50/30' : 'bg-white hover:bg-gray-50'}`}
          >
            <button 
              onClick={() => toggle(i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className={`font-semibold text-lg transition-colors ${openIndex === i ? 'text-orange-600' : 'text-gray-900'}`}>
                {item.question}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-orange-500' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-5 pt-0 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
