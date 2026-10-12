// src/features/checkout/components/OrderSummaryCard.tsx
"use client";
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Cart } from '@/features/cart/types';
import { PriceBreakdown } from '@/features/cart/components/PriceBreakdown';

interface OrderSummaryCardProps {
  cart: Cart | null;
  onApplyOffer?: (code: string | null) => Promise<{ success: boolean; error?: string }>;
  isApplyingOffer?: boolean;
}

export const OrderSummaryCard = ({ cart, onApplyOffer, isApplyingOffer }: OrderSummaryCardProps) => {
  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/50 pb-3">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2>Order Summary ({cart.items.length} items)</h2>
      </div>

      <div className="flex flex-col gap-3">
        {cart.items.map(item => (
          <div key={item.id} className="flex justify-between items-start text-sm gap-2">
            <div className="flex flex-col min-w-0 flex-1 pr-2">
              <span className="font-semibold break-words [overflow-wrap:anywhere] line-clamp-2">{item.title}</span>
              <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
            </div>
            <span className="font-bold shrink-0 whitespace-nowrap text-right">
              ₹{typeof item.priceBreakdown.total === 'number' ? item.priceBreakdown.total.toFixed(2) : '...'}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <PriceBreakdown summary={cart.summary} onApplyOffer={onApplyOffer} isApplyingOffer={isApplyingOffer} />
      </div>
    </div>
  );
};
