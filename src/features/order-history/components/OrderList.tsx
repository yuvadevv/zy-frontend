// src/features/order-history/components/OrderList.tsx
import React, { useRef, useEffect } from 'react';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { OrderCard } from './OrderCard';
import { PaginationLoader, OrderHistorySkeleton } from './OrderHistorySkeleton';
import { OrderHistoryEmptyState } from './OrderHistoryEmptyState';
import { OrderHistoryErrorState } from './OrderHistoryErrorState';
import { NoSearchResultsState } from './NoSearchResultsState';

import { motion, useAnimation, PanInfo } from 'framer-motion';

export const OrderList = () => {
  const { 
    orders, isLoading, isLoadingMore, error, hasMore, loadMore, refresh, 
    search, filter, setSearch, setFilter 
  } = useOrderHistory();
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  const handlePanEnd = async (e: any, info: PanInfo) => {
    if (info.offset.y > 100 && window.scrollY === 0) {
      setIsRefreshing(true);
      await controls.start({ y: 50, transition: { type: 'spring' } });
      await refresh();
      setIsRefreshing(false);
      controls.start({ y: 0, transition: { type: 'spring' } });
    } else {
      controls.start({ y: 0, transition: { type: 'spring' } });
    }
  };

  if (isLoading && orders.length === 0) {
    return <OrderHistorySkeleton />;
  }

  if (error && orders.length === 0) {
    return <OrderHistoryErrorState error={error} onRetry={refresh} />;
  }

  const hasActiveSearchOrFilter = !!(search?.query || filter?.status || filter?.dateRange);

  if (orders.length === 0) {
    if (hasActiveSearchOrFilter) {
      return <NoSearchResultsState onClear={() => { setSearch(undefined); setFilter(undefined); }} />;
    }
    return <OrderHistoryEmptyState />;
  }

  return (
    <div className="relative flex flex-col w-full h-full" ref={containerRef}>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onPanEnd={handlePanEnd}
        animate={controls}
        className="flex flex-col gap-4 px-5 pb-24 relative"
      >
        {isRefreshing && (
          <div className="absolute top-[-40px] left-0 right-0 flex justify-center">
            <span className="text-[12px] font-bold text-gray-400">Refreshing...</span>
          </div>
        )}
        
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        
        <div ref={observerTarget} className="w-full h-10 flex items-center justify-center">
          {isLoadingMore && <PaginationLoader />}
        </div>
      </motion.div>
    </div>
  );
};
