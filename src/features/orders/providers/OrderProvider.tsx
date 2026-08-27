"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, TimelineEvent, TrackingStatus } from '../types';
import { orderService } from '../services/orderService';
import { trackingService } from '../services/trackingService';
import { useAuthSession } from '../../auth/hooks/useAuthSession';

interface OrderContextType {
  order: Order | null;
  timeline: TimelineEvent[] | null;
  tracking: TrackingStatus | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  fetchOrder: (id: string) => Promise<void>;
  refreshOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[] | null>(null);
  const [tracking, setTracking] = useState<TrackingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setOrder(null);
      setTimeline(null);
      setTracking(null);
    }
  }, [user?.id]);

  const fetchOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedOrder, fetchedTimeline, fetchedTracking] = await Promise.all([
        orderService.getOrderById(id),
        trackingService.getTimeline(id),
        trackingService.getTrackingStatus(id)
      ]);
      setOrder(fetchedOrder);
      setTimeline(fetchedTimeline);
      setTracking(fetchedTracking);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching order'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrder = async (id: string) => {
    setIsRefreshing(true);
    try {
      const [fetchedOrder, fetchedTimeline, fetchedTracking] = await Promise.all([
        orderService.getOrderById(id),
        trackingService.getTimeline(id),
        trackingService.getTrackingStatus(id)
      ]);
      setOrder(fetchedOrder);
      setTimeline(fetchedTimeline);
      setTracking(fetchedTracking);
    } catch (err) {
      console.error('Failed to refresh order', err);
      // Don't set error state to prevent UI disruption on background refresh failure
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      order,
      timeline,
      tracking,
      isLoading,
      error,
      isRefreshing,
      fetchOrder,
      refreshOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
