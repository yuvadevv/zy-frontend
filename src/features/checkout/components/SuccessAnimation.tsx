// src/features/checkout/components/SuccessAnimation.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, Loader2 } from 'lucide-react';

import { Cart } from '@/features/cart/types';
import { workerClient } from '@/lib/api/workerClient';
import { useSupport } from '@/hooks/useSupport';
import { toast } from 'react-hot-toast';

interface SuccessAnimationProps {
  orderId: string;
  cart: Cart;
  onContinue: () => void;
  onTrack: () => void;
}

export const SuccessAnimation = ({ orderId, cart, onContinue, onTrack }: SuccessAnimationProps) => {
  const [mounted, setMounted] = useState(false);
  const { supportWhatsapp } = useSupport();
  
  // Logical flow after payment confirmation:
  // 'order_confirmed_whatsapp': Step 5 — Send final order confirmation to BLINTZY on WhatsApp
  // 'awaiting_final_confirmation': Step 6 — Student returns and confirms final submission
  // 'placed_success': Step 7 — Final order placed success screen
  const [step, setStep] = useState<'order_confirmed_whatsapp' | 'awaiting_final_confirmation' | 'placed_success'>('order_confirmed_whatsapp');
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const firstItem = cart.items[0];
  const docName = firstItem?.title || 'Custom Upload Document';
  const pages = firstItem?.printOptions?.pages || 'N/A';
  const color = firstItem?.printOptions?.color ? 'Colour' : 'B&W';
  const sides = firstItem?.printOptions?.singleSided ? 'Single Sided' : 'Double Sided';
  const binding = firstItem?.printOptions?.bindingType && firstItem?.printOptions?.bindingType !== 'none' ? 'Spiral Binding' : 'No Binding';
  const copies = firstItem?.printOptions?.copies || 1;
  const serviceType = firstItem?.serviceType === 'hall_ticket' ? 'Hall Ticket' : 'Custom Upload';
  const uploadRef = firstItem?.referenceId ? firstItem.referenceId.slice(0, 8).toUpperCase() : 'UPLOAD';

  const handleOpenWhatsApp = () => {
    const waNumber = supportWhatsapp || process.env.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER || '919652929243';
    const cleanWa = waNumber.replace(/\D/g, '');
    
    // Real, backend-generated details appropriate to share
    const msg = `Hi BLINTZY 🎉\n\nI have completed my payment and I am confirming my order.\n\nOrder ID: ${orderId}\nService: ${serviceType}\nDocument Ref: ${uploadRef}\nDocument: ${docName} (${pages} pages)\nPrint Options: ${color} • ${sides} • ${binding} • ${copies} copies\nConfirmed Amount: ₹${cart.summary.total}\nPayment Status: Confirmed (Paid)\n\nPlease verify and process my order.`;
    
    setHasOpenedWhatsApp(true);
    window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setStep('awaiting_final_confirmation');
  };

  const handleFinalConfirm = async () => {
    setIsConfirming(true);
    try {
      await workerClient.finalConfirmOrder(orderId);
      toast.success('Order confirmation recorded successfully!');
    } catch (err) {
      console.error('Failed to record final confirmation in backend:', err);
      // Still allow progression if already confirmed or temporary network error
    } finally {
      setIsConfirming(false);
      setStep('placed_success');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-background overflow-y-auto pb-32">
      <AnimatePresence mode="wait">
        {step === 'order_confirmed_whatsapp' && (
          <motion.div 
            key="whatsapp_step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center w-full max-w-sm mx-auto min-h-full pt-8 pb-8 px-4"
          >
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8 w-full justify-center text-xs font-bold uppercase tracking-wider">
               <div className="flex items-center text-green-600">
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Paid
               </div>
               <div className="w-8 h-px bg-green-500"></div>
               <div className="flex items-center text-primary">
                 <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-1 text-[10px]">2</div> Confirm
               </div>
               <div className="w-8 h-px bg-border"></div>
               <div className="flex items-center text-muted-foreground">
                 <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-1 text-[10px]">3</div> Complete
               </div>
            </div>

            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>

            <h1 className="text-xl font-black text-foreground mb-1 text-center">
              Confirm Your Order on WhatsApp 🎉
            </h1>
            <p className="text-sm text-muted-foreground mb-6 font-medium px-4 text-center">
              Your payment is confirmed. Send your order details to BLINTZY on WhatsApp to complete the confirmation step.
            </p>

            <div className="w-full bg-card rounded-2xl border border-border p-4 shadow-sm mb-6 text-left flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Order ID:</span>
                <span className="font-mono text-foreground font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Service / Ref:</span>
                <span className="text-foreground font-bold">{serviceType} • {uploadRef}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Document:</span>
                <span className="text-foreground font-bold truncate max-w-[180px]">{docName}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Pages & Copies:</span>
                <span className="text-foreground font-bold">{pages} pages • {copies} {copies > 1 ? 'copies' : 'copy'}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Confirmed Amount:</span>
                <span className="font-bold text-primary">₹{cart.summary.total}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Payment Status:</span>
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} /> Confirmed (Paid)
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-auto">
              <button 
                onClick={handleOpenWhatsApp}
                className="w-full h-14 bg-[#25D366] text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all uppercase tracking-wide text-sm"
              >
                <MessageCircle className="w-5 h-5" /> Confirm Order on WhatsApp →
              </button>

              <button
                type="button"
                onClick={() => setStep('awaiting_final_confirmation')}
                className="text-xs text-muted-foreground hover:text-foreground underline text-center pt-1"
              >
                Already opened WhatsApp? Tap here to confirm
              </button>
            </div>
          </motion.div>
        )}

        {step === 'awaiting_final_confirmation' && (
          <motion.div 
            key="awaiting_confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center w-full max-w-sm mx-auto min-h-full pt-8 pb-8 px-4"
          >
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8 w-full justify-center text-xs font-bold uppercase tracking-wider">
               <div className="flex items-center text-green-600">
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Paid
               </div>
               <div className="w-8 h-px bg-green-500"></div>
               <div className="flex items-center text-primary">
                 <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-1 text-[10px]">2</div> Confirm
               </div>
               <div className="w-8 h-px bg-border"></div>
               <div className="flex items-center text-muted-foreground">
                 <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-1 text-[10px]">3</div> Complete
               </div>
            </div>

            <div className="w-16 h-16 bg-orange-100 text-[#FF6B00] rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-black text-foreground mb-1 text-center">
              Have You Sent the Confirmation?
            </h1>
            <p className="text-sm text-muted-foreground mb-6 font-medium px-4 text-center">
              Return after sending your order details on WhatsApp.
            </p>

            <div className="w-full bg-card rounded-2xl border border-border p-4 shadow-sm mb-6 text-left flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Order ID:</span>
                <span className="font-mono text-foreground font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-semibold">
                <span>Confirmed Amount:</span>
                <span className="font-bold text-foreground">₹{cart.summary.total}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-auto">
              <button 
                onClick={handleFinalConfirm}
                disabled={isConfirming}
                className="w-full h-14 bg-primary text-primary-foreground font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all uppercase tracking-wide text-sm disabled:opacity-70"
              >
                {isConfirming ? <Loader2 className="w-5 h-5 animate-spin" /> : "I've Sent All Confirmation Details ✓"}
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full text-xs text-primary font-bold hover:underline py-2 text-center"
              >
                Didn't send yet? Reopen WhatsApp
              </button>
            </div>
          </motion.div>
        )}

        {step === 'placed_success' && (
          <motion.div 
            key="placed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center w-full max-w-sm mx-auto min-h-full pt-8 pb-8 px-4"
          >
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8 w-full justify-center text-xs font-bold uppercase tracking-wider">
               <div className="flex items-center text-green-600">
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Paid
               </div>
               <div className="w-8 h-px bg-green-500"></div>
               <div className="flex items-center text-green-600">
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Confirmed
               </div>
               <div className="w-8 h-px bg-green-500"></div>
               <div className="flex items-center text-green-600">
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Placed
               </div>
            </div>

            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-6 shrink-0">
              <Check className="w-10 h-10 text-white" strokeWidth={4} />
            </div>

            <h1 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tight">
              Order Placed Successfully
            </h1>
            <p className="text-xs text-muted-foreground mb-6 font-medium">
              Payment verified and order confirmation received.
            </p>

            {cart.items.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-4 shadow-sm w-full text-left flex flex-col gap-3 text-sm shrink-0 mb-8">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-muted-foreground whitespace-nowrap font-medium">Order ID</span>
                  <span className="font-mono text-foreground font-bold text-right break-all">
                    {orderId}
                  </span>
                </div>
                <div className="w-full h-px bg-border/50"></div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-muted-foreground whitespace-nowrap font-medium">Document</span>
                  <span className="font-bold text-right" style={{ overflowWrap: 'anywhere' }}>
                    {cart.items[0].title || 'Custom Upload'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total</span>
                  <span className="font-bold text-primary text-base">₹{cart.summary.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Payment Status</span>
                  <span className="font-bold text-green-600">PAID & VERIFIED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Delivery</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 w-full mt-auto">
              <button 
                onClick={onTrack}
                className="flex-1 h-14 bg-primary text-primary-foreground font-black rounded-xl shadow-md uppercase tracking-wide text-sm"
              >
                Track Order
              </button>
              <button 
                onClick={onContinue}
                className="flex-1 h-14 bg-secondary text-secondary-foreground font-black rounded-xl uppercase tracking-wide text-sm"
              >
                Shop More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

