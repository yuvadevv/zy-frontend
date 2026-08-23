'use client';

import React from 'react';
import { OnboardingCarousel } from '@/design-system/components/common/OnboardingCarousel';
import { Check } from 'lucide-react';
import Link from 'next/link';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">


      {/* Left side: Premium Campus Experience Scene (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-between p-12 overflow-hidden border-r border-gray-100">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full flex justify-start z-10">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-xl shadow-sm">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Blintzy</span>
          </Link>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center z-10 max-w-lg mt-8">
          <OnboardingCarousel />
        </div>

        {/* Trust Signals / Credibility Card */}
        <div className="w-full max-w-md z-10 bg-white/50 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl mt-8">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Check className="w-4 h-4 text-green-500" strokeWidth={3} /> Fast Classroom Delivery
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Check className="w-4 h-4 text-green-500" strokeWidth={3} /> Built for Students
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Check className="w-4 h-4 text-green-500" strokeWidth={3} /> Secure Google Login
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mb-4" />
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>📄 Multiple document types</span>
            <span>🖨 Color & B/W printing</span>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative z-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
