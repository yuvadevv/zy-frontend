'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, LucideIcon } from 'lucide-react';

export interface OfferTicketData {
  id: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  price: number | string;
  originalPrice?: number;
  unit?: string;
  savingsText?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  tag?: string;
}

interface OfferTicketCardProps {
  ticket: OfferTicketData;
}

export const OfferTicketCard: React.FC<OfferTicketCardProps> = ({ ticket }) => {
  const IconComponent = ticket.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-orange-200/90 shadow-[0_2px_12px_rgba(255,107,0,0.04)] hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between group w-full">
      {/* 1. Card Body */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col">
        {/* Header: Brand Label + Icon + Contained Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#FF6B00] shrink-0 shadow-2xs">
              <IconComponent className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] leading-none">
                BLINTZY CAMPUS FEST
              </span>
              <span className="text-[10px] font-bold text-gray-500 capitalize leading-tight truncate">
                {ticket.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          {ticket.badge && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF6B00] text-white shrink-0 shadow-xs whitespace-nowrap">
              {ticket.badge}
            </span>
          )}
        </div>

        {/* Title & Short Description */}
        <div className="mb-3">
          <h3 className="font-extrabold text-[15px] sm:text-base text-gray-900 group-hover:text-[#FF6B00] transition-colors leading-snug">
            {ticket.title}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
            {ticket.description}
          </p>
        </div>

        {/* Price Section - Clean Horizontal Layout */}
        <div className="bg-[#FFF9F5] px-3.5 py-2.5 rounded-xl border border-orange-100 mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            {ticket.originalPrice !== undefined && (
              <span className="text-xs text-gray-400 line-through font-bold shrink-0">
                ₹{ticket.originalPrice.toFixed(2)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#FF6B00] leading-none tracking-tight">
                {typeof ticket.price === 'number' ? `₹${ticket.price.toFixed(2)}` : ticket.price}
              </span>
              {ticket.unit && (
                <span className="text-xs font-bold text-gray-500 shrink-0">
                  {ticket.unit}
                </span>
              )}
            </div>
          </div>

          {ticket.savingsText && (
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap shadow-2xs">
              {ticket.savingsText}
            </span>
          )}
        </div>

        {/* Features (Max 3) */}
        <div className="space-y-1.5 mb-2">
          {ticket.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Ticket Notches & Perforation Divider */}
      <div className="relative my-0.5">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-orange-200/90 pointer-events-none z-10" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-orange-200/90 pointer-events-none z-10" />
        <div className="border-t border-dashed border-orange-200/80 mx-2" />
      </div>

      {/* 3. Bottom-Aligned Footer Action Button */}
      <div className="p-3.5 sm:p-4 pt-2.5 bg-gradient-to-b from-transparent to-orange-50/20">
        <Link
          href={ticket.ctaHref}
          className="w-full h-10 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 active:scale-[0.99] text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 text-center"
        >
          <span>{ticket.ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
