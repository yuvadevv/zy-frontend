'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  UtensilsCrossed, 
  Clock, 
  CalendarDays, 
  CreditCard, 
  ArrowRight,
  Info
} from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

export default function CollegeMessPage() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-4.5 pb-8 select-none">
      {/* 1. In-Page Top Navigation Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Food Outlets</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
          College Mess
        </span>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-zinc-50 via-white to-zinc-100/50 border border-zinc-200 p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl bg-[#151515] text-white flex items-center justify-center shadow-sm shrink-0">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-300">
            <Clock className="w-3 h-3 text-zinc-600" />
            <span>Pre-Launch</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight leading-tight">
            College Mess
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-600 font-medium mt-1 leading-relaxed">
            Explore today's meals and order your daily food.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-[10.5px] font-bold text-gray-700">
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
            🍱 Daily Meal Schedule
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
            🍽️ Token-Free Counter
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
            💵 Online & Cash
          </span>
        </div>
      </section>

      {/* 3. Mess Operating Model Notice */}
      <section className="p-4 sm:p-5 rounded-[20px] bg-white border border-gray-150 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#FF6B00] shrink-0" />
          <h2 className="text-sm font-bold text-[#151515]">How College Mess Dining Works</h2>
        </div>

        <div className="space-y-2 text-xs text-gray-600 font-medium leading-relaxed">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#151515] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-gray-900 block text-xs">Scheduled Daily Meals</strong>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Order your breakfast, lunch, or dinner thalis according to the daily college mess timetable.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#151515] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-gray-900 block text-xs">Token-Free Counter Pickup</strong>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Show your digital order token at the mess dining hall counter for fast, queue-free check-in.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#151515] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-gray-900 block text-xs">Dedicated Institutional Kitchen</strong>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Official college mess operates independently with wholesome nutritious dining plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Menu Status Placeholder Shell */}
      <section className="p-5 rounded-[20px] bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 text-white shadow-md flex flex-col gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
            Timetable Setup In Progress
          </span>
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            Mess weekly schedules are being configured 🍱
          </h2>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed">
            The college dining team is integrating daily meal rotas into the platform. Daily meal booking will open soon.
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-400 font-medium">
            Stage 2 Campus Food Rollout
          </span>
          <Link
            href={APP_ROUTES.CAMPUS_FOOD}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B00] text-white hover:bg-orange-600 transition shadow-xs"
          >
            Back to Outlets
          </Link>
        </div>
      </section>
    </div>
  );
}

