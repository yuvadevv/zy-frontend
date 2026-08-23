'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeInUp } from './animations';

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-orange-500 text-white py-24 border-y border-orange-600">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-black/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
        <motion.h2 
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
        >
          Ready to Skip the Printing Queue?
        </motion.h2>
        <motion.p 
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}
          className="text-xl md:text-2xl text-orange-100 mb-10 leading-relaxed font-medium"
        >
          Join thousands of students and experience smarter, faster campus printing.
        </motion.p>
        
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            href="/app/login"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-lg font-bold text-orange-600 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
          >
            Start Printing <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-orange-400 bg-transparent px-8 text-lg font-bold text-white transition-all hover:bg-orange-600 active:scale-95"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
