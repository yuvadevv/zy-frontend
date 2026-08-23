"use client";
import React, { useState } from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';

export const CouponSection = () => {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (code.trim().length > 3) {
      setApplied(true);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-3">
      <h3 className="font-extrabold text-[15px] text-gray-900 mb-1">Have a Coupon?</h3>
      
      {applied ? (
        <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-green-700 font-bold text-[14px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{code.toUpperCase()} APPLIED</span>
          </div>
          <button onClick={() => { setApplied(false); setCode(''); }} className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors p-1 -m-1">Remove</button>
        </div>
      ) : (
        <div className="flex gap-2 h-[48px]">
          <input 
            type="text" 
            placeholder="ENTER PROMO CODE" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 rounded-[12px] bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all uppercase text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-semibold"
          />
          <button 
            onClick={handleApply}
            disabled={code.trim().length === 0}
            className="px-5 bg-[#FF6B00] text-white font-bold text-[14px] rounded-[12px] shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
