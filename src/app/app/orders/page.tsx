"use client";
import React, { useEffect } from 'react';
import { OrderHistoryProvider } from '@/features/order-history/providers/OrderHistoryProvider';
import { OrderCountHeader } from '@/features/order-history/components/OrderCountHeader';
import { OrderSearch } from '@/features/order-history/components/OrderSearch';
import { OrderFilters } from '@/features/order-history/components/OrderFilters';
import { OrderSort } from '@/features/order-history/components/OrderSort';
import { OrderList } from '@/features/order-history/components/OrderList';
import { useHistoryAnalytics } from '@/features/order-history/hooks/useHistoryAnalytics';

const OrderHistoryContent = () => {
  const { trackHistoryOpened } = useHistoryAnalytics();

  useEffect(() => {
    trackHistoryOpened();
  }, [trackHistoryOpened]);

  return (
    <div className="flex flex-col w-full h-full bg-background min-h-[100dvh]">
      <OrderCountHeader />
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md pb-2 border-b border-border/40 shadow-sm">
        <OrderSearch />
        <div className="flex items-center justify-between">
          <div className="flex-1 overflow-hidden">
            <OrderFilters />
          </div>
          <OrderSort />
        </div>
      </div>
      <OrderList />
    </div>
  );
};

export default function OrderHistoryPage() {
  return (
    <OrderHistoryProvider>
      <OrderHistoryContent />
    </OrderHistoryProvider>
  );
}
