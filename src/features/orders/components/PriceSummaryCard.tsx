import React from 'react';
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
          <div className="flex justify-between items-center text-green-600">
            <span>Discount</span>
            <span className="font-medium">- {formatCurrency(summary.discount)}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-between items-center">
        <span className="font-bold text-foreground">Grand Total</span>
        <span className="text-xl font-black text-foreground">
          {formatCurrency(summary.grandTotal)}
        </span>
      </div>
    </div>
  );
};
