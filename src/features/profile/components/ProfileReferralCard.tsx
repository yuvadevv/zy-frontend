'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, ChevronRight, Sparkles, Users } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';

export const ProfileReferralCard = () => {
  const [stats, setStats] = useState<{ total: number; qualified: number } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await workerClient.getReferralDetails();
        if (res?.stats) {
          setStats({
            total: res.stats.total_attributed || 0,
            qualified: res.stats.qualified_referrals || 0
          });
        }
      } catch (err) {
        // Fallback gracefully if guest or network error
      }
    }
    loadStats();
  }, []);

  return (
    <Link
      href="/app/refer"
      className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-emerald-200 transition-all active:scale-[0.99] mb-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Gift className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              Refer & Earn
            </h3>
            {stats && stats.total > 0 ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {stats.total} Invited
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Rewards</span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Invite classmates and track your referrals.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 shrink-0">
        <span className="hidden xs:inline">Open</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};
