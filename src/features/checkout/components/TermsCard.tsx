// src/features/checkout/components/TermsCard.tsx
"use client";
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { useSupport } from '@/hooks/useSupport';

interface TermsCardProps {
  accepted: boolean;
  onToggle: (accepted: boolean) => void;
}

export const TermsCard = ({ accepted, onToggle }: TermsCardProps) => {
  const { termsUrl, privacyPolicyUrl } = useSupport();

  return (
    <div 
      className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3 select-none hover:bg-muted/30 transition-colors"
    >
      <div 
        className="mt-0.5 text-primary cursor-pointer"
        onClick={() => onToggle(!accepted)}
      >
        {accepted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        I agree to the <a href={termsUrl || "/terms"} target={termsUrl ? "_blank" : undefined} rel="noopener noreferrer" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-2">Terms of Service</a> and <a href={privacyPolicyUrl || "/privacy"} target={privacyPolicyUrl ? "_blank" : undefined} rel="noopener noreferrer" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-2">Privacy Policy</a>. 
      </p>
    </div>
  );
};
