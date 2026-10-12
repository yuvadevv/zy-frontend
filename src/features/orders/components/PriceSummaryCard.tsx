import React from 'react';
import { Tag } from 'lucide-react';
import { OrderSummary } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PriceSummaryCardProps {
  summary: OrderSummary;
}

export const PriceSummaryCard = ({ summary }: PriceSummaryCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <h3 className="font-bold text-foreground">Price Summary</h3>
      
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Printing Cost</span>
          <span className="font-medium text-foreground">{formatCurrency(summary.printingCost)}</span>
        </div>
        {summary.bindingCost > 0 && (
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Binding Cost</span>
            <span className="font-medium text-foreground">{formatCurrency(summary.bindingCost)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Platform Fee</span>
          <span className="font-medium text-foreground">{formatCurrency(summary.platformFee)}</span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>GST (18%)</span>
          <span className="font-medium text-foreground">{formatCurrency(summary.gst)}</span>
        </div>
        
        {summary.discount > 0 && (
          <div className="flex justify-between items-center bg-gradient-to-r from-orange-50/95 via-amber-50/80 to-orange-50/90 border border-orange-200/90 px-3.5 py-2.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center shrink-0">
                <Tag className="w-3 h-3 text-[#FF6B00]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-orange-950 text-xs tracking-tight truncate leading-tight">
                  BLINTZY Campus Fest Offer
                </span>
                <span className="text-[10px] font-medium text-orange-700/80 leading-snug">
                  Special campus pricing
                </span>
              </div>
            </div>
            <span className="font-bold text-[#FF6B00] text-xs shrink-0 pl-2">
              - {formatCurrency(summary.discount)}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-between items-center">
        <span className="font-bold text-foreground">Final Payable</span>
        <span className="text-xl font-black text-[#FF6B00]">
          {formatCurrency(summary.grandTotal)}
        </span>
      </div>
    </div>
  );
};
