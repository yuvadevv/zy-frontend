'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Heart, Zap, MapPin } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const sections = [
  {
    icon: Rocket,
    title: 'Our Mission',
    text: 'To eliminate the friction of campus logistics and give students their valuable study time back.',
  },
  {
    icon: Target,
    title: 'Our Vision',
    text: 'A fully digital, interconnected ecosystem powering printing, food, and transit for colleges.',
  },
  {
    icon: Heart,
    title: 'Student-First Values',
    text: 'Transparent pricing, dependable execution, and privacy designed explicitly for campus life.',
  },
  {
    icon: Zap,
    title: 'Campus Innovation',
    text: 'Continuously refining automated dispatch and delivery routing across university blocks.',
  },
  {
    icon: MapPin,
    title: 'Campus Tailored',
    text: 'Engineered specifically for the physical layout and academic rhythms of colleges.',
  },
];

export function About() {
  return (
    <SectionContainer id="about" className="bg-white border-t border-[#EAEAEA]">
      <SectionHeading
        badge="About BLINTZY"
        title="Built by Students, for Modern Campuses."
        subtitle="For too long, campus printing and services have been stuck in the past. We are building the unified digital infrastructure colleges deserve."
      />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          className="flex-1 space-y-5"
        >
          <div className="inline-block text-xs font-bold text-[#FF6B00] uppercase tracking-wider bg-[#FF6B00]/10 px-3 py-1 rounded-full">
            Our Story
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight leading-snug">
            From crowded campus print shops to one unified screen.
          </h3>
          <p className="text-[#737373] leading-relaxed text-sm md:text-base">
            BLINTZY started with a frustratingly familiar scene: students packed shoulder-to-shoulder in a campus xerox shop before 9 AM, hoping the printer wouldn’t jam before their lab records were due.
          </p>
          <p className="text-[#737373] leading-relaxed text-sm md:text-base">
            We realized that by building a digital bridge between students, classrooms, and existing print vendors, we could modernize the entire process. No more pen drives. No more exact change disputes. Just tap, print, and receive.
          </p>
          <div className="pt-2 flex items-center gap-6 text-sm font-semibold text-[#171717]">
            <div>
              <span className="block text-2xl font-black text-[#FF6B00]">Digital</span>
              <span className="text-xs text-[#737373]">Queue Elimination</span>
            </div>
            <div className="h-8 w-px bg-[#EAEAEA]" />
            <div>
              <span className="block text-2xl font-black text-[#171717]">Direct</span>
              <span className="text-xs text-[#737373]">Classroom Delivery</span>
            </div>
            <div className="h-8 w-px bg-[#EAEAEA]" />
            <div>
              <span className="block text-2xl font-black text-[#171717]">Upfront</span>
              <span className="text-xs text-[#737373]">Transparent Pricing</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-[#F7F7F5] rounded-2xl p-5 border border-[#EAEAEA] hover:border-[#FF6B00]/30 hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EAEAEA] flex items-center justify-center text-[#FF6B00] mb-3 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#171717] text-sm mb-1.5">{sec.title}</h4>
                <p className="text-xs text-[#737373] leading-relaxed">{sec.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionContainer>
  );
}
