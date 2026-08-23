'use client';

import { useSupport } from '@/hooks/useSupport';
import { ArrowRight } from 'lucide-react';

export function DynamicSupportEmail() {
  const { supportEmail, emailSupport, isAvailable } = useSupport();

  if (!supportEmail) {
    return <span className="font-bold text-gray-400">Support email not configured</span>;
  }

  return (
    <button 
      onClick={() => emailSupport()} 
      className="font-bold text-orange-500 flex items-center gap-1 hover:gap-2 transition-all"
    >
      {supportEmail} <ArrowRight className="w-4 h-4" />
    </button>
  );
}
