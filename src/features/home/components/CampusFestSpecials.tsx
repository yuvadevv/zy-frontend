'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Gift, Trophy, Award, ArrowRight, Sparkles } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';
import { APP_ROUTES } from '@/constants/routes';

export const CampusFestSpecials = () => {
  const [referralStats, setReferralStats] = useState<{ total: number; qualified: number } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await workerClient.getReferralDetails();
        if (res?.stats) {
          setReferralStats({
            total: res.stats.total_attributed || 0,
            qualified: res.stats.qualified_referrals || 0
          });
        }
      } catch (e) {
        // Unauthenticated or network idle — gracefully ignore
      }
    }
    loadStats();
  }, []);

  return (
    <section className="w-full px-1 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-[18px] font-black text-gray-900 tracking-tight leading-none">
              Campus Fest Specials
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
          </div>
          <p className="text-[12px] font-medium text-gray-500 mt-0.5">
            More happening on your campus.
          </p>
        </div>

        <Link 
          href="/app/campus-fest"
          className="text-orange-500 font-bold text-[13px] flex items-center group active:text-orange-600 transition-colors"
        >
          <span>Fest Hub</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Card 1: Offers (Orange) */}
        <Link
          href="/app/offers"
          className="group relative flex flex-col justify-between min-h-[148px] p-3.5 sm:p-4 rounded-[22px] bg-white border border-orange-200 shadow-[0_4px_16px_rgba(255,107,0,0.06)] hover:shadow-md hover:border-orange-300 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-100">
              Active
            </span>
          </div>

          <div className="mt-2.5 flex-1">
            <h3 className="text-[14px] font-bold text-[#FF6B00] leading-tight">
              Offers
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5 line-clamp-1">
              Explore active deals
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-orange-100/60 flex items-center justify-between text-[11px] font-bold text-[#FF6B00]">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Card 2: Refer & Earn (Emerald Green) */}
        <Link
          href="/app/refer"
          className="group relative flex flex-col justify-between min-h-[148px] p-3.5 sm:p-4 rounded-[22px] bg-white border border-emerald-200 shadow-[0_4px_16px_rgba(16,185,129,0.06)] hover:shadow-md hover:border-emerald-300 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
              <Gift className="w-4 h-4" />
            </div>
            {referralStats && referralStats.total > 0 ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {referralStats.total} Invited
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                New
              </span>
            )}
          </div>

          <div className="mt-2.5 flex-1">
            <h3 className="text-[14px] font-bold text-emerald-700 leading-tight">
              Refer & Earn
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5 line-clamp-1">
              Invite friends & earn
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-emerald-100/60 flex items-center justify-between text-[11px] font-bold text-emerald-600">
            <span>Refer</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Card 3: Leaderboard (Amber Gold) */}
        <Link
          href="/app/leaderboard"
          className="group relative flex flex-col justify-between min-h-[148px] p-3.5 sm:p-4 rounded-[22px] bg-white border border-amber-200 shadow-[0_4px_16px_rgba(245,158,11,0.06)] hover:shadow-md hover:border-amber-300 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Live
            </span>
          </div>

          <div className="mt-2.5 flex-1">
            <h3 className="text-[14px] font-bold text-amber-700 leading-tight">
              Leaderboard
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5 line-clamp-1">
              Top campus rankers
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-amber-100/60 flex items-center justify-between text-[11px] font-bold text-amber-600">
            <span>Rankings</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Card 4: Ambassadors (Indigo Blue) */}
        <Link
          href={APP_ROUTES.AMBASSADOR}
          className="group relative flex flex-col justify-between min-h-[148px] p-3.5 sm:p-4 rounded-[22px] bg-white border border-indigo-200 shadow-[0_4px_16px_rgba(99,102,241,0.06)] hover:shadow-md hover:border-indigo-300 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Official
            </span>
          </div>

          <div className="mt-2.5 flex-1">
            <h3 className="text-[14px] font-bold text-indigo-700 leading-tight">
              Ambassadors
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5 line-clamp-1">
              Top 3 selection programme
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-indigo-100/60 flex items-center justify-between text-[11px] font-bold text-indigo-600">
            <span>Programme</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </section>
  );
};
