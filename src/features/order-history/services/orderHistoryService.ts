// src/features/order-history/services/orderHistoryService.ts

import { orderHistoryApi } from '../api/orderHistoryApi';
import { HistoryFilter, HistorySearch, HistorySortOption } from '../types';

export const orderHistoryService = {
  fetchOrders: async (page: number, limit: number, search?: HistorySearch, filter?: HistoryFilter, sort?: HistorySortOption) => {
    try {
      const response = await orderHistoryApi.getOrders(page, limit, search, filter, sort);
      return response;
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      throw new Error('Failed to load your order history. Please check your connection and try again.');
    }
  },
  
  fetchOrderDetails: async (orderId: string) => {
    try {
      return await orderHistoryApi.getOrderById(orderId);
    } catch (error) {
      console.error(`Failed to fetch details for order ${orderId}:`, error);
      throw new Error('Could not find order details.');
    }
  }
};
