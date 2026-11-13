'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Utensils, X, ShieldAlert, ArrowRight, Printer } from 'lucide-react';

interface FoodLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function FoodLockedModal({ isOpen, onClose, message }: FoodLockedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle orange accent gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#FF6B00] to-orange-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Center Emblem */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs">
              <Utensils className="w-7 h-7 text-[#FF6B00]" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[#151515] text-white flex items-center justify-center shadow-md ring-2 ring-white">
              <Lock className="w-3.5 h-3.5 text-[#FF6B00] stroke-[2.5]" />
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            Service Locked
          </span>

          <h3 className="text-base font-black text-[#151515] tracking-tight">
            Campus Food Is Locked
          </h3>

          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            {message || 'Campus Food ordering is launching soon! Please check back later or contact campus support.'}
          </p>

          <div className="w-full mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-left flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex flex-col text-[11px] leading-snug text-gray-600">
              <span className="font-bold text-gray-800">Admin Managed Control</span>
              <span>This counter is currently locked by campus administrators for scheduled rollout.</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 mt-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#151515] hover:bg-black active:scale-98 text-white font-extrabold text-xs transition"
            >
              Understood
            </button>

            <Link
              href="/app/services"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold text-xs transition flex items-center justify-center gap-1.5 border border-orange-200/60"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Explore Academic Printing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

