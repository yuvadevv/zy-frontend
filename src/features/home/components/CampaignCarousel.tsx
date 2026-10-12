'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Gift, 
  Users, 
  Compass, 
  Music2, 
  ArrowRight, 
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { workerClient } from '@/lib/api/workerClient';

interface CampaignCardData {
  id: string;
  type: string;
  title: string;
  message: string;
  cta_label: string;
  cta_url: string;
  image_key?: string;
  image_url?: string;
  theme: string;
  icon: string;
  badge: string;
  priority: number;
  starts_at?: number;
  expires_at?: number;
}

// 5 Curated Campus Campaign Definitions with Authentic Student Photography
const DEFAULT_CAMPAIGNS: CampaignCardData[] = [
  {
    id: 'camp_fest_30_off',
    type: 'campaign',
    title: 'BLINTZY Campus Fest',
    message: 'Celebrate campus life! Special student savings on all printing & academic notes.',
    cta_label: 'View Offers',
    cta_url: '/app/offers',
    image_url: '/images/banners/banner_campus_fest.jpg',
    theme: 'orange_fest',
    icon: 'Sparkles',
    badge: 'CAMPUS FEST',
    priority: 50,
  },
  {
    id: 'camp_smart_printing',
    type: 'campaign',
    title: 'Smart Printing',
    message: 'Fast lab records, lecture notes & project manuals ready before your class.',
    cta_label: 'Order Prints',
    cta_url: '/app/services',
    image_url: '/images/banners/banner_smart_printing.jpg',
    theme: 'smart_printing',
    icon: 'Printer',
    badge: 'INSTANT PRINT',
    priority: 45,
  },
  {
    id: 'camp_dussehra_dandiya_special',
    type: 'campaign',
    title: 'Dussehra & Dandiya Special',
    message: 'Celebrate the festive rhythm! Limited-time festive campus offers on all print orders.',
    cta_label: 'Explore Offers',
    cta_url: '/app/offers',
    image_url: '/images/banners/banner_dandiya_festive.jpg',
    theme: 'amber_festive',
    icon: 'Music2',
    badge: 'FESTIVE SPECIAL',
    priority: 40,
    starts_at: Date.now() - 86400000,
    expires_at: Date.now() + 14 * 86400000,
  },
  {
    id: 'camp_refer_earn',
    type: 'campaign',
    title: 'Refer & Earn',
    message: 'Invite campus friends and earn free printing credits on their first order.',
    cta_label: 'Invite Friends',
    cta_url: '/app/refer',
    image_url: '/images/banners/banner_refer_earn.jpg',
    theme: 'emerald_refer',
    icon: 'Gift',
    badge: 'PEER REWARDS',
    priority: 35,
  },
  {
    id: 'camp_ambassador_program',
    type: 'campaign',
    title: 'Campus Ambassador',
    message: 'Represent Blintzy at your branch. Lead campus initiatives & earn leadership perks.',
    cta_label: 'View Programme',
    cta_url: '/app/campus-fest/ambassador',
    image_url: '/images/banners/banner_campus_ambassador.jpg',
    theme: 'royal_indigo',
    icon: 'Users',
    badge: 'OFFICIAL PROGRAMME',
    priority: 30,
  }
];

interface CardThemeStyle {
  scrimGradient: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  tagColor: string;
  ctaButton: string;
  accentBorder: string;
  fallbackFallbackImage: string;
}

const THEME_STYLES: Record<string, CardThemeStyle> = {
  // 1. BLINTZY Campus Fest
  orange_fest: {
    scrimGradient: 'from-black/60 via-black/35 to-transparent sm:from-black/55 sm:via-black/28 sm:to-transparent',
    badgeBg: 'bg-[#FF6B00]',
    badgeText: 'text-white',
    badgeBorder: 'border-orange-400/40',
    tagColor: 'text-orange-300',
    ctaButton: 'bg-[#FF6B00] text-white hover:bg-orange-600 active:scale-95 shadow-md shadow-orange-950/30',
    accentBorder: 'border-orange-500/20',
    fallbackFallbackImage: '/images/banners/banner_campus_fest.jpg'
  },
  orange_gradient: {
    scrimGradient: 'from-black/60 via-black/35 to-transparent sm:from-black/55 sm:via-black/28 sm:to-transparent',
    badgeBg: 'bg-[#FF6B00]',
    badgeText: 'text-white',
    badgeBorder: 'border-orange-400/40',
    tagColor: 'text-orange-300',
    ctaButton: 'bg-[#FF6B00] text-white hover:bg-orange-600 active:scale-95 shadow-md shadow-orange-950/30',
    accentBorder: 'border-orange-500/20',
    fallbackFallbackImage: '/images/banners/banner_campus_fest.jpg'
  },
  // 2. Smart Printing
  smart_printing: {
    scrimGradient: 'from-slate-950/62 via-slate-900/35 to-transparent sm:from-slate-950/55 sm:via-slate-900/28 sm:to-transparent',
    badgeBg: 'bg-teal-600',
    badgeText: 'text-white',
    badgeBorder: 'border-teal-400/40',
    tagColor: 'text-teal-300',
    ctaButton: 'bg-teal-500 text-white hover:bg-teal-600 active:scale-95 shadow-md shadow-slate-950/30',
    accentBorder: 'border-teal-500/20',
    fallbackFallbackImage: '/images/banners/banner_smart_printing.jpg'
  },
  charcoal_dark: {
    scrimGradient: 'from-slate-950/62 via-slate-900/35 to-transparent sm:from-slate-950/55 sm:via-slate-900/28 sm:to-transparent',
    badgeBg: 'bg-teal-600',
    badgeText: 'text-white',
    badgeBorder: 'border-teal-400/40',
    tagColor: 'text-teal-300',
    ctaButton: 'bg-teal-500 text-white hover:bg-teal-600 active:scale-95 shadow-md shadow-slate-950/30',
    accentBorder: 'border-teal-500/20',
    fallbackFallbackImage: '/images/banners/banner_smart_printing.jpg'
  },
  // 3. Dussehra & Dandiya Special
  amber_festive: {
    scrimGradient: 'from-amber-950/64 via-amber-950/38 to-transparent sm:from-amber-950/56 sm:via-amber-950/28 sm:to-transparent',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-amber-950 font-black',
    badgeBorder: 'border-amber-300/60',
    tagColor: 'text-amber-300',
    ctaButton: 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-300 active:scale-95 shadow-md shadow-amber-950/30',
    accentBorder: 'border-amber-400/30',
    fallbackFallbackImage: '/images/banners/banner_dandiya_festive.jpg'
  },
  // 4. Refer & Earn
  emerald_refer: {
    scrimGradient: 'from-emerald-950/62 via-emerald-950/35 to-transparent sm:from-emerald-950/55 sm:via-emerald-950/28 sm:to-transparent',
    badgeBg: 'bg-emerald-700',
    badgeText: 'text-white',
    badgeBorder: 'border-emerald-400/40',
    tagColor: 'text-emerald-300',
    ctaButton: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95',
    accentBorder: 'border-emerald-500/20',
    fallbackFallbackImage: '/images/banners/banner_refer_earn.jpg'
  },
  cream_emerald: {
    scrimGradient: 'from-emerald-950/62 via-emerald-950/35 to-transparent sm:from-emerald-950/55 sm:via-emerald-950/28 sm:to-transparent',
    badgeBg: 'bg-emerald-700',
    badgeText: 'text-white',
    badgeBorder: 'border-emerald-400/40',
    tagColor: 'text-emerald-300',
    ctaButton: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95',
    accentBorder: 'border-emerald-500/20',
    fallbackFallbackImage: '/images/banners/banner_refer_earn.jpg'
  },
  // 5. Campus Ambassador
  royal_indigo: {
    scrimGradient: 'from-indigo-950/62 via-indigo-950/35 to-transparent sm:from-indigo-950/55 sm:via-indigo-950/28 sm:to-transparent',
    badgeBg: 'bg-indigo-600',
    badgeText: 'text-white',
    badgeBorder: 'border-indigo-400/40',
    tagColor: 'text-indigo-300',
    ctaButton: 'bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95',
    accentBorder: 'border-indigo-500/20',
    fallbackFallbackImage: '/images/banners/banner_campus_ambassador.jpg'
  }
};

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Printer,
  Music2,
  Gift,
  Users,
  Compass
};

export const CampaignCarousel = () => {
  const [campaigns, setCampaigns] = useState<CampaignCardData[]>(DEFAULT_CAMPAIGNS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoRotateTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await workerClient.getContent('campaign');
        const content = res.content || res || [];
        if (Array.isArray(content) && content.length > 0) {
          const now = Date.now();
          const valid = content.filter((c: any) => {
            const hasStarted = !c.starts_at || Number(c.starts_at) <= now;
            const notExpired = !c.expires_at || Number(c.expires_at) > now;
            return hasStarted && notExpired;
          });

          if (valid.length > 0) {
            const mapped = valid.map((item: any, idx: number) => {
              const fallback = DEFAULT_CAMPAIGNS[idx % DEFAULT_CAMPAIGNS.length];
              let matchedImage = item.image_key || item.image_url;
              if (!matchedImage) {
                if (item.id?.includes('fest')) matchedImage = '/images/banners/banner_campus_fest.jpg';
                else if (item.id?.includes('print') || item.id?.includes('service')) matchedImage = '/images/banners/banner_smart_printing.jpg';
                else if (item.id?.includes('dussehra') || item.id?.includes('dandiya')) matchedImage = '/images/banners/banner_dandiya_festive.jpg';
                else if (item.id?.includes('refer')) matchedImage = '/images/banners/banner_refer_earn.jpg';
                else if (item.id?.includes('ambassador')) matchedImage = '/images/banners/banner_campus_ambassador.jpg';
                else matchedImage = fallback.image_url;
              }

              return {
                id: item.id || `camp_${idx}`,
                type: item.type || 'campaign',
                title: item.title || fallback.title,
                message: item.message || fallback.message,
                cta_label: item.cta_label || fallback.cta_label,
                cta_url: item.cta_url || fallback.cta_url,
                image_url: matchedImage,
                theme: item.theme || fallback.theme,
                icon: item.icon || fallback.icon,
                badge: item.badge || fallback.badge,
                priority: item.priority || 50 - idx,
                starts_at: item.starts_at,
                expires_at: item.expires_at
              };
            });
            setCampaigns(mapped);
          }
        }
      } catch (err) {
        console.warn('Using curated campus campaigns:', err);
      }
    }
    loadCampaigns();
  }, []);

  // Update currentIndex smoothly based on user scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(el.scrollLeft / width);
      if (newIndex >= 0 && newIndex < campaigns.length && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }, [campaigns.length, currentIndex]);

  // Programmatic scroll to a specific slide dot
  const scrollToSlide = (idx: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.clientWidth,
      behavior: 'smooth'
    });
    setCurrentIndex(idx);
  };

  // Gentle auto-rotation when user is not touching/interacting
  useEffect(() => {
    if (isInteracting || campaigns.length <= 1) {
      if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
      return;
    }

    autoRotateTimer.current = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const nextIdx = (currentIndex + 1) % campaigns.length;
      el.scrollTo({
        left: nextIdx * el.clientWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(nextIdx);
    }, 6000);

    return () => {
      if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
    };
  }, [currentIndex, isInteracting, campaigns.length]);

  if (campaigns.length === 0) return null;

  return (
    <div 
      className="w-full relative px-1 select-none"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => {
        // Resume after 3.5 seconds idle
        setTimeout(() => setIsInteracting(false), 3500);
      }}
    >
      {/* Side-movable horizontal swipe snap container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none rounded-[24px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {campaigns.map((card, idx) => {
          const theme = THEME_STYLES[card.theme] || THEME_STYLES.orange_fest;
          const IconComponent = ICON_MAP[card.icon] || Sparkles;
          const isComingSoon = card.badge?.toLowerCase().includes('coming soon') || !card.cta_url;
          const imageUrl = card.image_url || theme.fallbackFallbackImage;

          return (
            <div
              key={card.id || idx}
              className="w-full shrink-0 snap-center relative overflow-hidden rounded-[26px] h-[235px] sm:h-[260px] border border-white/10 bg-gray-950 flex flex-col justify-between shadow-sm"
            >
              {/* Authentic Student Photography Background */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                  src={imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover object-[center_20%] sm:object-center transform scale-[1.01] brightness-[1.04] contrast-[1.02]"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                {/* Scrim Gradient Overlay for High Contrast Text (Reduced Opacity, Brighter Photos) */}
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.scrimGradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              </div>

              {/* Foreground Card Content */}
              <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full flex-1">
                {/* Top Row: Badge Only (Numeric Slide Counter Removed) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {card.badge && (
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-black tracking-wider uppercase px-3 py-1 rounded-full border shadow-xs ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{card.badge}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Title & Message with Extra Breathing Room */}
                <div className="my-auto py-1 max-w-[310px] sm:max-w-lg">
                  <h2 className="text-2xl sm:text-[28px] font-black text-white tracking-tight leading-[1.18] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {card.title}
                  </h2>
                  <p className="text-[13px] sm:text-[15px] text-white font-medium mt-1.5 leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                    {card.message}
                  </p>
                </div>

                {/* Bottom Row: Working CTA or Coming Soon Button */}
                <div className="pt-2 flex items-center justify-between">
                  {isComingSoon ? (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-white/75 bg-white/20 backdrop-blur-md border border-white/15 py-2 px-4 rounded-xl cursor-not-allowed">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>{card.cta_label || 'Coming Soon'}</span>
                    </div>
                  ) : (
                    <Link
                      href={card.cta_url}
                      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-2xl transition-all group ${theme.ctaButton}`}
                    >
                      <span>{card.cta_label || 'View Offers'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots below the cards (Identical to Track Order Hero dots) */}
      {campaigns.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {campaigns.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className="p-1 -m-1 cursor-pointer"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-5 bg-[#FF6B00]' : 'w-1.5 bg-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
