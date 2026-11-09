'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingBag, Clock } from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';
import { useFoodCart } from '../store/useFoodCart';

interface FoodHeaderProps {
  onOpenOrderDetails?: () => void;
}

export const FoodHeader: React.FC<FoodHeaderProps> = ({ onOpenOrderDetails }) => {
  const router = useRouter();
  const { getTotalCount, openCartDrawer, activeOrder } = useFoodCart();
  const totalCount = getTotalCount();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-gray-150 py-2.5 px-0.5 mb-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Return to Home button */}
        <button
          onClick={() => router.push(APP_ROUTES.HOME)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#151515] transition-colors active:scale-95 py-1 px-1.5 rounded-lg hover:bg-gray-100"
          aria-label="Back to BLINTZY Home"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.4]" />
          <span>Campus</span>
        </button>

        {/* Center: BLINTZY Food Branding Badge */}
        <div className="flex items-center gap-1.5 select-none">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="text-xs sm:text-sm font-black tracking-tight text-[#151515]">
            BLINTZY <span className="text-[#FF6B00]">Food</span>
          </span>
          <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md hidden xs:inline">
            Counter Pickup
          </span>
        </div>

        {/* Right Actions: Active Order Pill & Food Cart Button */}
        <div className="flex items-center gap-2">
          {activeOrder && (
            <button
              onClick={onOpenOrderDetails}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[10.5px] font-extrabold text-[#FF6B00] hover:bg-orange-100 active:scale-95 transition"
              title="View live active order status"
            >
              <Clock className="w-3 h-3 text-[#FF6B00]" />
              <span>{activeOrder.tokenNumber}</span>
            </button>
          )}

          <button
            onClick={openCartDrawer}
            className="relative p-2 rounded-xl text-gray-800 hover:text-[#151515] hover:bg-gray-100 active:scale-95 transition"
            aria-label="View Food Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-150">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

