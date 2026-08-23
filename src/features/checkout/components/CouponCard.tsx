// src/features/checkout/components/CouponCard.tsx
"use client";
import React, { useState } from 'react';
import { Tag } from 'lucide-react';

interface CouponCardProps {
  appliedCode: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export const CouponCard = ({ appliedCode, onApply, onRemove }: CouponCardProps) => {
  const [input, setInput] = useState('');

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 text-foreground font-bold">
        <Tag className="w-5 h-5 text-primary" />
        <h2>Coupons & Offers</h2>
      </div>
      
      {appliedCode ? (
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-green-600 dark:text-green-500">&apos;{appliedCode}&apos; Applied</span>
            <span className="text-xs text-muted-foreground">Discount calculated in summary</span>
          </div>
          <button onClick={onRemove} className="text-xs font-bold text-destructive hover:underline">
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="flex-1 bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button 
            onClick={() => {
              if(input.trim()) onApply(input.trim());
            }}
            disabled={!input.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
