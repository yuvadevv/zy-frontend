"use client";
import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface StickyCheckoutBarProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export const StickyCheckoutBar = ({ total, itemCount, onCheckout, disabled }: StickyCheckoutBarProps) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-40 px-5 pt-4 pb-[calc(80px+1rem)] rounded-t-3xl">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-gray-400 leading-tight uppercase tracking-wide">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
          <span className="text-[22px] font-black text-gray-900 leading-tight">₹{total.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={onCheckout}
          disabled={disabled}
          className={`flex items-center justify-center gap-1.5 px-6 h-[52px] bg-[#FF6B00] text-white font-bold text-[15px] rounded-[16px] transition-all active:scale-95 ${disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_4px_12px_rgba(255,107,0,0.25)] hover:bg-[#E66000]'}`}
        >
          Proceed to Checkout <span className="text-lg leading-none translate-y-[-1px]">→</span>
        </button>
      </div>
    </div>
  );
};
