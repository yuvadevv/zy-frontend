import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface OrderErrorStateProps {
  error: Error;
  onRetry: () => void;
}

import { useRouter } from 'next/navigation';

export const OrderErrorState = ({ error, onRetry }: OrderErrorStateProps) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-5 text-center min-h-[60vh]">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-[20px] font-black text-gray-900 mb-2 tracking-tight">Unable to load this order</h3>
      <p className="text-[14px] font-medium text-gray-500 mb-8 max-w-[280px] leading-relaxed">
        The order may have been removed or you're offline.
      </p>
      <div className="flex flex-col w-full gap-3 max-w-[240px]">
        <Button 
          onClick={onRetry} 
          className="w-full bg-[#FF6B00] text-white font-bold rounded-[18px] py-4 h-[52px] shadow-[0_8px_30px_rgba(255,107,0,0.2)] hover:scale-[1.02] transition-transform"
        >
          Retry
        </Button>
        <Button 
          onClick={() => router.back()} 
          className="w-full bg-gray-50 text-gray-700 font-bold border border-gray-200 rounded-[18px] py-4 h-[52px] hover:bg-gray-100 transition-colors"
        >
          Go Back
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          className="w-full bg-gray-50 text-gray-700 font-bold border border-gray-200 rounded-[18px] py-4 h-[52px] hover:bg-gray-100 transition-colors"
        >
          Refresh Orders
        </Button>
        <Button 
          onClick={() => window.open('https://wa.me/1234567890', '_blank')}
          className="w-full bg-transparent text-gray-500 font-bold h-[48px] hover:text-gray-900 transition-colors mt-2"
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
};
