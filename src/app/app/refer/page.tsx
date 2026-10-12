'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw, 
  Trophy, 
  Users, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  ChevronLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { workerClient } from '@/lib/api/workerClient';

interface ReferralStats {
  total_attributed: number;
  pending_qualification: number;
  qualified_referrals: number;
  connector_rank: number | null;
  qualified_rank: number | null;
}

export default function ReferAndEarnPage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [stats, setStats] = useState<ReferralStats>({
    total_attributed: 0,
    pending_qualification: 0,
    qualified_referrals: 0,
    connector_rank: null,
    qualified_rank: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchReferralData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const res = await workerClient.getReferralDetails();
      if (res) {
        setReferralCode(res.referral_code || '');
        // Determine canonical base URL
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://blintzy.in';
        const cleanBase = origin.includes('localhost') ? origin : 'https://blintzy.in';
        setReferralLink(`${cleanBase}/signup?ref=${res.referral_code}`);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err: any) {
      console.error('Failed to load referral details:', err);
      setErrorMsg(err.message || 'Failed to load fresh referral data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  const handleCopyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handleCopyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;
    const shareData = {
      title: 'Join Blintzy — Campus Services & Printing',
      text: `Hey! Use my referral code ${referralCode} to sign up on Blintzy for instant campus printing & notes:`,
      url: referralLink
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share dialog
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
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
        {/* Authoritative Refresh Action */}
        <button
          onClick={() => fetchReferralData(true)}
          disabled={isRefreshing || isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200/60 text-xs font-bold text-[#FF6B00] transition active:scale-95 disabled:opacity-50"
          title="Refresh referral statistics"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button 
              onClick={() => fetchReferralData(true)} 
              className="text-xs font-bold underline ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-5 sm:p-6 shadow-xl shadow-slate-950/10 border border-slate-800">
          <div className="relative z-10 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 w-fit">
              <Sparkles className="w-3 h-3" />
              Campus Referral Programme
            </span>

            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Invite Friends, Climb the Campus Rankings
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Share your link with classmates. Track both attributed signups and qualified referrals with verified backend progress.
            </p>

            {/* Quick Link to Leaderboards */}
            <div className="pt-2">
              <Link
                href="/app/leaderboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition group"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Campus Leaderboards</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Share Section: Code & Link */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Your Unique Referral Code
            </span>
            <div className="mt-1.5 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gray-50 border border-gray-200/80">
              <div className="font-mono text-lg font-black tracking-widest text-gray-900 px-2 select-all">
                {isLoading ? '••••••••' : referralCode || 'GENERATING...'}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyCode}
                  disabled={!referralCode}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition active:scale-95 shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Row: Copy Link & Native Share */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              disabled={!referralLink}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={!referralLink}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-orange-950/20"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Server-Calculated Referral Statistics */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
              Your Referral Progress
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Server Verified
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Stat 1: Total Attributed */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-500">Signups</span>
              <span className="text-xl font-black text-slate-900 mt-1">
                {isLoading ? '-' : stats.total_attributed}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Attributed
              </span>
            </div>

            {/* Stat 2: Pending Qualification */}
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-amber-700">Pending</span>
              <span className="text-xl font-black text-amber-900 mt-1">
                {isLoading ? '-' : stats.pending_qualification}
              </span>
              <span className="text-[10px] text-amber-600 font-medium mt-0.5">
                No orders yet
              </span>
            </div>

            {/* Stat 3: Qualified Referrals */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-emerald-700">Qualified</span>
              <span className="text-xl font-black text-emerald-900 mt-1">
                {isLoading ? '-' : stats.qualified_referrals}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium mt-0.5">
                Order ₹1+
              </span>
            </div>
          </div>

          {/* Ranks Row */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Connectors Rank
                </span>
                <span className="text-sm font-black text-gray-900 mt-0.5">
                  {stats.connector_rank ? `#${stats.connector_rank}` : 'Unranked'}
                </span>
              </div>
              <Users className="w-4 h-4 text-gray-400" />
            </div>

            <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Qualified Rank
                </span>
                <span className="text-sm font-black text-gray-900 mt-0.5">
                  {stats.qualified_rank ? `#${stats.qualified_rank}` : 'Unranked'}
                </span>
              </div>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-gray-900 font-black text-sm">
            <HelpCircle className="w-4 h-4 text-[#FF6B00]" />
            <span>How Referral Qualification Works</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Share with Classmates</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  Send your referral code or direct signup link to friends in your branch or college.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Attributed Registration</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  When they register with your code, they appear under <strong className="text-gray-700">Signups (Pending)</strong> and you gain points on the <strong className="text-gray-700">Campus Connectors</strong> leaderboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">First Qualifying Order (₹1+)</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  Once your referred friend completes their first paid print order with a final value of ₹1 or more, the referral transitions to <strong className="text-emerald-700">Qualified</strong> and counts on the <strong className="text-emerald-700">Qualified Referrers</strong> leaderboard.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2.5 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Self-referrals and duplicate accounts are strictly prevented.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
