"use client";
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrder } from '@/features/orders/hooks/useOrder';
import { useTimeline } from '@/features/orders/hooks/useTimeline';
import { OrderHeader } from '@/features/orders/components/OrderHeader';
import { OrderStatusCard } from '@/features/orders/components/OrderStatusCard';
import { OrderProgressTimeline } from '@/features/orders/components/OrderProgressTimeline';
import { EstimatedDeliveryCard } from '@/features/orders/components/EstimatedDeliveryCard';
import { PrintDetailsCard } from '@/features/orders/components/PrintDetailsCard';
import { PriceSummaryCard } from '@/features/orders/components/PriceSummaryCard';
import { HelpSupportCard } from '@/features/orders/components/HelpSupportCard';
import { OrderSkeleton } from '@/features/orders/components/OrderSkeleton';
import { OrderErrorState } from '@/features/orders/components/OrderErrorState';
import { OrderEmptyState } from '@/features/orders/components/OrderEmptyState';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const { order, isLoading: isOrderLoading, isRefreshing, error: orderError, fetchOrder, refreshOrder } = useOrder();
  const { timeline, isLoading: isTimelineLoading } = useTimeline();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = isOrderLoading || isTimelineLoading;

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (orderError) {
    return <OrderErrorState error={orderError} onRetry={() => fetchOrder(orderId)} />;
  }

  if (!order || !timeline) {
    return <OrderEmptyState />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 pb-24">
      <OrderHeader orderId={order.id} order={order} />
      
      <main className="flex-1 p-4 flex flex-col gap-5 max-w-lg mx-auto w-full">
        <OrderStatusCard status={order.status} date={order.createdAt} onRefresh={() => refreshOrder(orderId)} isRefreshing={isRefreshing} />
        
        <OrderProgressTimeline timeline={timeline} />
        
        {order.status !== 'cancelled' && order.status !== 'rejected' && (
          <EstimatedDeliveryCard deliveryInfo={order.deliveryInfo} />
        )}
        
        {order.items.map(item => (
          <PrintDetailsCard key={item.id} item={item} />
        ))}
        
        <PriceSummaryCard summary={order.summary} />
        
        <HelpSupportCard orderId={order.id} />
      </main>
    </div>
  );
}
