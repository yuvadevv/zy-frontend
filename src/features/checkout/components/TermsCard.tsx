// src/features/checkout/components/TermsCard.tsx
"use client";
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface TermsCardProps {
  accepted: boolean;
  onToggle: (accepted: boolean) => void;
}

export const TermsCard = ({ accepted, onToggle }: TermsCardProps) => {
  return (
    <div 
      className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3 cursor-pointer select-none hover:bg-muted/30 transition-colors"
      onClick={() => onToggle(!accepted)}
    >
      <div className="mt-0.5 text-primary">
        {accepted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        I agree to the <span className="font-semibold text-foreground underline decoration-primary/50 underline-offset-2">Terms of Service</span> and <span className="font-semibold text-foreground underline decoration-primary/50 underline-offset-2">Printing Policy</span>. 
      </p>
    </div>
  );
};
