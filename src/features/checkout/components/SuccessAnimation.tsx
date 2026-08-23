// src/features/checkout/components/SuccessAnimation.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { Cart } from '@/features/cart/types';
import { getEstimatedDelivery } from '@/features/manuals/utils/priceEngine';

interface SuccessAnimationProps {
  orderId: string;
  cart: Cart;
  onContinue: () => void;
  onTrack: () => void;
}

export const SuccessAnimation = ({ orderId, cart, onContinue, onTrack }: SuccessAnimationProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-start px-4 pt-10 pb-8 text-center w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-500/30 mb-4 shrink-0"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl font-black text-foreground mb-1 shrink-0"
      >
        Order Placed Successfully!
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground mb-4 shrink-0 w-full max-w-sm"
        style={{ overflowWrap: 'anywhere' }}
      >
        Your order <span className="font-mono text-foreground font-bold">{orderId}</span> has been confirmed.
      </motion.p>

      {cart.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-card rounded-2xl border border-border p-3.5 shadow-sm w-full max-w-sm mb-4 text-left flex flex-col gap-2.5 text-sm shrink-0"
        >
          <div className="flex justify-between items-start gap-3">
            <span className="text-muted-foreground whitespace-nowrap">Document</span>
            <span className="font-bold text-right" style={{ overflowWrap: 'anywhere' }}>
              {cart.items[0].title}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-primary">₹{cart.summary.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-bold text-green-600">FREE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Estimated</span>
            <span className="font-bold">{getEstimatedDelivery()}</span>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-muted-foreground mb-4 max-w-sm bg-secondary/30 px-3 py-2.5 rounded-lg w-full flex items-center justify-center shrink-0"
      >
        <span><span className="font-bold text-foreground">Need it urgently?</span> Visit the print shop with your Order ID for assistance.</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col w-full gap-2.5 max-w-sm mt-auto shrink-0"
      >
        <button 
          onClick={onTrack}
          className="w-full h-[50px] bg-primary text-primary-foreground font-bold rounded-xl shadow-md"
        >
          Track Order
        </button>
        <button 
          onClick={onContinue}
          className="w-full h-[50px] bg-muted text-foreground font-bold rounded-xl"
        >
          Continue Shopping
        </button>
      </motion.div>
    </div>
  );
};
