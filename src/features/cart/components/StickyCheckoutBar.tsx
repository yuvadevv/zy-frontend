"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBootstrapConfig } from '@/features/bootstrap/services/bootstrapService';
import { PauseCircle } from 'lucide-react';

interface StickyCheckoutBarProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export const StickyCheckoutBar = ({ total, itemCount, onCheckout, disabled }: StickyCheckoutBarProps) => {
  const { data: bootstrapData } = useQuery({
    queryKey: ['bootstrap'],
    queryFn: fetchBootstrapConfig,
    staleTime: 1000 * 15,
  });

  const isOrdersEnabled = bootstrapData?.data 
    ? (bootstrapData.data.orders_enabled !== false && bootstrapData.data.printing_orders_enabled !== false) 
    : true;
  const isButtonDisabled = disabled || !isOrdersEnabled;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-40 px-5 pt-3 pb-[calc(80px+1rem)] rounded-t-3xl">
      {!isOrdersEnabled && (
        <div className="mb-2 py-1.5 px-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-2 text-amber-800 text-[11px] font-semibold">
          <PauseCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="line-clamp-1">{bootstrapData?.data?.orders_paused_message || 'Orders are temporarily paused.'}</span>
        </div>
      )}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-gray-400 leading-tight uppercase tracking-wide">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
          <span className="text-[22px] font-black text-gray-900 leading-tight">₹{total.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={onCheckout}
          disabled={isButtonDisabled}
          className={`flex items-center justify-center gap-1.5 px-6 h-[52px] font-bold text-[15px] rounded-[16px] transition-all active:scale-95 ${
            isButtonDisabled 
              ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed shadow-none' 
              : 'bg-[#FF6B00] text-white shadow-[0_4px_12px_rgba(255,107,0,0.25)] hover:bg-[#E66000]'
          }`}
        >
          {!isOrdersEnabled ? (
            <>
              <PauseCircle className="w-4 h-4" />
              <span>Orders Paused</span>
            </>
          ) : (
            <>
              Proceed to Checkout <span className="text-lg leading-none translate-y-[-1px]">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
