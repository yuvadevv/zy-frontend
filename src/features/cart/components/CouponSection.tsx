"use client";
import React, { useState } from 'react';
import { useCart } from '../providers/CartProvider';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CouponSection = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { applyCoupon, coupon, offer, offerDetails, applyOffer } = useCart();

  const handleApply = async () => {
    if (code.trim().length > 0) {
      setLoading(true);
      const res = await applyCoupon(code);
      if (res.success) {
        toast.success(`Coupon ${code.toUpperCase()} applied`);
      } else {
        toast.error(res.error || 'Invalid coupon');
        setCode('');
      }
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    await applyCoupon(null);
    setCode('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-3">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-extrabold text-[15px] text-gray-900">Have a Coupon or Offer?</h3>
        {offer && !coupon && (
          <span className="text-[11px] font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full">
            Active Campaign
          </span>
        )}
      </div>

      {/* Active Offer Banner */}
      {offer && !coupon && offerDetails && (
        <div className="flex justify-between items-center bg-orange-50/80 border border-orange-200 p-3 rounded-xl mb-1">
          <div className="flex flex-col">
            <span className="text-orange-900 font-bold text-[13px]">
              🎉 {offerDetails.title} {offerDetails.discountValue ? `(${offerDetails.discountValue}% OFF)` : ''}
            </span>
            <span className="text-orange-700 text-[11px]">
              Applied to eligible printing. Applying a coupon code will replace this offer.
            </span>
          </div>
          <button
            onClick={() => applyOffer(null)}
            className="text-[12px] font-bold text-orange-600 hover:text-orange-800 transition-colors p-1"
          >
            Remove
          </button>
        </div>
      )}
      
      {coupon ? (
        <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-green-700 font-bold text-[14px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{coupon.toUpperCase()} APPLIED</span>
          </div>
          <button 
            onClick={handleRemove} 
            disabled={loading}
            className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors p-1 -m-1 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Remove'}
          </button>
        </div>
      ) : (
        <div className="flex gap-2 h-[48px]">
          <input 
            type="text" 
            placeholder="ENTER PROMO CODE" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={loading}
            className="flex-1 px-4 rounded-[12px] bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all uppercase text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-semibold disabled:bg-gray-100"
          />
          <button 
            onClick={handleApply}
            disabled={code.trim().length === 0 || loading}
            className="px-5 bg-[#FF6B00] text-white font-bold text-[14px] rounded-[12px] shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
          </button>
        </div>
      )}
    </div>
  );
};

