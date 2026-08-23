// src/features/order-history/api/orderHistoryApi.ts

import { OrderHistoryResponse, HistoryFilter, HistorySearch, HistorySortOption, OrderHistoryItem } from '../types';
import { MOCK_HISTORY_ORDERS } from '../services/mockHistory';
import { workerClient } from '@/lib/api/workerClient';

export const orderHistoryApi = {
  getOrders: async (
    page: number = 1, 
    limit: number = 10,
    search?: HistorySearch,
    filter?: HistoryFilter,
    sort: HistorySortOption = 'newest'
  ): Promise<OrderHistoryResponse> => {
    try {
      // Fetch real orders from backend
      const response = await workerClient.getOrders();
      const realOrders = response.orders || [];

      // Map backend orders to frontend OrderHistoryItem format
      const mappedOrders: OrderHistoryItem[] = realOrders.map((ro: any) => ({
        id: ro.public_id,
        status: ro.status, // We use the backend status
        createdAt: new Date(ro.created_at).toISOString(),
        deliveryDate: new Date(ro.estimated_delivery).toISOString(),
        totalAmount: ro.grand_total,
        totalCopies: 1, // Defaulting for list view
        totalPages: 0,
        documentNames: ['Order Document'],
      }));

      // Combine with mock orders as a fallback to preserve prototype visuals
      let results = [...mappedOrders, ...MOCK_HISTORY_ORDERS];

      // Apply Search
      if (search?.query) {
        const q = search.query.toLowerCase();
        results = results.filter(order => 
          order.id.toLowerCase().includes(q) || 
          order.documentNames.some(name => name.toLowerCase().includes(q)) ||
          order.status.toLowerCase().includes(q)
        );
      }

      // Apply Filter
      if (filter) {
        if (filter.status !== 'all') {
          if (filter.status === 'accepted') {
            results = results.filter(o => ['pending', 'accepted', 'printing', 'binding', 'quality_check', 'packed', 'ready_for_pickup', 'out_for_delivery'].includes(o.status));
          } else {
            results = results.filter(o => o.status === filter.status);
          }
        }
        
        if (filter.dateRange) {
          const start = new Date(filter.dateRange.start).getTime();
          const end = new Date(filter.dateRange.end).getTime();
          results = results.filter(o => {
            const time = new Date(o.createdAt).getTime();
            return time >= start && time <= end;
          });
        }
      }

      // Apply Sort
      results.sort((a, b) => {
        switch (sort) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'newest':
          case 'recent_activity': 
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'highest_amount':
            return b.totalAmount - a.totalAmount;
          case 'lowest_amount':
            return a.totalAmount - b.totalAmount;
          case 'alphabetical':
            return a.documentNames[0].localeCompare(b.documentNames[0]);
          default:
            return 0;
        }
      });

      const totalCount = results.length;
      const startIndex = (page - 1) * limit;
      const paginated = results.slice(startIndex, startIndex + limit);

      return {
        orders: paginated,
        hasMore: startIndex + limit < totalCount,
        totalCount,
        nextCursor: startIndex + limit < totalCount ? String(page + 1) : undefined
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  getOrderById: async (id: string): Promise<OrderHistoryItem> => {
    try {
      const response = await workerClient.getOrder(id);
      const ro = response.order;
      const items = response.items || [];
      
      return {
        id: ro.public_id,
        status: ro.status,
        createdAt: new Date(ro.created_at).toISOString(),
        deliveryDate: new Date(ro.estimated_delivery).toISOString(),
        totalAmount: ro.grand_total,
        totalCopies: items.reduce((acc: number, curr: any) => acc + curr.copies, 0),
        totalPages: items.reduce((acc: number, curr: any) => acc + curr.page_count, 0),
        documentNames: items.map((i: any) => i.manual_title || i.document_filename || 'Unknown Document')
      };
    } catch (e) {
      // Fallback to mock
      const order = MOCK_HISTORY_ORDERS.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
  }
};
