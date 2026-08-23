// src/features/order-history/components/OrderHistoryErrorState.tsx
import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { AlertCircle } from 'lucide-react';

export const OrderHistoryErrorState = ({ error, onRetry }: { error: Error, onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">Failed to load history</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
        {error.message || 'We could not load your order history. Please check your connection and try again.'}
      </p>
      <Button onClick={onRetry} className="bg-transparent border border-border text-foreground hover:bg-muted min-w-[120px]">
        Try Again
      </Button>
    </div>
  );
};
