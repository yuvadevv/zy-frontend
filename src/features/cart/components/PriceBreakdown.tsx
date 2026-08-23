import React from 'react';
import { CartSummary } from '../types';

interface PriceBreakdownProps {
  summary: CartSummary;
}

export const PriceBreakdown = ({ summary }: PriceBreakdownProps) => {
  return (
    <div className="flex flex-col gap-3 bg-card p-5 rounded-2xl border border-border shadow-sm">
      <h3 className="font-bold text-lg mb-2">Price Details</h3>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span className="font-medium text-foreground">₹{summary.subtotal.toFixed(2)}</span>
      </div>
      
      {summary.discount > 0 && (
        <div className="flex justify-between items-center text-sm text-green-600">
          <span>Discount</span>
          <span className="font-medium">-₹{summary.discount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Delivery</span>
        <span className="font-bold text-green-600">FREE</span>
      </div>
      
      <div className="h-px w-full bg-border/60 my-1"></div>
      
      <div className="flex justify-between items-center text-lg font-black text-foreground">
        <span>Total Amount</span>
        <span>₹{summary.total.toFixed(2)}</span>
      </div>
    </div>
  );
};
