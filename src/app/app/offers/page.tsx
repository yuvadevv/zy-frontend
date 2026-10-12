'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { workerClient } from '@/lib/api/workerClient';
import { useCart } from '@/features/cart/providers/CartProvider';
import { 
  Tag, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  Loader2, 
  ChevronLeft, 
  Clock, 
  Printer,
  FileText,
  Palette,
  BookOpen,
  Ticket,
  Copy,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '@/constants/routes';

import { OfferTicketCard, OfferTicketData } from '@/features/offers/components/OfferTicketCard';

type CategoryFilter = 'all' | 'printing' | 'binding' | 'exams_manuals';

export default function OffersPage() {
  const router = useRouter();
  const { offer: currentOffer, applyOffer } = useCart();
  
  // Data State
  const [offers, setOffers] = useState<any[]>([]);
  const [pricingSettings, setPricingSettings] = useState<any>(null);
  const [launchPricing, setLaunchPricing] = useState<any>(null);
  const [bindingRules, setBindingRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingCode, setApplyingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Category Filter
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [offersRes, pricingRes, bindingRes] = await Promise.allSettled([
          workerClient.getOffers(),
          workerClient.getPublicPricingSettings(),
          workerClient.getBindingPricingRules()
        ]);

        if (offersRes.status === 'fulfilled' && offersRes.value) {
          setOffers(offersRes.value.offers || []);
        }

        if (pricingRes.status === 'fulfilled' && pricingRes.value) {
          const pData = pricingRes.value;
          setPricingSettings(pData.settings || pData.data?.settings || null);
          setLaunchPricing(pData.launchPricing || pData.data?.launchPricing || null);
        }

        if (bindingRes.status === 'fulfilled' && bindingRes.value) {
          const bData = bindingRes.value;
          setBindingRules(bData.rules || bData.data?.rules || []);
        }
      } catch (err: any) {
        console.error('Failed to load offers and pricing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (offerCode: string) => {
    try {
      setApplyingCode(offerCode);
      const res = await applyOffer(offerCode);
      if (res.success) {
        toast.success(`Coupon ${offerCode} applied to cart!`);
        router.push(APP_ROUTES.CART);
      } else {
        toast.error(res.error || 'Failed to apply coupon');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error applying coupon');
    } finally {
      setApplyingCode(null);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const nowTime = Date.now();
  const activeOffers = offers.filter(o => o.is_active && (!o.end_time || o.end_time >= nowTime));
  const expiredOffers = offers.filter(o => !o.is_active || (o.end_time && o.end_time < nowTime));

  // Determine Authoritative Launch Pricing status
  const isLaunchActive = launchPricing?.enabled ?? true;

  // 1. Single Sided B&W
  const bwSingleBase = pricingSettings?.printRates?.bw_single ?? 3.0;
  const bwSingleLaunch = (isLaunchActive && launchPricing?.printRates?.bw_single != null)
    ? Number(launchPricing.printRates.bw_single)
    : bwSingleBase;
  const bwSingleSavings = Math.max(0, bwSingleBase - bwSingleLaunch);
  const bwSinglePercent = bwSingleBase > 0 && bwSingleSavings > 0
    ? Math.round((bwSingleSavings / bwSingleBase) * 100)
    : 0;

  // 2. Double Sided B&W
  const bwDoubleBase = pricingSettings?.printRates?.bw_double ?? 5.0;
  const bwDoubleLaunch = (isLaunchActive && launchPricing?.printRates?.bw_double != null) 
    ? Number(launchPricing.printRates.bw_double) 
    : bwDoubleBase;
  const bwDoubleSavings = Math.max(0, bwDoubleBase - bwDoubleLaunch);
  const bwDoublePercent = bwDoubleBase > 0 && bwDoubleSavings > 0 
    ? Math.round((bwDoubleSavings / bwDoubleBase) * 100) 
    : 0;

  // 3. Colour Single Sided
  const colorBase = pricingSettings?.printRates?.color_single ?? 10.0;
  const colorLaunch = (isLaunchActive && launchPricing?.printRates?.color_single != null)
    ? Number(launchPricing.printRates.color_single)
    : colorBase;
  const colorSavings = Math.max(0, colorBase - colorLaunch);
  const colorPercent = colorBase > 0 && colorSavings > 0
    ? Math.round((colorSavings / colorBase) * 100)
    : 0;

  // 4. Spiral Binding Tier
  const firstBindingRule = launchPricing?.bindingRules?.[0] || bindingRules?.[0];
  const bindingBase = firstBindingRule?.original_price ?? 40.0;
  const bindingLaunch = (isLaunchActive && firstBindingRule?.price != null)
    ? Number(firstBindingRule.price)
    : (firstBindingRule?.price ?? 30.0);
  const bindingSavings = Math.max(0, bindingBase - bindingLaunch);

  // Promotional Tickets Collection (Refined & Compact Content)
  const promotionalTickets: OfferTicketData[] = [
    {
      id: 'ticket-bw-double',
      category: 'printing',
      badge: bwDoublePercent > 0 ? `${bwDoublePercent}% OFF` : undefined,
      icon: Printer,
      title: 'B&W Double-Sided',
      description: 'Print on both sides.',
      features: [
        '2 printed pages per sheet',
        '75 GSM bright white paper',
        'Crisp monochrome laser output'
      ],
      price: bwDoubleLaunch,
      originalPrice: bwDoubleSavings > 0 ? bwDoubleBase : undefined,
      unit: '/sheet',
      savingsText: bwDoubleSavings > 0 ? `Save ₹${bwDoubleSavings.toFixed(2)} per sheet` : undefined,
      ctaLabel: 'Print Double-Sided',
      ctaHref: '/app/services/upload?mode=bw-double'
    },
    {
      id: 'ticket-bw-single',
      category: 'printing',
      badge: bwSinglePercent > 0 ? `${bwSinglePercent}% OFF` : undefined,
      icon: FileText,
      title: 'B&W Single-Sided',
      description: 'Ideal for notes and assignments.',
      features: [
        'Clean single-sided A4 sheets',
        'Standard office report paper',
        'Sharp, smudge-free text'
      ],
      price: bwSingleLaunch,
      originalPrice: bwSingleSavings > 0 ? bwSingleBase : undefined,
      unit: '/page',
      savingsText: bwSingleSavings > 0 ? `Save ₹${bwSingleSavings.toFixed(2)} per page` : undefined,
      ctaLabel: 'Print Single-Sided',
      ctaHref: '/app/services/upload?mode=bw-single'
    },
    {
      id: 'ticket-color-single',
      category: 'printing',
      badge: colorPercent > 0 ? `${colorPercent}% OFF` : undefined,
      icon: Palette,
      title: 'Colour Printing',
      description: 'Clear colour prints for diagrams and projects.',
      features: [
        'High-density digital color toner',
        'Clear circuit diagrams & graphics',
        'Single or double-sided options'
      ],
      price: colorLaunch,
      originalPrice: colorSavings > 0 ? colorBase : undefined,
      unit: '/page',
      savingsText: colorSavings > 0 ? `Save ₹${colorSavings.toFixed(2)} per page` : undefined,
      ctaLabel: 'Order Colour Prints',
      ctaHref: '/app/services/upload?mode=color'
    },
    {
      id: 'ticket-spiral-binding',
      category: 'binding',
      badge: bindingSavings > 0 ? `SAVE ₹${bindingSavings.toFixed(0)}` : undefined,
      icon: BookOpen,
      title: 'Spiral Binding',
      description: 'Binding for manuals and reports.',
      features: [
        'Flexible coil with clear covers',
        'Tiered pricing (1–40 pages: ₹30)',
        'Sturdy front and back protection'
      ],
      price: `From ₹${bindingLaunch.toFixed(2)}`,
      originalPrice: bindingSavings > 0 ? bindingBase : undefined,
      unit: '/binding',
      savingsText: bindingSavings > 0 ? `Save ₹${bindingSavings.toFixed(2)} on binding` : undefined,
      ctaLabel: 'Get Binding',
      ctaHref: '/app/services/upload'
    },
    {
      id: 'ticket-hall-ticket',
      category: 'exams_manuals',
      badge: 'EXAM READY',
      icon: Ticket,
      title: 'Hall Tickets',
      description: 'Convenient exam-document printing.',
      features: [
        'Official university admit cards',
        'Sharp barcode and photo clarity',
        'Priority exam desk collection'
      ],
      price: bwSingleLaunch,
      originalPrice: bwSingleSavings > 0 ? bwSingleBase : undefined,
      unit: '/hall ticket',
      savingsText: 'Express desk priority',
      ctaLabel: 'Print Hall Ticket',
      ctaHref: APP_ROUTES.SERVICES.HALL_TICKETS
    },
    {
      id: 'ticket-lab-manuals',
      category: 'exams_manuals',
      badge: 'VERIFIED SYLLABUS',
      icon: BookOpen,
      title: 'College Manuals',
      description: 'Find manuals by branch and semester.',
      features: [
        'Curated syllabus practical books',
        'Complete lab experiment guides',
        'Pre-indexed and spiral-bound'
      ],
      price: 'View pricing',
      originalPrice: undefined,
      unit: '',
      savingsText: 'Spiral binding included',
      ctaLabel: 'Browse Manuals',
      ctaHref: APP_ROUTES.SERVICES.MANUALS
    }
  ];

  const filteredTickets = activeTab === 'all' 
    ? promotionalTickets 
    : promotionalTickets.filter(t => t.category === activeTab);

  return (
    <div className="w-full flex flex-col gap-5 pb-12 select-none">
      {/* 1. Header Navigation Toolbar */}
      <div className="flex items-center justify-between px-1">
        <Link
          href={APP_ROUTES.CAMPUS_FEST}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Campus Fest Hub</span>
        </Link>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200/80">
          Campus Fest Deals
        </span>
      </div>

      {/* 2. Campus Fest Celebratory Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF6B00] via-[#FF802B] to-[#D94E00] p-5 sm:p-6 text-white shadow-lg shadow-orange-950/10">
        <div className="relative z-10 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-md uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            BLINTZY Campus Fest
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
            Promotional Tickets & Offers
          </h1>
          <p className="text-white/95 text-xs sm:text-sm font-medium leading-relaxed max-w-lg">
            Special student launch prices active across all printing and binding services. Verified rates applied directly at checkout.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
        {[
          { id: 'all' as CategoryFilter, label: 'All Deals', count: promotionalTickets.length },
          { id: 'printing' as CategoryFilter, label: 'Printing', count: 3 },
          { id: 'binding' as CategoryFilter, label: 'Binding', count: 1 },
          { id: 'exams_manuals' as CategoryFilter, label: 'Exams & Manuals', count: 2 }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Promotional Vouchers Section (if vouchers exist in DB) */}
      {activeOffers.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
              Active Festival Vouchers ({activeOffers.length})
            </h2>
            <span className="text-[11px] text-gray-400 font-medium">Coupon codes</span>
          </div>

          <div className="flex flex-col gap-4">
            {activeOffers.map((offer) => {
              const isApplied = currentOffer === offer.code;
              const discountText = offer.discount_type === 'percentage' 
                ? `${offer.discount_value}% OFF` 
                : `₹${offer.discount_value} OFF`;

              return (
                <div
                  key={offer.id}
                  className={`relative overflow-hidden rounded-2xl bg-white border p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3.5 transition-all ${
                    isApplied 
                      ? 'border-[#FF6B00] ring-2 ring-orange-500/20 shadow-md' 
                      : 'border-orange-200/80 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black tracking-wider uppercase px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF6B00] rounded-md shadow-2xs">
                          {offer.code}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {discountText}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug mt-1">
                        {offer.title}
                      </h3>
                      {offer.description && (
                        <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                          {offer.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-orange-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                    >
                      {copiedCode === offer.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === offer.code ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    <button
                      onClick={() => handleApply(offer.code)}
                      disabled={isApplied || applyingCode === offer.code}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-[#FF6B00] text-white hover:bg-orange-600 active:scale-95'
                      }`}
                    >
                      {applyingCode === offer.code ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Applied
                        </>
                      ) : (
                        <>
                          Apply to Cart <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. BLINTZY Promotional Ticket Collection (Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Ticket className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider truncate">
              Campus Fest Tickets ({filteredTickets.length})
            </h2>
          </div>
          <span className="text-[10px] text-[#FF6B00] font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/80 shrink-0 whitespace-nowrap shadow-2xs">
            Auto-applied at checkout
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredTickets.map((ticket) => (
              <OfferTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      {/* 6. Expired Deals Section (if any past vouchers exist in DB) */}
      {expiredOffers.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            Past Campus Offers ({expiredOffers.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {expiredOffers.map((offer) => (
              <div key={offer.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-gray-500 uppercase">{offer.code}</span>
                  <span className="text-gray-400 ml-2">{offer.title}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-200/70 px-2 py-0.5 rounded-md">Expired</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Authoritative Offer & Pricing Policy Notice */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 text-xs text-gray-500 space-y-1.5 shadow-2xs">
        <p className="font-extrabold text-gray-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#FF6B00]" />
          Authoritative Pricing & Policy
        </p>
        <p className="text-[11px] leading-relaxed font-medium">
          Campus Fest launch prices are active platform-wide and calculated by our backend pricing engine based on verified page counts and service configurations. Launch prices apply directly to your items without requiring voucher codes. If you have an additional valid promotional voucher code, you can apply it at checkout according to non-stacking campaign terms.
        </p>
      </div>
    </div>
  );
}
