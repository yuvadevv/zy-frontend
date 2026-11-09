'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBootstrapConfig } from '@/features/bootstrap/services/bootstrapService';
import toast from 'react-hot-toast';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';
import { fadeInUp } from './animations';

export function CTA() {
  const { data: bootstrapData } = useQuery({
    queryKey: ['bootstrap'],
    queryFn: fetchBootstrapConfig,
    staleTime: 1000 * 60,
  });
  const isComingSoon = bootstrapData?.data?.coming_soon;

  const handleRestrictedAction = (e: React.MouseEvent) => {
    if (isComingSoon) {
      e.preventDefault();
      toast('This feature is currently disabled during Coming Soon mode.', { icon: '🔒' });
    }
  };

  return (
    <section className="bg-white py-20 border-t border-[#EAEAEA]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-[#171717] text-white p-10 md:p-16 border border-[#262626] shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF6B00]/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#FF6B00]/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Pill */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Available on Your Campus Now</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight"
            >
              Never Stand in a Campus Printing Queue Again.
            </motion.h2>

            {/* Supporting Description */}
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#A3A3A3] mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Upload documents from anywhere, choose custom print specs, and receive them delivered right to your classroom desk before class begins.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-3.5 mb-10"
            >
              <Link
                href="/app/login"
                onClick={handleRestrictedAction}
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-7 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,107,0,0.4)] transition-all hover:bg-[#e05e00] hover:shadow-[0_8px_25px_rgba(255,107,0,0.5)] active:scale-95"
              >
                <span>Start Printing Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
              >
                Explore Campus Services
              </a>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/10 text-xs text-[#A3A3A3]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <span>Zero Wait Times</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#FF6B00]" />
                <span>Encrypted Academic Uploads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>Verified Campus Runners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
