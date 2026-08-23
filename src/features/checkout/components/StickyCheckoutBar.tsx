// src/features/checkout/components/StickyCheckoutBar.tsx
"use client";
import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { Loader2 } from 'lucide-react';

interface StickyCheckoutBarProps {
  total: number;
  onPlaceOrder: () => void;
  isValid: boolean;
  isPlacingOrder: boolean;
}

export const StickyCheckoutBar = ({ total, onPlaceOrder, isValid, isPlacingOrder }: StickyCheckoutBarProps) => {
  return (
    <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Grand Total</span>
          <span className="text-2xl font-black text-foreground leading-tight">₹{total.toFixed(2)}</span>
        </div>
        
        <Button 
          onClick={onPlaceOrder}
          isDisabled={!isValid || isPlacingOrder}
          className={`flex-1 max-w-[200px] py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all ${
            (!isValid || isPlacingOrder) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02]'
          }`}
        >
          {isPlacingOrder ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Place Order →'
          )}
        </Button>
      </div>
    </div>
  );
};
