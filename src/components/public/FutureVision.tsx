'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Globe, Rocket } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const timeline = [
  { year: "2026", title: "Campus Printing", desc: "Digitizing local campus print shops and enabling classroom delivery.", icon: MapPin },
  { year: "2027", title: "Multi College", desc: "Expanding to regional universities and unifying student printing accounts.", icon: Building2 },
  { year: "2028", title: "Campus Services", desc: "Integrating beyond printing into full digital campus logistics.", icon: Globe },
  { year: "Future", title: "National Platform", desc: "The definitive digital ecosystem for higher education in India.", icon: Rocket }
];

export function FutureVision() {
  return (
    <SectionContainer className="bg-gray-50/50">
      <SectionHeading 
        badge="Roadmap"
        title="Our Future Vision." 
        subtitle="Where we are today, and where we are going tomorrow."
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto relative py-12"
      >
        {/* Continuous Line */}
        <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-1 bg-gray-200 -translate-y-1/2" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
          {timeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:bg-orange-50 transition-colors shadow-sm relative">
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  {i < timeline.length - 1 && (
                    <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-1 h-12 bg-gray-200" />
                  )}
                </div>
                <span className="text-orange-500 font-extrabold text-sm tracking-wider uppercase mb-2">{item.year}</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </SectionContainer>
  );
}
