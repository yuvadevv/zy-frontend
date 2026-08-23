import { TrackingStatus } from '../types';
import { ordersApi } from './ordersApi';

export const trackingApi = {
  getTrackingStatus: async (orderId: string): Promise<TrackingStatus> => {
    const order = await ordersApi.getOrderById(orderId);
    if (!order || order.status === 'printing' && order.id !== orderId && order.id === 'user-123') { // Checking the fallback return
       // Actual logic: if the order is not found, the getOrderById currently returns a fallback.
       // It's better to just use the returned order properties.
    }
    
    return {
      orderId: order.id,
      currentStatus: order.status,
      estimatedDeliveryDate: order.deliveryInfo?.estimatedArrival || new Date().toISOString(),
      lastUpdated: order.updatedAt || new Date().toISOString()
    };
  }
};
