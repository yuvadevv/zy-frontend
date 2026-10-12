'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, 
  Tag, 
  Gift, 
  Trophy, 
  Award, 
  RefreshCw, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  UtensilsCrossed
} from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';
import { APP_ROUTES } from '@/constants/routes';
import { CampusFestBannerCarousel } from './CampusFestBannerCarousel';

interface CampaignContent {
  id?: string;
  title?: string;
  message?: string;
  description?: string;
  badge?: string;
  image_url?: string;
}

export default function CampusFestHubPage() {
  const shouldReduceMotion = useReducedMotion();

  // Authoritative State
  const [activeOffersCount, setActiveOffersCount] = useState<number | null>(null);
  const [featuredCampaign, setFeaturedCampaign] = useState<CampaignContent | null>(null);
  const [ambassadorStatus, setAmbassadorStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadHubData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const [offersRes, contentRes, ambRes] = await Promise.all([
        workerClient.getOffers().catch(() => ({ offers: [] })),
        workerClient.getContent('announcement').catch(() => ({ content: [] })),
        workerClient.getAmbassadorStatus().catch(() => null)
      ]);

      // 1. Authoritative festival deals count: 6 launch tickets (B&W double, single, color, spiral, hall tickets, manuals) + active promotional vouchers
      const activeVouchers = (offersRes?.offers || []).filter((o: any) => o.is_active);
      const totalFestDeals = 6 + (activeVouchers.length || 0);
      setActiveOffersCount(totalFestDeals);

      // 2. Featured Campaign announcement/banner
      const items = contentRes?.content || contentRes || [];
      if (Array.isArray(items) && items.length > 0) {
        setFeaturedCampaign(items[0]);
      } else {
        setFeaturedCampaign({
          title: 'Campus Fest Special Launch Rates',
          message: 'Dussehra & Campus Fest special rates are live across B&W, colour and spiral binding.',
          badge: 'FESTIVAL LIVE'
        });
      }

      // 3. Ambassador status
      if (ambRes?.data) {
        setAmbassadorStatus(ambRes.data);
      } else if (ambRes?.settings) {
        setAmbassadorStatus(ambRes);
      }
    } catch (err: any) {
      console.warn('Failed to load Campus Fest hub data:', err);
      setErrorMsg('Could not refresh live festival status. Showing cached details.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHubData();
  }, [loadHubData]);

  // Derived ambassador badge label
  const ambassadorBadge = ambassadorStatus?.settings?.status === 'active' 
    ? 'Active Selection' 
    : ambassadorStatus?.settings?.status === 'closed'
      ? 'Selection Finalized'
      : 'Top 3 Selection';

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
            Festival Central Hub
          </span>
        </div>

        <button
          onClick={() => loadHubData(true)}
          disabled={isRefreshing || isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200/60 text-[11px] font-bold text-[#FF6B00] transition active:scale-95 disabled:opacity-50"
          title="Refresh campus data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Updating...' : 'Live Refresh'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mx-1 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => loadHubData(true)} className="underline font-bold ml-2">Retry</button>
        </div>
      )}

      {/* 2. Advanced Multi-Banner Festival Carousel */}
      <CampusFestBannerCarousel />

      {/* 3. Featured Campaign Banner */}
      {featuredCampaign && (
        <div className="p-4 rounded-[22px] bg-gradient-to-r from-orange-50/95 via-amber-50/80 to-orange-50/90 border border-orange-200/90 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] bg-white/80 border border-orange-200/80 px-2 py-0.5 rounded-md">
                  {featuredCampaign.badge || 'FEATURED CAMPAIGN'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-orange-950 mt-1 leading-snug truncate">
                {featuredCampaign.title}
              </h3>
              <p className="text-[11px] text-orange-800/80 font-medium mt-0.5 line-clamp-1">
                {featuredCampaign.message || featuredCampaign.description}
              </p>
            </div>
          </div>
          <Link
            href={APP_ROUTES.OFFERS}
            className="shrink-0 p-2 text-[#FF6B00] hover:text-orange-700 font-bold"
            title="View campaign offers"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      {/* 4. Four Attractive Category Hubs */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            Explore Festival Categories
          </h2>
          <span className="text-[11px] font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
            4 Live Hubs • 1 Preview
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Card 1: Offers & Deals */}
          <Link
            href={APP_ROUTES.OFFERS}
            className="group relative overflow-hidden rounded-[24px] bg-white border border-gray-100 hover:border-orange-200 p-4.5 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                  <Tag className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-[#FF6B00] transition-colors leading-tight">
                    Offers & Deals
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500">
                    Launch Pricing Active
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200/80 shrink-0 whitespace-nowrap">
                {activeOffersCount !== null ? `${activeOffersCount} Active Deals` : '6 Active Deals'}
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Special student launch rates verified across B&W, colour and spiral binding. Applied automatically at checkout.
            </p>

            {/* Micro Feature Perks Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                ⚡ B&W ₹3.50/sheet
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🎨 Colour ₹8.00/page
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                📘 Binding ₹30
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF6B00]">
              <span>Browse All Promotional Tickets</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Refer & Earn */}
          <Link
            href={APP_ROUTES.REFER}
            className="group relative overflow-hidden rounded-[24px] bg-white border border-gray-100 hover:border-emerald-200 p-4.5 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                  <Gift className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                    Refer & Earn
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                    Peer Rewards Program
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 whitespace-nowrap">
                Live Rewards
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Share your personal link with classmates. Earn wallet cash bonuses on verified qualifying print orders.
            </p>

            {/* Micro Feature Perks Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🎁 Instant Wallet Credit
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                ✨ Free Print Bonuses
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                ⚡ Real-time Tracking
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>View Referral Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Campus Leaderboard */}
          <Link
            href={APP_ROUTES.LEADERBOARD}
            className="group relative overflow-hidden rounded-[24px] bg-white border border-gray-100 hover:border-amber-200 p-4.5 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-amber-600 transition-colors leading-tight">
                    Campus Leaderboard
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                    Transparent Rankings
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0 whitespace-nowrap">
                Live Rankings
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Official student standings for top referrers and promoters with transparent attribution and milestone badges.
            </p>

            {/* Micro Feature Perks Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🏆 Campus Standings
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                📊 Order Verification
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🎖️ Milestone Badges
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Check Live Standings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Campus Ambassador Programme */}
          <Link
            href={APP_ROUTES.AMBASSADOR}
            className="group relative overflow-hidden rounded-[24px] bg-white border border-gray-100 hover:border-indigo-200 p-4.5 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    Campus Ambassador Programme
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                    Official Appointment
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shrink-0 whitespace-nowrap">
                {ambassadorBadge}
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Represent your department and branch. Top 3 verified achievers from the leaderboard are selected as campus ambassadors.
            </p>

            {/* Micro Feature Perks Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🎓 Top 3 Selected
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                📜 Official Certificate
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                💼 Leadership Kit
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Explore Ambassador Selection Rules</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Campus Food (Coming Soon) */}
          <Link
            id="campus-food"
            href={APP_ROUTES.CAMPUS_FOOD}
            className="group relative overflow-hidden rounded-[24px] bg-white border border-gray-100 hover:border-orange-300 p-4.5 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                  <UtensilsCrossed className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-[#FF6B00] transition-colors leading-tight">
                    Campus Food
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B00]">
                    Your favourites. One campus destination.
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200/80 shrink-0 whitespace-nowrap">
                COMING SOON
              </span>
            </div>

            {/* Food Thumbnail Visual */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-orange-50">
              <img
                src="/images/banners/banner_campus_food.jpg"
                alt="BLINTZY Campus Food Spread"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                <span>Canteen Meals, Pizza, Curries & Snacks</span>
                <span className="text-[9px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">Order Online & Collect</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Explore upcoming campus food options, from canteen meals and curries to pizza, fried rice, snacks and more. Order online and collect using your order ID when the service launches.
            </p>

            {/* Micro Feature Perks Bar (Planned Categories) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🍕 Pizza
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🍛 Curries & Rice
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🍜 Fried Rice & Noodles
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🥪 Snacks & Quick Bites
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                🏢 Canteen Meals
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF6B00]">
              <span>Discover Campus Food Preview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
