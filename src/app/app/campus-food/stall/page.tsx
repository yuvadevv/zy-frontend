'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Store, 
  Clock, 
  ShoppingBag, 
  CreditCard, 
  ArrowRight,
  Info
} from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

export default function PrivateFoodStallPage() {
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
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200/60">
          Private Stall
        </span>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#FFF9F5] via-white to-orange-50/50 border border-orange-200/80 p-5 shadow-[0_2px_14px_rgba(255,107,0,0.06)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-sm shadow-orange-500/30 shrink-0">
            <Store className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100/80 text-[#FF6B00] border border-orange-200">
            <Clock className="w-3 h-3 text-[#FF6B00]" />
            <span>Pre-Launch</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight leading-tight">
            Private Food Stall
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-600 font-medium mt-1 leading-relaxed">
            Explore the menu, choose your favourites and order instantly.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="pt-2 border-t border-orange-100/80 flex flex-wrap items-center gap-2 text-[10.5px] font-bold text-gray-700">
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-orange-200/60 shadow-2xs">
            ⚡ Instant Ordering
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-orange-200/60 shadow-2xs">
            🥡 Counter Pickup
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-orange-200/60 shadow-2xs">
            💳 Online & Cash
          </span>
        </div>
      </section>

      {/* 3. Outlet Operating Rules Notice */}
      <section className="p-4 sm:p-5 rounded-[20px] bg-white border border-gray-150 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#FF6B00] shrink-0" />
          <h2 className="text-sm font-bold text-[#151515]">How Private Stall Ordering Works</h2>
        </div>

        <div className="space-y-2 text-xs text-gray-600 font-medium leading-relaxed">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-gray-900 block text-xs">Immediate On-Demand Ordering</strong>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Place your order when you want a quick bite or snack between classes.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-gray-900 block text-xs">Counter Pickup Only</strong>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Collect directly from the food stall counter. No delivery fees or waiting for couriers.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-gray-900 block text-xs">Separate Vendor Account</strong>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Independent vendor accounts manage food stall menus separately from other campus services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Menu Status Placeholder Shell */}
      <section className="p-5 rounded-[20px] bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 text-white shadow-md flex flex-col gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
            Menu Setup In Progress
          </span>
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            Vendor menus are being configured 🍽️
          </h2>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed">
            Participating food stall partners are setting up their digital catalogues. Ordering and counter pickup will go live shortly.
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

