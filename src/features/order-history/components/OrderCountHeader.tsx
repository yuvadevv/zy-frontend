// src/features/order-history/components/OrderCountHeader.tsx
import React from 'react';
import { useOrderHistory } from '../hooks/useOrderHistory';

export const OrderCountHeader = () => {
  const { orders, isLoading } = useOrderHistory();

  if (isLoading && orders.length === 0) {
    return <div className="px-5 pt-4 pb-2 h-[68px]" />; // Placeholder space
  }

  const activeCount = orders.filter(o => ['pending', 'printing', 'ready', 'placed', 'processing'].includes(o.status.toLowerCase())).length;
  const completedCount = orders.filter(o => ['delivered', 'cancelled', 'refunded'].includes(o.status.toLowerCase())).length;
  const totalCount = orders.length;

  return (
    <div className="px-5 pt-4 pb-3 flex flex-col gap-1">
      <h1 className="text-[28px] font-black text-gray-900 tracking-tight leading-none">
        {totalCount} Orders
      </h1>
      {totalCount > 0 && (
        <div className="flex items-center gap-2 text-[14px] font-medium text-gray-500">
          <span className={activeCount > 0 ? "text-orange-600 font-bold" : ""}>{activeCount} Active</span>
          <span className="text-gray-300">•</span>
          <span>{completedCount} Completed</span>
        </div>
      )}
    </div>
  );
};
