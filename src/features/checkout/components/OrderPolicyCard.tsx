"use client";
import React from 'react';
import { Shield } from 'lucide-react';
import { useSupport } from '@/hooks/useSupport';

export const OrderPolicyCard = () => {
  const { isAvailable, openWhatsAppSupport } = useSupport();

  return (
    <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
          <Shield className="w-3.5 h-3.5 text-[#FF6B00]" />
        </div>
        <h4 className="font-bold text-[15px] text-gray-900 leading-none">Important Order Policy</h4>
      </div>
      
      <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
        Please review your order carefully before placing it. Orders cannot currently be cancelled or refunded after they are placed.
      </p>

      <div className="mt-1 flex flex-col items-start gap-1">
        <span className="text-[12px] font-bold text-gray-800">Need help?</span>
        {isAvailable ? (
          <button 
            onClick={() => openWhatsAppSupport()}
            className="text-[13px] font-bold text-[#FF6B00] hover:text-orange-600 group flex items-center transition-colors active:opacity-70"
          >
            Contact BLINTZY Support <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
          </button>
        ) : (
          <span className="text-[13px] font-bold text-gray-400">Support is currently unavailable.</span>
        )}
      </div>
    </div>
  );
};
