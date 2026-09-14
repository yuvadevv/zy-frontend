// src/features/profile/components/AboutAppCard.tsx
import React from 'react';
import { Info, FileText } from 'lucide-react';
import { APP_INFO } from '../constants';
import { useSupport } from '@/hooks/useSupport';

export const AboutAppCard = () => {
  const { termsUrl, privacyPolicyUrl } = useSupport();

  return (
    <div className="flex flex-col gap-4 mt-6 mb-8 px-2">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="bg-[#FF6B00] px-3 py-1.5 rounded flex items-center justify-center mb-1">
          <div className="font-black text-lg tracking-tighter flex items-center">
            <span className="text-black">BLINT</span>
            <span className="text-white">ZY</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Version {APP_INFO.VERSION} ({APP_INFO.BUILD})</p>
      </div>

      <div className="flex justify-center gap-4 text-xs text-primary font-medium">
        <a href={termsUrl || "/terms"} target={termsUrl ? "_blank" : undefined} rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
          <FileText className="w-3 h-3" /> Terms
        </a>
        <span>•</span>
        <a href={privacyPolicyUrl || "/privacy"} target={privacyPolicyUrl ? "_blank" : undefined} rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
          <Info className="w-3 h-3" /> Privacy
        </a>
      </div>
    </div>
  );
};
