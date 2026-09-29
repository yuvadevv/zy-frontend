// src/features/checkout/components/SuccessAnimation.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';

import { Cart } from '@/features/cart/types';
import { workerClient } from '@/lib/api/workerClient';
import { toast } from 'react-hot-toast';

interface SuccessAnimationProps {
  orderId: string;
  cart: Cart;
  onContinue: () => void;
  onTrack: () => void;
}

export const SuccessAnimation = ({ orderId, cart, onContinue, onTrack }: SuccessAnimationProps) => {
  const [mounted, setMounted] = useState(false);
  
  // 'pending_document': Payment is successful, but document needs to be sent
  // 'order_placed': Document sent, order officially placed
  const [step, setStep] = useState<'pending_document' | 'order_placed'>('pending_document');
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleOpenWhatsApp = () => {
    const waNumber = process.env.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER || '919652929243';
    const serviceNames = cart.items.map((i: any) => i.title || 'Custom Upload').join(', ') || 'Custom Upload';
    const msg = `Hi BLINTZY 👋\n\nI'm sending my document to complete my order.\n\nOrder ID: ${orderId}\nService: ${serviceNames}\nAmount: ₹${cart.summary.total}\n\n📎 I am attaching my PDF/ZIP document for this order.\n\nPlease confirm once received.`;
    
    setHasOpenedWhatsApp(true);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleConfirmDocumentSent = () => {
    // Immediately show the success screen without waiting for the backend
    setStep('order_placed');
    
    // Make the backend call in the background to update the status silently
    workerClient.confirmDocument(orderId).catch(err => {
      console.error('Failed to confirm document in background:', err);
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-background overflow-y-auto pb-32">
      <AnimatePresence mode="wait">
        {step === 'pending_document' ? (
          <motion.div 
            key="pending"
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
               <div className="w-8 h-px bg-border"></div>
               <div className="flex items-center text-primary">
                 <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-1">2</div> Send
               </div>
               <div className="w-8 h-px bg-border"></div>
               <div className="flex items-center text-muted-foreground">
                 <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-1">3</div> Placed
               </div>
            </div>

            <h1 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tight">
              Payment Successful
            </h1>
            <h2 className="text-xl font-bold text-primary mb-4">
              One Step Left
            </h2>

            <p className="text-sm text-muted-foreground mb-6 font-medium px-4">
              Your payment has been received, but your order is <span className="font-bold text-foreground">NOT</span> placed yet. Please send your PDF/ZIP document on WhatsApp to complete your order.
            </p>

            <div className="text-xs text-amber-900 bg-amber-50 p-4 rounded-xl w-full border border-amber-200 mb-8 shadow-sm flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 font-black text-amber-950 uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Action Required
              </div>
              <p className="font-semibold text-center leading-relaxed">
                Your order will be placed only after we receive your document on WhatsApp.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3 mt-auto">
              <button 
                onClick={handleOpenWhatsApp}
                className="w-full h-14 bg-[#25D366] text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all uppercase tracking-wide text-sm"
              >
                <MessageCircle className="w-5 h-5" /> SEND DOCUMENT ON WHATSAPP
              </button>

              {hasOpenedWhatsApp && (
                <motion.button 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 56 }}
                  onClick={handleConfirmDocumentSent}
                  disabled={isConfirming}
                  className="w-full bg-primary text-primary-foreground font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all uppercase tracking-wide text-sm disabled:opacity-70"
                >
                  {isConfirming ? <Loader2 className="w-5 h-5 animate-spin" /> : "I'VE SENT THE DOCUMENT"}
                </motion.button>
              )}
            </div>
            
          </motion.div>
        ) : (
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
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Sent
               </div>
               <div className="w-8 h-px bg-green-500"></div>
               <div className="flex items-center text-green-600">
                 <Check className="w-4 h-4 mr-1" strokeWidth={3} /> Placed
               </div>
            </div>

            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-6 shrink-0">
              <Check className="w-10 h-10 text-white" strokeWidth={4} />
            </div>

            <h1 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">
              Order Placed Successfully
            </h1>

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
