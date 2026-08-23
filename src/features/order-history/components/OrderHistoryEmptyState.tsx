// src/features/order-history/components/OrderHistoryEmptyState.tsx
import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/routes';

export const OrderHistoryEmptyState = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-sm border border-gray-100">
        <span className="text-[40px]">📄</span>
      </div>
      <h3 className="text-[20px] font-black text-gray-900 mb-2 tracking-tight">No print history yet</h3>
      <p className="text-[14px] font-medium text-gray-500 mb-8 max-w-[280px]">
        Your completed print orders will appear here.
      </p>
      <div className="flex flex-col w-full gap-3 max-w-[240px]">
        <Button 
          onClick={() => router.push(APP_ROUTES.HOME)} 
          className="w-full bg-[#FF6B00] text-white font-bold rounded-[18px] py-4 h-[56px] shadow-[0_8px_30px_rgba(255,107,0,0.2)] hover:scale-[1.02] transition-transform"
        >
          Start Printing
        </Button>
        <Button 
          onClick={() => router.push(APP_ROUTES.SERVICES.MANUALS)} 
          className="w-full bg-gray-50 text-gray-700 font-bold border border-gray-200 rounded-[18px] py-4 h-[56px] hover:bg-gray-100 transition-colors"
        >
          Browse Manuals
        </Button>
      </div>
    </div>
  );
};
