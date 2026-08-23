// src/features/profile/components/HelpSupportCard.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LifeBuoy, ChevronRight } from 'lucide-react';

export const HelpSupportCard = () => {
  const router = useRouter();

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm mt-4 overflow-hidden">
      <button 
        onClick={() => router.push('/app/profile/support')}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-foreground">Help & Support</h3>
            <p className="text-xs text-muted-foreground">FAQs, Support, Legal & App Version</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
};
