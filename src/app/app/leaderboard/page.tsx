'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Users, 
  Medal, 
  RefreshCw, 
  ChevronLeft, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { workerClient } from '@/lib/api/workerClient';

interface LeaderboardEntry {
  rank: number;
  student_id: string;
  display_name: string;
  college: string;
  branch: string;
  count: number;
  achieved_at: number;
}

export default function LeaderboardsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'connectors' | 'qualified'>('connectors');
  const [connectorsList, setConnectorsList] = useState<LeaderboardEntry[]>([]);
  const [qualifiedList, setQualifiedList] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLeaderboards = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const [resConnectors, resQualified] = await Promise.all([
        workerClient.getReferralLeaderboard('connectors', 50),
        workerClient.getReferralLeaderboard('qualified', 50)
      ]);

      if (resConnectors?.leaderboard) {
        setConnectorsList(resConnectors.leaderboard);
      }
      if (resQualified?.leaderboard) {
        setQualifiedList(resQualified.leaderboard);
      }
    } catch (err: any) {
      console.error('Failed to load leaderboards:', err);
      setErrorMsg(err.message || 'Failed to load leaderboards');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboards();
  }, [fetchLeaderboards]);

  const currentList = activeTab === 'connectors' ? connectorsList : qualifiedList;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-black flex items-center justify-center shadow-md shadow-amber-500/20 text-xs">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-gray-400 text-white font-black flex items-center justify-center shadow-md shadow-slate-500/20 text-xs">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black flex items-center justify-center shadow-md shadow-orange-700/20 text-xs">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-black flex items-center justify-center text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between px-1">
        <Link
          href="/app/campus-fest"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Campus Fest Hub</span>
        </Link>
        {/* Refresh Action */}
        <button
          onClick={() => fetchLeaderboards(true)}
          disabled={isRefreshing || isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200/60 text-xs font-bold text-[#FF6B00] transition active:scale-95 disabled:opacity-50"
          title="Refresh rankings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button 
              onClick={() => fetchLeaderboards(true)} 
              className="text-xs font-bold underline ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Segmented Control / Tabs */}
        <div className="p-1 rounded-2xl bg-gray-100 flex items-center gap-1 border border-gray-200/70">
          <button
            onClick={() => setActiveTab('connectors')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'connectors'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Connectors</span>
          </button>

          <button
            onClick={() => setActiveTab('qualified')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qualified'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Qualified Referrers</span>
          </button>
        </div>

        {/* Tab Description Banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-gray-100 text-xs text-gray-600 shadow-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
          <div className="flex-1">
            {activeTab === 'connectors' ? (
              <p>
                <strong className="text-gray-900 font-bold">Campus Connectors</strong> ranks students by total valid attributed registrations on Blintzy.
              </p>
            ) : (
              <p>
                <strong className="text-gray-900 font-bold">Qualified Referrers</strong> ranks students whose referred friends have completed at least one qualifying order of ₹1 or more.
              </p>
            )}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Student / Branch
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {activeTab === 'connectors' ? 'Signups' : 'Qualified'}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full bg-gray-50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : currentList.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-1">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No rankings yet</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Be the first to invite your classmates and lead the campus rankings!
              </p>
              <Link
                href="/app/refer"
                className="mt-3 inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#FF6B00] text-white text-xs font-bold shadow-md shadow-orange-950/20 hover:bg-orange-600 transition"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Start Referring</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {currentList.map((entry) => (
                <div 
                  key={entry.student_id} 
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-gray-50/60 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    {getRankBadge(entry.rank)}

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {entry.display_name}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {entry.branch} • {entry.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-black text-sm text-gray-900">
                    <span className="text-base text-[#FF6B00]">
                      {entry.count}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Card to Refer & Earn */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Want to join the top referrers?</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Share your link to climb both boards.</p>
          </div>
          <Link
            href="/app/refer"
            className="py-2 px-3.5 rounded-xl bg-[#FF6B00] text-white text-xs font-bold shrink-0 hover:bg-orange-600 transition flex items-center gap-1"
          >
            <span>Refer Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
