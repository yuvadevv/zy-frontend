'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Utensils, ArrowLeft, Printer, ShieldAlert } from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

interface FoodLockedScreenProps {
  message?: string;
}

export function FoodLockedScreen({ message }: FoodLockedScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#151515] text-white flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">
        {/* Lock Icon Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 shadow-2xl flex items-center justify-center">
            <Utensils className="w-9 h-9 text-zinc-500 stroke-[2]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-lg ring-4 ring-[#151515]">
            <Lock className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Badge */}
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500/15 text-[#FF6B00] border border-orange-500/30 mb-3">
          Service Locked
        </span>

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Campus Food Is Locked
        </h1>

        {/* Message */}
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed max-w-xs">
          {message || 'Campus Food ordering is launching soon! Please check back later or contact campus support.'}
        </p>

        {/* Notice Card */}
        <div className="w-full mt-6 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left flex items-start gap-3 shadow-inner">
          <ShieldAlert className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
          <div className="flex flex-col text-[11px] leading-snug text-zinc-400">
            <span className="font-bold text-zinc-200">Admin Managed Service</span>
            <span>This counter is temporarily locked by campus administrators for menu updates or scheduled opening.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-6">
          <Link
            href="/app/home"
            className="w-full py-3 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 active:scale-98 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Campus Home</span>
          </Link>

          <Link
            href="/app/services"
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition flex items-center justify-center gap-2 border border-zinc-700/60"
          >
            <Printer className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Explore Academic Printing Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

