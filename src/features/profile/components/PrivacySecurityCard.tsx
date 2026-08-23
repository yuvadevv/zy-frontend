// src/features/profile/components/PrivacySecurityCard.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const PrivacySecurityCard = () => {
  const router = useRouter();

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm mt-4 overflow-hidden">
      <button 
        onClick={() => router.push('/app/profile/security')}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-foreground">Security & Devices</h3>
            <p className="text-xs text-muted-foreground">Manage active sessions & log out</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
};
