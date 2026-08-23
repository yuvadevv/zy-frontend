// src/features/order-history/providers/OrderHistoryProvider.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderHistoryService } from '../services/orderHistoryService';
import { HistoryFilter, HistorySearch, HistorySortOption, OrderHistoryItem } from '../types';
import { useHistoryAnalytics } from '../hooks/useHistoryAnalytics';

interface OrderHistoryContextState {
  orders: OrderHistoryItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  search: HistorySearch | undefined;
  filter: HistoryFilter | undefined;
  sort: HistorySortOption;
  setSearch: (search: HistorySearch | undefined) => void;
  setFilter: (filter: HistoryFilter | undefined) => void;
  setSort: (sort: HistorySortOption) => void;
  loadMore: () => void;
  refresh: () => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextState | undefined>(undefined);

export const OrderHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [search, setSearch] = useState<HistorySearch | undefined>();
  const [filter, setFilter] = useState<HistoryFilter | undefined>();
  const [sort, setSort] = useState<HistorySortOption>('newest');

  const { trackSearch, trackFilter, trackSort } = useHistoryAnalytics();

  const loadData = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      const currentPage = isLoadMore ? page + 1 : 1;
      const res = await orderHistoryService.fetchOrders(currentPage, 10, search, filter, sort);
      
      setOrders(prev => isLoadMore ? [...prev, ...res.orders] : res.orders);
      setHasMore(res.hasMore);
      if (isLoadMore) setPage(currentPage);
      else setPage(1);
      
    } catch (err: unknown) {
      if (err instanceof Error) setError(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [page, search, filter, sort]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => {
        loadData();
      }, 0);
    }
    return () => { mounted = false; };
  }, [search, filter, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrap setters to include analytics
  const handleSetSearch = (newSearch: HistorySearch | undefined) => {
    setSearch(newSearch);
    if (newSearch?.query) trackSearch(newSearch.query);
  };

  const handleSetFilter = (newFilter: HistoryFilter | undefined) => {
    setFilter(newFilter);
    if (newFilter) trackFilter(newFilter.status, newFilter.dateRange);
  };

  const handleSetSort = (newSort: HistorySortOption) => {
    setSort(newSort);
    trackSort(newSort);
  };

  return (
    <OrderHistoryContext.Provider
      value={{
        orders,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        search,
        filter,
        sort,
        setSearch: handleSetSearch,
        setFilter: handleSetFilter,
        setSort: handleSetSort,
        loadMore: () => loadData(true),
        refresh: () => loadData(false)
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistoryContext = () => {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error('useOrderHistoryContext must be used within an OrderHistoryProvider');
  }
  return context;
};
