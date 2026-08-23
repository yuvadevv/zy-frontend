"use client";
import React from 'react';
import { useSupport } from '@/hooks/useSupport';

interface HelpSupportCardProps {
  orderId?: string;
}

export const HelpSupportCard = ({ orderId }: HelpSupportCardProps) => {
  const { isAvailable, openWhatsAppSupport } = useSupport();

  return (
    <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm flex flex-col gap-2">
      <h3 className="font-bold text-[15px] text-gray-900 leading-tight">Need help with this order?</h3>
      <p className="text-[13px] text-gray-600 font-medium">We're here to help.</p>

      <div className="mt-2">
        {isAvailable ? (
          <button 
            onClick={() => openWhatsAppSupport(orderId)}
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
