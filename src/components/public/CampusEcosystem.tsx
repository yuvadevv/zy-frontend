'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Ticket, Printer, ArrowRight } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, scaleUp } from './animations';

export function CampusEcosystem() {
  const nodes = [
    { icon: Users, label: "Students", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: GraduationCap, label: "Faculty", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: Building2, label: "Departments", color: "text-green-500", bg: "bg-green-50" },
    { icon: Ticket, label: "Clubs & Events", color: "text-pink-500", bg: "bg-pink-50" },
    { icon: Printer, label: "Print Vendors", color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  return (
    <SectionContainer className="bg-gray-900 text-white overflow-hidden">
      <SectionHeading 
        badge="The Ecosystem"
        title="Built for the Entire Campus." 
        subtitle="BLINTZY connects every stakeholder on campus into one seamless digital printing network."
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 py-12"
      >
        <div className="flex flex-wrap justify-center gap-6 max-w-lg">
          {nodes.map((node, i) => (
            <motion.div key={i} variants={scaleUp} className="flex flex-col items-center gap-3 w-[120px]">
              <div className={`w-16 h-16 rounded-2xl ${node.bg} flex items-center justify-center`}>
                <node.icon className={`w-8 h-8 ${node.color}`} />
              </div>
              <span className="font-semibold text-sm text-gray-300">{node.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={scaleUp} className="hidden md:flex items-center justify-center px-8">
          <div className="h-[2px] w-16 bg-gradient-to-r from-gray-700 to-orange-500 relative">
            <ArrowRight className="absolute -right-2 -top-[11px] text-orange-500 w-6 h-6" />
          </div>
        </motion.div>

        <motion.div variants={scaleUp} className="mt-8 md:mt-0 flex flex-col items-center">
          <div className="w-32 h-32 rounded-[2rem] bg-orange-500 flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.4)] relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
            <span className="text-4xl font-extrabold text-white relative z-10">B</span>
          </div>
          <span className="mt-4 font-bold text-xl text-white tracking-widest">BLINTZY</span>
        </motion.div>

      </motion.div>
    </SectionContainer>
  );
}
