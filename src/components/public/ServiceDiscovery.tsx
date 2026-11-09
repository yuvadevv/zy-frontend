'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Printer, 
  Utensils, 
  Bus, 
  Layers, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
} from 'lucide-react';
import { publicContent } from '@/config/publicContent';
import { TiltCard } from './TiltCard';
import { staggerContainer, fadeInUp } from './animations';

export function ServiceDiscovery() {
  const { services } = publicContent;

  return (
    <section id="services" className="py-24 bg-[#FFFFFF] relative overflow-hidden border-b border-[#EAEAEA]">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUS SERVICES DISCOVERY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight mb-4"
          >
            One Platform. <br />
            <span className="text-[#FF6B00]">
              Every Campus Service.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#737373] leading-relaxed"
          >
            BLINTZY unifies college life into one digital platform. Active today with academic printing and classroom delivery, and expanding into campus dining and transit services.
          </motion.p>
        </div>

        {/* 4 Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {services.map((service) => {
            const isAvailable = service.status === 'AVAILABLE';
            const isFood = service.id === 'food';
            const isBus = service.id === 'bus';

            return (
              <motion.div key={service.id} variants={fadeInUp} className="flex">
                <TiltCard 
                  maxRotation={6} 
                  className={`w-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border transition-all duration-300 ${
                    isAvailable 
                      ? 'border-[#FF6B00]/40 shadow-[0_12px_36px_rgba(255,107,0,0.08)] ring-1 ring-[#FF6B00]/20' 
                      : 'border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#D0D0CE]'
                  }`}
                >
                  {/* Card Top: Header & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      {/* Icon */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                        isAvailable 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : isFood
                          ? 'bg-orange-50 text-[#FF6B00] border border-orange-100'
                          : isBus
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-purple-50 text-purple-600 border border-purple-100'
                      }`}>
                        {service.id === 'print' && <Printer className="w-5 h-5" />}
                        {service.id === 'food' && <Utensils className="w-5 h-5" />}
                        {service.id === 'bus' && <Bus className="w-5 h-5" />}
                        {service.id === 'more' && <Layers className="w-5 h-5" />}
                      </div>

                      {/* Status Badge */}
                      {isAvailable ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>AVAILABLE</span>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                          service.status === 'COMING SOON'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{service.status}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#FF6B00] mb-3 leading-snug">
                      {service.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Feature Checklist */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-[#F0F0EE]">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#404040]">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isAvailable ? 'text-emerald-500' : 'text-[#A0A0A0]'
                          }`} />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: CTA or Clear Coming Soon Notice */}
                  <div className="pt-4 border-t border-[#F0F0EE]">
                    {isAvailable ? (
                      <Link
                        href={service.ctaLink || '/app/login'}
                        className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FF6B00] text-xs font-bold text-white shadow-xs hover:bg-[#e66000] hover:shadow-[0_4px_16px_rgba(255,107,0,0.25)] transition-all active:scale-[0.98]"
                      >
                        <span>{service.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="w-full py-2.5 px-3 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
                        <span className="text-[11px] font-semibold text-[#737373]">
                          {isFood 
                            ? '🍽️ Planned Campus Service • Coming Soon' 
                            : isBus 
                            ? '🚌 Planned Campus Service • Coming Soon' 
                            : '⚡ Future Campus Expansion'}
                        </span>
                      </div>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Note on Planned Services */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-[#737373] max-w-2xl mx-auto">
            <span className="font-bold text-[#171717]">Campus Transparency:</span> Academic document printing and classroom delivery are actively operating today. Campus Food and College Bus Tracking are planned campus services and clearly marked Coming Soon.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
