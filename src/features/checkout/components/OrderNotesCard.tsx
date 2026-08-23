// src/features/checkout/components/OrderNotesCard.tsx
"use client";
import React from 'react';
import { AlignLeft } from 'lucide-react';

interface OrderNotesCardProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const OrderNotesCard = ({ notes, onChange }: OrderNotesCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2 text-foreground font-bold">
        <AlignLeft className="w-5 h-5 text-primary" />
        <h2>Student Notes (Optional)</h2>
      </div>
      <textarea 
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Please bind the lab manual separately."
        className="w-full bg-muted/30 border border-border rounded-xl p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
};
