// src/features/checkout/components/PaymentMethodCard.tsx
"use client";
import React from 'react';
import { usePayment } from '../hooks/usePayment';
import { CreditCard } from 'lucide-react';

interface PaymentMethodCardProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const PaymentMethodCard = ({ selectedId, onSelect }: PaymentMethodCardProps) => {
  const { methods, isLoading, error } = usePayment();

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 text-foreground font-bold">
        <CreditCard className="w-5 h-5 text-primary" />
        <h2>Payment Method</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="h-14 bg-muted animate-pulse rounded-xl" />
          <div className="h-14 bg-muted animate-pulse rounded-xl" />
        </div>
      ) : error ? (
        <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-xl">{error}</div>
      ) : (
        <div className="flex flex-col gap-3">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => method.isAvailable && onSelect(method.id)}
              disabled={!method.isAvailable}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                !method.isAvailable 
                  ? 'opacity-50 cursor-not-allowed border-border bg-muted/20'
                  : selectedId === method.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:bg-muted/30'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">{method.name}</span>
                {!method.isAvailable && method.unavailableReason && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">{method.unavailableReason}</span>
                )}
              </div>
              
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedId === method.id ? 'border-primary' : 'border-muted-foreground/30'
              }`}>
                {selectedId === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
