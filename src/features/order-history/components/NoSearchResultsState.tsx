// src/features/order-history/components/NoSearchResultsState.tsx
import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/design-system/components/buttons/Button/Button';

export const NoSearchResultsState = ({ onClear }: { onClear: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh]">
      <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 text-gray-300">
        <SearchX className="w-10 h-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-[18px] font-black text-gray-900 mb-2 tracking-tight">No matching orders</h3>
      <p className="text-[14px] font-medium text-gray-500 mb-8 max-w-[250px] leading-relaxed">
        Try searching Order ID, Subject, Manual Name
      </p>
      <Button 
        onClick={onClear} 
        className="bg-white border border-gray-200 text-gray-700 font-bold rounded-[16px] hover:bg-gray-50 h-[48px] px-8 shadow-sm transition-colors"
      >
        Clear Search
      </Button>
    </div>
  );
};
