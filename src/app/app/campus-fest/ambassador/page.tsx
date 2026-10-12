'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Trophy, 
  Clock, 
  ChevronLeft, 
  ShieldCheck, 
  ArrowRight,
  Calendar,
  Check,
  AlertCircle,
  Loader2,
  BellRing
} from 'lucide-react';
import toast from 'react-hot-toast';
import { workerClient } from '@/lib/api/workerClient';
import { SessionManager } from '@/utils/SessionManager';
import { APP_ROUTES } from '@/constants/routes';

interface AmbassadorCandidate {
  rank: number;
  student_id: string;
  display_name: string;
  college: string;
  branch: string;
  count: number;
  achieved_at: number;
}

export default function CampusAmbassadorPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);
  const [submittingNotify, setSubmittingNotify] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    workerClient.getAmbassadorStatus()
      .then((res: any) => {
        setData(res.data || res);
      })
      .catch((err) => {
        console.error('Failed to load ambassador details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const settings = data?.settings || {};
  const status = settings.status || 'coming_soon';
  const governingLeaderboard = data?.governing_leaderboard || 'qualified';
  const topCandidates: AmbassadorCandidate[] = data?.top_candidates || [];
  const isClosed = data?.is_closed || false;

  const hasConfiguredDates = Boolean(settings.selection_period_start && settings.selection_period_end);
  const isPeriodActive = hasConfiguredDates && status === 'active';

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'Selection dates to be announced by BLINTZY.';
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return 'Selection dates to be announced by BLINTZY.';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleNotify = async () => {
    const user = SessionManager.getUser();
    const emailToUse = notifyEmail.trim() || user?.email;

    if (!user && !emailToUse && !showEmailInput) {
      setShowEmailInput(true);
      return;
    }

    setSubmittingNotify(true);
    try {
      const res: any = await workerClient.subscribeAmbassadorNotification(emailToUse || undefined);
      const payload = res?.data || res;
      setNotified(true);
      setShowEmailInput(false);
      if (payload?.already_subscribed) {
        toast.success(payload.message || "You're already on the notification list!");
      } else {
        toast.success(payload?.message || "Subscribed! We'll notify you when selection opens.");
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to record notification preference');
    } finally {
      setSubmittingNotify(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-1">
        <Link
          href={APP_ROUTES.CAMPUS_FEST}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Campus Fest Hub</span>
        </Link>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
          Official Programme
        </span>
      </div>

      {/* 2. Authoritative Hero Section */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-7 text-white shadow-xl shadow-indigo-950/15">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-indigo-300" />
            <span>BLINTZY Leadership</span>
          </div>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              BLINTZY Campus Ambassador Programme
            </h1>
            <p className="text-indigo-200 text-sm font-bold mt-1 tracking-wide">
              Earn your place. Represent your campus.
            </p>
          </div>

          <p className="text-white/80 text-xs sm:text-[13px] font-medium leading-relaxed max-w-xl pt-1">
            Campus Ambassadors represent BLINTZY within their college community, help students discover convenient campus printing and academic notes delivery, support approved campus initiatives, and share direct feedback with our team.
          </p>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. Transparent Selection Process Section */}
      <section className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3.5">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2.5 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-gray-900 tracking-tight leading-snug whitespace-nowrap">
                Top-Three Selection Process
              </h2>
            </div>

            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
              isPeriodActive 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : isClosed && status === 'closed'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/80'
            }`}>
              {isPeriodActive 
                ? 'Active Selection Period' 
                : isClosed && status === 'closed' 
                  ? 'Selection Closed' 
                  : hasConfiguredDates 
                    ? 'Applications Opening Soon' 
                    : 'Selection Dates To Be Announced'}
            </span>
          </div>

          <p className="text-xs text-gray-500 font-medium pl-10.5">
            Fair, transparent, and backend-verified
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100/80 text-xs text-gray-700 leading-relaxed font-medium">
          Campus Ambassadors are not appointed arbitrarily. The <strong className="text-gray-900 font-bold">top three eligible students from the Qualified Referrers leaderboard</strong> will be selected as BLINTZY Campus Ambassadors after the announced selection period closes and their results are verified.
        </div>

        {/* Selection Rules & Specifications: Balanced 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-150 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Governing Leaderboard
              </span>
              <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-1">
                <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                Qualified Referrers Board
              </span>
            </div>
            <span className="text-[11px] text-gray-600 font-medium leading-relaxed">
              Ranked by verified paid print orders (min. ₹1.00). Connectors board does not govern selection.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-150 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Selection Window & Term
              </span>
              <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4 text-[#FF6B00] shrink-0" />
                {settings.programme_term || 'Upcoming Academic Term 2026'}
              </span>
            </div>
            <span className="text-[11px] text-gray-600 font-medium leading-relaxed">
              {settings.selection_period_end 
                ? `Closing date: ${formatDate(settings.selection_period_end)}` 
                : 'Selection dates to be announced by BLINTZY.'}
            </span>
          </div>
        </div>

        {/* Tie-breaking and Verification Note */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="font-bold block text-slate-900">Eligibility & Fraud Prevention:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
              <li>Self-referrals and duplicate accounts are strictly disqualified server-side.</li>
              <li>Qualifying referrals require completed, non-cancelled paid print orders (min. ₹1.00).</li>
              <li>Ties are resolved deterministically by earliest achievement timestamp (<code className="text-[10px] font-mono bg-slate-200/70 px-1 py-0.5 rounded">achieved_at</code>).</li>
              <li>Top 3 participants are provisional contenders and verified before final induction.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Live Leaderboard Standings (Current Contenders / Selected) */}
      <section className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-gray-900 tracking-tight leading-tight">
              {isClosed && status === 'closed' ? 'Selected Campus Ambassadors' : 'Provisional Contenders (Top 3)'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Based on live verified Qualified Referrers ranking data
            </p>
          </div>

          <Link
            href={APP_ROUTES.LEADERBOARD}
            className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
          >
            <span>View Full Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Provisional rankings clarification note */}
        {!(isClosed && status === 'closed') && (
          <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/50 flex items-center gap-2 text-[11px] text-amber-900">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Rankings are provisional until the selection period closes and results are verified.</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 w-full bg-gray-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : topCandidates.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-gray-800">No ranked contenders yet</h3>
            <p className="text-[11px] text-gray-500 max-w-xs">
              Be among the first students to refer classmates and establish your place at the top of the Qualified Referrers leaderboard!
            </p>
            <Link
              href={APP_ROUTES.REFER}
              className="mt-2 text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
            >
              <span>Get Your Referral Link</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {topCandidates.slice(0, 3).map((candidate) => {
              const medals = ['🥇', '🥈', '🥉'];
              const borders = ['border-amber-200/90 bg-amber-50/40', 'border-slate-200/90 bg-slate-50/50', 'border-amber-100 bg-amber-50/20'];

              return (
                <div
                  key={candidate.student_id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${borders[candidate.rank - 1] || 'border-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{medals[candidate.rank - 1] || `#${candidate.rank}`}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                          {candidate.display_name}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wide">
                          {isClosed && status === 'closed' ? 'Ambassador' : 'Provisional'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {candidate.branch} • {candidate.college}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#FF6B00]">
                      {candidate.count}
                    </span>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">
                      qualified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Approved Programme Responsibilities */}
      <section className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3.5">
        <h2 className="text-base font-black text-gray-900 tracking-tight">
          Approved Responsibilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
            <div>
              <strong className="text-gray-900 block font-bold">Campus Outreach</strong>
              <span className="text-gray-600 text-[11px] leading-snug">
                Share accurate information about BLINTZY's campus printing and document delivery with peers.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
            <div>
              <strong className="text-gray-900 block font-bold">Campus Promotions Support</strong>
              <span className="text-gray-600 text-[11px] leading-snug">
                Support approved college fest initiatives and help classmates take advantage of verified offers.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
            <div>
              <strong className="text-gray-900 block font-bold">Student Feedback</strong>
              <span className="text-gray-600 text-[11px] leading-snug">
                Gather real feedback from students on printing requirements, notes access, and campus needs.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
            <div>
              <strong className="text-gray-900 block font-bold">Sharing Accurate Service Updates</strong>
              <span className="text-gray-600 text-[11px] leading-snug">
                Help the team communicate new service options, operational hours, and exam-time schedules.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Proposed Benefits (Subject to final administrative authorization) */}
      <section className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900 tracking-tight">
              Proposed Programme Benefits
            </h2>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              Proposed
            </span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Subject to final administrative authorization upon programme launch:
          </p>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Official BLINTZY Campus Ambassador Certificate & Verification Letter (Proposed)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Direct collaboration with the BLINTZY engineering & operations team (Proposed)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Verified student leadership representation on your college campus (Proposed)</span>
          </div>
        </div>
      </section>

      {/* 7. Action / Notification Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="font-bold text-slate-800">
              {isPeriodActive 
                ? 'Selection window is active' 
                : isClosed && status === 'closed'
                  ? 'Selection Closed'
                  : 'Selection dates to be announced by BLINTZY.'}
            </span>
          </div>

          <button
            onClick={handleNotify}
            disabled={notified || submittingNotify}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              notified
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs disabled:opacity-70'
            }`}
          >
            {submittingNotify ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : notified ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>✓ Subscribed for Updates</span>
              </>
            ) : (
              <>
                <BellRing className="w-3.5 h-3.5" />
                <span>Notify Me When Active</span>
              </>
            )}
          </button>
        </div>

        {/* Optional Email Input for unauthenticated visitors */}
        {showEmailInput && !notified && (
          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="Enter your college email for alerts"
              className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleNotify}
              disabled={submittingNotify || !notifyEmail.trim()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
