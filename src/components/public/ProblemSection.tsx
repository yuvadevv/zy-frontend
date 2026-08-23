'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, AlertCircle, MapPinOff, PencilLine, HelpCircle } from 'lucide-react';
import { publicContent } from '@/config/publicContent';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const iconMap: any = {
  "Waiting in Queue": Clock,
  "Expensive Printing": DollarSign,
  "Last Minute Exam Rush": AlertCircle,
  "No Classroom Delivery": MapPinOff,
  "Manual Process": PencilLine,
  "No Order Tracking": HelpCircle
};

export function ProblemSection() {
  return (
    <SectionContainer className="bg-gray-50/50">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <SectionHeading 
          badge="The Problem"
          title="Printing Shouldn't Waste Your Time." 
          subtitle="Students lose hours every semester dealing with outdated campus print shops."
        />
        
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {publicContent.problems.map((problem, i) => {
            const Icon = iconMap[problem.title] || Clock;
            return (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                <p className="text-gray-600 leading-relaxed">{problem.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
