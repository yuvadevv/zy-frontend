'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Heart, Zap, MapPin } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const sections = [
  { icon: Rocket, title: "Our Mission", text: "To eliminate the friction of campus printing and give students their time back." },
  { icon: Target, title: "Our Vision", text: "A fully digital, seamless ecosystem connecting every stakeholder in higher education." },
  { icon: Heart, title: "Our Values", text: "Student-first design, uncompromising speed, and radical affordability." },
  { icon: Zap, title: "Innovation", text: "We constantly push the boundaries of what campus logistics can look like." },
  { icon: MapPin, title: "Campus First", text: "Built explicitly for the unique geographic and social layout of colleges." }
];

export function About() {
  return (
    <SectionContainer id="why-blintzy" className="bg-gray-900 text-white border-b border-gray-800 !py-16">
      <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
        <motion.span 
          variants={fadeInUp}
          className="text-sm font-bold tracking-wider text-orange-500 uppercase bg-orange-500/10 px-3 py-1 rounded-full mb-4"
        >
          About BLINTZY
        </motion.span>
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
        >
          We are rewriting the rules.
        </motion.h2>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-gray-400 leading-relaxed"
        >
          For too long, campus printing has been stuck in the past. We are here to bring it into the future.
        </motion.p>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center"
      >
        <motion.div variants={fadeInUp} className="flex-1 space-y-6">
          <h3 className="text-3xl font-bold text-white mb-6">Built by students, for the campus.</h3>
          <p className="text-gray-400 leading-relaxed text-lg">
            BLINTZY started with a simple observation: students were losing countless hours standing in line to print basic assignments. It was inefficient, expensive, and stressful.
          </p>
          <p className="text-gray-400 leading-relaxed text-lg">
            We realized that by building a digital bridge between students, classrooms, and existing print vendors, we could modernize the entire ecosystem. No more pen drives. No more exact change. Just tap, print, and receive.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div key={i} variants={fadeInUp} className={`bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-colors ${i === 4 ? 'sm:col-span-2' : ''}`}>
                <Icon className="w-8 h-8 text-orange-500 mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">{sec.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{sec.text}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
