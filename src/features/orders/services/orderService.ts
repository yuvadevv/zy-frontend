import { Order, OrderStatus } from '../types';
import { ordersApi } from '../api/ordersApi';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    return await ordersApi.getOrders();
  },

  getOrderById: async (id: string): Promise<Order> => {
    return await ordersApi.getOrderById(id);
  }
};
