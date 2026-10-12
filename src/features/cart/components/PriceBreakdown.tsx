'use client';

import React, { useState } from 'react';
import { Tag, Check, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCart } from '../providers/CartProvider';
import { CartSummary } from '../types';
import { OfferSparkles } from '@/design-system/components/feedback/OfferSparkles';
import toast from 'react-hot-toast';

interface PriceBreakdownProps {
  summary: CartSummary;
  /** Optional interactive offer application callback for standalone flows */
  onApplyOffer?: (code: string | null) => Promise<{ success: boolean; error?: string }>;
  isApplyingOffer?: boolean;
}

export const PriceBreakdown = ({ 
  summary, 
  onApplyOffer, 
  isApplyingOffer: externalApplying 
}: PriceBreakdownProps) => {
  const shouldReduceMotion = useReducedMotion();
  const cartContext = useCart();
  
  // Local state for animation & loading
  const [internalApplying, setInternalApplying] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [justAppliedMessage, setJustAppliedMessage] = useState(false);

  const isApplying = externalApplying ?? internalApplying;

  // Base pricing values
  const printingPrice = summary.printingCost !== undefined ? summary.printingCost : summary.subtotal;
  const originalPrintingPrice = summary.originalPrintingCost !== undefined 
    ? summary.originalPrintingCost 
    : (summary.originalSubtotal !== undefined ? summary.originalSubtotal : printingPrice);
  const hasPrintingComparison = originalPrintingPrice > printingPrice;

  const bindingPrice = summary.bindingCost || 0;
  const originalBindingPrice = summary.originalBindingCost || bindingPrice;
  const hasBindingComparison = originalBindingPrice > bindingPrice;

  // Genuine additional discount from offer or coupon
  const directOfferDiscount = summary.offerDiscount !== undefined 
    ? summary.offerDiscount 
    : (summary.discount || 0);

  // Reductions from verified offer calculation
  const printingReduction = hasPrintingComparison ? originalPrintingPrice - printingPrice : 0;
  const bindingReduction = hasBindingComparison ? originalBindingPrice - bindingPrice : 0;
  const subtotalReduction = summary.originalSubtotal && summary.originalSubtotal > summary.subtotal
    ? summary.originalSubtotal - summary.subtotal
    : 0;

  // Authoritative total savings
  const genuineSavings = Math.max(
    directOfferDiscount,
    printingReduction + bindingReduction,
    subtotalReduction
  );

  // Check if an offer is currently applied
  const isOfferApplied = !!(summary.appliedOffer || (cartContext?.offer && cartContext.offer !== 'NONE') || genuineSavings > 0);
  const offerCode = summary.appliedOffer || cartContext?.offer || 'CAMPUSFEST';

  // Check if Campus Fest promotion applies
  const isOfferEligible = (summary.isLaunchActive ?? true) || isOfferApplied || genuineSavings > 0;

  // Calculate genuine discount percentage if valid
  const originalPayableBase = summary.total + genuineSavings;
  const genuineDiscountPercent = genuineSavings > 0 && originalPayableBase > 0 
    ? Math.round((genuineSavings / originalPayableBase) * 100) 
    : 0;

  // Strikethrough calculation for Final Payable when superseded
  const previousPayable = isOfferApplied && genuineSavings > 0
    ? originalPayableBase
    : (summary.previousTotal !== undefined && summary.previousTotal > summary.total ? summary.previousTotal : undefined);

  // Handle Interactive Offer Application
  const handleApplyOffer = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isApplying) return;

    try {
      setInternalApplying(true);

      let res: { success: boolean; error?: string };
      if (onApplyOffer) {
        res = await onApplyOffer(offerCode);
      } else if (cartContext?.applyOffer) {
        res = await cartContext.applyOffer(offerCode);
      } else {
        res = { success: false, error: 'Offer service not available' };
      }

      if (res.success) {
        setShowSparkles(true);
        setJustAppliedMessage(true);
        toast.success('Campus Fest Offer applied successfully!');
        
        setTimeout(() => setShowSparkles(false), 1200);
        setTimeout(() => setJustAppliedMessage(false), 3500);
      } else {
        toast.error(res.error || 'Offer could not be applied');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error applying offer');
    } finally {
      setInternalApplying(false);
    }
  };

  const handleRemoveOffer = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isApplying) return;

    try {
      setInternalApplying(true);
      if (onApplyOffer) {
        await onApplyOffer(null);
      } else if (cartContext?.applyOffer) {
        await cartContext.applyOffer(null);
      }
      toast.success('Offer removed');
    } catch (err: any) {
      toast.error('Could not remove offer');
    } finally {
      setInternalApplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-card p-5 rounded-2xl border border-border shadow-sm relative overflow-hidden">
      <h3 className="font-bold text-lg text-foreground tracking-tight">Price Details</h3>
      
      {/* 1. Printing Section */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">Printing</span>
        <div className="flex items-baseline gap-2 shrink-0">
          {hasPrintingComparison && (
            <motion.span 
              initial={false}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground line-through font-semibold"
            >
              ₹{originalPrintingPrice.toFixed(2)}
            </motion.span>
          )}
          <motion.span 
            key={printingPrice}
            initial={shouldReduceMotion ? false : { scale: 0.95 }}
            animate={{ scale: 1 }}
            className="font-bold text-foreground"
          >
            ₹{printingPrice.toFixed(2)}
          </motion.span>
        </div>
      </div>

      {/* 2. Binding (if configured) */}
      {bindingPrice > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Binding</span>
          <div className="flex items-baseline gap-2 shrink-0">
            {hasBindingComparison && (
              <motion.span 
                initial={false}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground line-through font-semibold"
              >
                ₹{originalBindingPrice.toFixed(2)}
              </motion.span>
            )}
            <motion.span 
              key={bindingPrice}
              initial={shouldReduceMotion ? false : { scale: 0.95 }}
              animate={{ scale: 1 }}
              className="font-bold text-foreground"
            >
              ₹{bindingPrice.toFixed(2)}
            </motion.span>
          </div>
        </div>
      )}

      {/* 3. BLINTZY Campus Fest Offer (Premium Card, Never Truncated) */}
      {isOfferEligible && (
        <div className="relative">
          <OfferSparkles active={showSparkles} />

          <motion.div 
            layout
            className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
              isOfferApplied
                ? 'bg-gradient-to-br from-[#FFF9F5] via-[#FFF6EF] to-[#FFEDE1] border-orange-200/90 shadow-[0_4px_20px_rgba(255,107,0,0.06)]'
                : 'bg-white border-orange-200/70 hover:border-orange-300 shadow-2xs'
            }`}
          >
            {/* Top row: Ticket icon + Title (Never truncated) + Status */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Tag className="w-4.5 h-4.5 text-[#FF6B00]" strokeWidth={2.5} />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-[#2D1600] text-[14px] sm:text-[15px] leading-tight">
                    BLINTZY Campus Fest Offer
                  </h4>
                  {isOfferApplied && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-orange-900/75 mt-0.5 leading-snug">
                  {genuineSavings > 0 
                    ? `Special campus pricing applied to your order` 
                    : `Special campus launch pricing`}
                </p>
              </div>
            </div>

            {/* Bottom Row: Savings tag & Action Button */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-orange-200/60">
              <div className="flex items-center gap-1.5 min-w-0">
                {genuineSavings > 0 && (
                  <span className="text-[11px] sm:text-xs font-black text-[#FF6B00] bg-white/95 border border-orange-200 px-2.5 py-0.5 rounded-lg shadow-2xs whitespace-nowrap shrink-0">
                    Save ₹{genuineSavings.toFixed(2)}{genuineDiscountPercent > 0 ? ` (${genuineDiscountPercent}% OFF)` : ''}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isOfferApplied ? (
                  <>
                    <span className="text-xs font-bold text-[#FF6B00] bg-white/95 border border-orange-200 px-3 py-1 rounded-lg shadow-2xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#FF6B00]" strokeWidth={2.5} /> Applied
                    </span>
                    {(cartContext?.offer || onApplyOffer) && (
                      <button
                        onClick={handleRemoveOffer}
                        disabled={isApplying}
                        className="text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-white/80 transition-colors px-1.5 py-1 rounded-md"
                        title="Remove offer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleApplyOffer}
                    disabled={isApplying}
                    className="px-4 py-1.5 rounded-xl bg-[#FF6B00] text-white hover:bg-orange-600 active:scale-95 text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {isApplying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Apply Offer
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 4. Genuine Savings Announcement Line */}
      <AnimatePresence>
        {(isOfferApplied && genuineSavings > 0) && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-2.5 text-xs font-bold text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl shadow-2xs"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-emerald-700" />
              </span>
              <span className="text-[12px] font-bold text-emerald-950 leading-tight">
                You save ₹{genuineSavings.toFixed(2)} with Campus Fest Offer
              </span>
            </div>
            {genuineDiscountPercent > 0 && (
              <span className="text-[11px] font-black uppercase tracking-tight text-emerald-800 bg-emerald-200/70 border border-emerald-300/40 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 inline-flex items-center leading-none">
                {genuineDiscountPercent}% OFF
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Delivery */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Delivery</span>
        {summary.deliveryFee > 0 ? (
          <span className="font-medium text-foreground">₹{summary.deliveryFee.toFixed(2)}</span>
        ) : (
          <span className="font-bold text-green-600">FREE</span>
        )}
      </div>

      {/* 6. Platform Fee (if configured) */}
      {(summary.platformFee || 0) > 0 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Platform Fee</span>
          <span className="font-medium text-foreground">₹{(summary.platformFee || 0).toFixed(2)}</span>
        </div>
      )}
      
      <div className="h-px w-full bg-border/60 my-1"></div>
      
      {/* 7. Final Payable (Strongest Hierarchy, Strikethrough & Bold BLINTZY Orange) */}
      <div className="flex justify-between items-center pt-1">
        <div className="flex flex-col">
          <span className="font-extrabold text-foreground text-base leading-tight">Final Payable</span>
          {isOfferApplied && genuineSavings > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Offer price applied
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-2.5 shrink-0">
          {previousPayable !== undefined && previousPayable > summary.total && (
            <motion.span 
              initial={false}
              animate={{ opacity: 1 }}
              className="text-base text-muted-foreground line-through font-bold"
            >
              ₹{previousPayable.toFixed(2)}
            </motion.span>
          )}
          <motion.span 
            key={summary.total}
            initial={shouldReduceMotion ? false : { scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="text-3xl font-black text-[#FF6B00] tracking-tight leading-none"
          >
            ₹{summary.total.toFixed(2)}
          </motion.span>
        </div>
      </div>
    </div>
  );
};
