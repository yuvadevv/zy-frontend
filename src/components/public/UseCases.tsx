'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Book, Ticket, Layers, FileImage, Presentation, GraduationCap, Network } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, scaleUp } from './animations';

const cases = [
  { title: "Assignments", icon: FileText },
  { title: "Lab Manuals", icon: Book },
  { title: "Hall Tickets", icon: Ticket },
  { title: "Project Reports", icon: Layers },
  { title: "Posters", icon: FileImage },
  { title: "Certificates", icon: GraduationCap },
  { title: "Event Flyers", icon: Presentation },
  { title: "Research Papers", icon: Network }
];

export function UseCases() {
  return (
    <SectionContainer className="bg-white border-b border-gray-100">
      <SectionHeading 
        badge="Use Cases"
        title="Print Anything." 
        subtitle="From single page assignments to massive bound lab manuals, we handle it all."
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
      >
        {cases.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={i}
              variants={scaleUp}
              className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm transition-all duration-300 flex flex-col items-center text-center gap-4 cursor-default group"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-gray-500 group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{item.title}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
