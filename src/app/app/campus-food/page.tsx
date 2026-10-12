'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  UtensilsCrossed, 
  Search, 
  ShoppingBag, 
  QrCode, 
  Clock, 
  Sparkles, 
  Store,
  Info
} from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

interface FoodCategoryPreview {
  emoji: string;
  title: string;
  description: string;
  tag: string;
}

const PLANNED_CATEGORIES: FoodCategoryPreview[] = [
  {
    emoji: '🍛',
    title: 'Canteen Meals',
    description: 'Wholesome daily meals, thalis, and quick canteen lunch plates.',
    tag: 'Campus Daily'
  },
  {
    emoji: '🍕',
    title: 'Pizza',
    description: 'Hot, freshly baked personal slices and shareable pan pizzas.',
    tag: 'Quick Bite'
  },
  {
    emoji: '🍜',
    title: 'Fried Rice & Noodles',
    description: 'Wok-tossed noodles, vegetable fried rice, and chilli snacks.',
    tag: 'Student Favourites'
  },
  {
    emoji: '🍲',
    title: 'Curries & Rice',
    description: 'Aromatic gravies, paneer dishes, and traditional rice combinations.',
    tag: 'Comfort Food'
  },
  {
    emoji: '🥪',
    title: 'Snacks & More',
    description: 'Crispy samosas, sandwiches, rolls, beverages, and break-time refreshments.',
    tag: 'Break Bites'
  }
];

export default function CampusFoodPage() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200/60">
          Service Preview
        </span>
      </div>

      {/* 2. Hero Section */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#FFF9F5] via-white to-orange-50/60 border border-orange-200/80 p-5 sm:p-6 shadow-[0_4px_20px_rgba(255,107,0,0.06)] flex flex-col gap-4">
        {/* Eyebrow & Status */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-100/70 text-[#FF6B00] border border-orange-300/60">
            <Clock className="w-3 h-3 text-[#FF6B00]" />
            <span>COMING SOON · RCE</span>
          </div>
        </div>

        {/* Headlines */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Good Food. Less Queue. 🍕
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm font-semibold mt-1.5 leading-relaxed">
            Your campus favourites, coming together in one place. 😋
          </p>
        </div>

        {/* Hero Visual Image Banner */}
        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-orange-100 shadow-inner">
          <img
            src="/images/banners/banner_campus_food.webp"
            alt="Campus Food Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
            <span className="drop-shadow-xs">Planned Campus Outlets & Canteens</span>
            <span className="text-[10px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              Pre-Launch Concept
            </span>
          </div>
        </div>
      </div>

      {/* 3. Food Category Previews Section */}
      <section className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col gap-3.5">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900 tracking-tight leading-tight">
              Planned Food Categories
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Concept Preview
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Categories planned for participating campus food partners. Actual menus and vendors will be configured prior to launch.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {PLANNED_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-3 hover:border-orange-200 transition-colors"
            >
              <div className="text-2xl shrink-0 p-2 bg-white rounded-xl border border-gray-150 shadow-2xs flex items-center justify-center">
                {cat.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60 shrink-0">
                    {cat.tag}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How the Planned Experience Works */}
      <section className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col gap-3.5">
        <div>
          <h2 className="text-base font-black text-gray-900 tracking-tight leading-tight">
            How It Will Work
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Designed to save you time and skip long counter lines between classes.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Step 1: Browse */}
          <div className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 flex items-start sm:items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#FF6B00] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              1
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <strong className="text-gray-900 font-bold text-xs">Browse Outlets</strong>
              </div>
              <p className="text-gray-600 text-[11px] font-medium leading-relaxed mt-0.5">
                Explore participating campus food vendors, canteens, and snack points.
              </p>
            </div>
          </div>

          {/* Step 2: Order */}
          <div className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 flex items-start sm:items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#FF6B00] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              2
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <strong className="text-gray-900 font-bold text-xs">Order Online</strong>
              </div>
              <p className="text-gray-600 text-[11px] font-medium leading-relaxed mt-0.5">
                Choose your food items easily and place your order when ordering opens.
              </p>
            </div>
          </div>

          {/* Step 3: Collect */}
          <div className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 flex items-start sm:items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#FF6B00] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              3
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-[#FF6B00]" />
                <strong className="text-gray-900 font-bold text-xs">Quick Collect</strong>
              </div>
              <p className="text-gray-600 text-[11px] font-medium leading-relaxed mt-0.5">
                Show your order reference at the counter to pick up without queueing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Coming Soon Callout */}
      <section className="p-5 rounded-[24px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl shadow-slate-950/10 flex flex-col gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
            Launch In Progress
          </span>
          <h2 className="text-lg font-black tracking-tight leading-snug">
            Something tasty is on the way! 🚀
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            We're preparing a better way to enjoy your campus favourites. Vendor onboarding and menu configurations are underway.
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            Stay tuned for official campus rollout
          </span>
          <Link
            href={APP_ROUTES.HOME}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B00] text-white hover:bg-orange-600 transition shadow-xs"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
