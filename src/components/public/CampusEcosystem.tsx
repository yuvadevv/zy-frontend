'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Printer,
  Bike,
  Building,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const stakeholders = [
  {
    icon: Users,
    role: 'Students',
    tag: 'Frictionless Experience',
    desc: 'Skip print shop counter queues, order from your phone, and receive assignments delivered directly to class.',
    feature: 'Classroom Delivery',
  },
  {
    icon: GraduationCap,
    role: 'Faculty & Academics',
    tag: 'Academic Formatting',
    desc: 'Receive neatly bound lab manuals, project reports, and course submissions printed to curriculum standards.',
    feature: 'Standardized Layouts',
  },
  {
    icon: Printer,
    role: 'Campus Print Hubs',
    tag: 'Digital Operations',
    desc: 'Replace chaotic counter crowds with organized digital job queues and automatic page-count verification.',
    feature: 'Digital Job Queue',
  },
  {
    icon: Bike,
    role: 'Classroom Delivery Fleet',
    tag: 'Campus Routing',
    desc: 'Campus runners navigate university departments and blocks for direct handoff to your classroom room number.',
    feature: 'Direct Room Handoff',
  },
  {
    icon: Building,
    role: 'Campus Administration',
    tag: 'Organized Logistics',
    desc: 'A unified digital platform that brings structure to everyday campus logistics and reduces shop congestion.',
    feature: 'Reduced Congestion',
  },
];

export function CampusEcosystem() {
  return (
    <SectionContainer id="ecosystem" className="bg-[#F7F7F5] border-t border-[#EAEAEA]">
      <SectionHeading
        badge="Campus Ecosystem"
        title="One Platform Connecting the Entire University."
        subtitle="BLINTZY bridges students, faculty, print hubs, and delivery personnel into a synchronized digital campus network."
      />

      <div className="max-w-7xl mx-auto">
        {/* Central Hub Highlight */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          className="bg-white rounded-3xl p-8 md:p-10 border border-[#EAEAEA] shadow-xs mb-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF6B00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center font-black text-2xl shadow-[0_8px_24px_rgba(255,107,0,0.35)] mb-4">
              B
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Central Campus Hub</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight mb-3">
              Synchronizing Everyday Campus Logistics
            </h3>
            <p className="text-[#737373] text-sm md:text-base leading-relaxed">
              Every request, print file, and delivery coordinate flows securely through the BLINTZY platform, keeping academic logistics organized and predictable.
            </p>
          </div>
        </motion.div>

        {/* Stakeholder Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stakeholders.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 border border-[#EAEAEA] shadow-xs hover:shadow-[0_12px_30px_rgba(255,107,0,0.08)] hover:border-[#FF6B00]/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] flex items-center justify-center text-[#171717] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#171717] mb-2 group-hover:text-[#FF6B00] transition-colors">
                    {item.role}
                  </h4>

                  <p className="text-sm text-[#737373] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F7F7F5] flex items-center justify-between text-xs font-semibold text-[#171717]">
                  <span className="text-[#737373]">Capability:</span>
                  <span className="text-[#FF6B00] font-bold">{item.feature}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Platform Trust & Privacy Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-br from-white to-[#F7F7F5] rounded-2xl p-6 border border-[#EAEAEA] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#171717] bg-white border border-[#EAEAEA] px-2.5 py-1 rounded-full">
                  File Security
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#171717] mb-2">
                Document Privacy Protection
              </h4>

              <p className="text-sm text-[#737373] leading-relaxed mb-4">
                Encrypted uploads for all academic files and prompt post-print data purging safeguard student course materials and personal project files.
              </p>
            </div>

            <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs font-semibold text-[#737373]">
              <span>Student Privacy</span>
              <span className="text-[#171717] font-bold">Secure Cloud Pipeline</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
