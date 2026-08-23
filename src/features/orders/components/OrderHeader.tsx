import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrderActionsMenu } from '@/features/order-history/components/OrderActionsMenu';

interface OrderHeaderProps {
  orderId: string;
  order?: any;
}

export const OrderHeader = ({ orderId, order }: OrderHeaderProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order ID</span>
          <h1 className="text-base font-bold leading-tight truncate max-w-[200px]">{orderId}</h1>
        </div>
      </div>
      <div className="relative">
        <OrderActionsMenu 
          orderId={orderId} 
          order={order}
        />
      </div>
    </header>
  );
};
