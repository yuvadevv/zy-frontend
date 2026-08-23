// src/features/profile/components/AboutAppCard.tsx
import React from 'react';
import { Info, FileText } from 'lucide-react';
import { APP_INFO } from '../constants';

export const AboutAppCard = () => (
  <div className="flex flex-col gap-4 mt-6 mb-8 px-2">
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl mb-2">
        B
      </div>
      <h4 className="font-bold text-foreground">BLINTZY</h4>
      <p className="text-xs text-muted-foreground">Version {APP_INFO.VERSION} ({APP_INFO.BUILD})</p>
    </div>

    <div className="flex justify-center gap-4 text-xs text-primary font-medium">
      <a href="/terms" className="hover:underline flex items-center gap-1">
        <FileText className="w-3 h-3" /> Terms
      </a>
      <span>•</span>
      <a href="/privacy" className="hover:underline flex items-center gap-1">
        <Info className="w-3 h-3" /> Privacy
      </a>
    </div>
  </div>
);
