// src/features/order-history/components/ReorderButton.tsx
import React from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { useReorder } from '../hooks/useReorder';

interface ReorderButtonProps {
  orderId: string;
  variant?: 'full' | 'icon';
}

export const ReorderButton = ({ orderId, variant = 'full' }: ReorderButtonProps) => {
  const { handleReorder, isReordering } = useReorder();
  const loading = isReordering === orderId;

  if (variant === 'icon') {
    return (
      <button 
        onClick={(e) => { e.stopPropagation(); handleReorder(orderId); }}
        disabled={loading}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <Button
      onClick={(e) => { e.stopPropagation(); handleReorder(orderId); }}
      isDisabled={loading}
      className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex-1 py-3"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Processing...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Reorder Again
        </div>
      )}
    </Button>
  );
};
