// src/features/notifications/api/notificationApi.ts
import { NotificationItem, NotificationStatus } from '../types';
import { workerClient } from '@/lib/api/workerClient';

export const notificationApi = {
  getNotifications: async (page: number = 1, limit: number = 20): Promise<{ items: NotificationItem[], total: number, unreadCount: number }> => {
    // Fetch from real backend
    const response = await workerClient.getNotifications();
    const rawData = Array.isArray(response) ? response : (response.data || []);
    
    const items: NotificationItem[] = rawData.map((n: any) => ({
      id: n.id,
      type: n.type || 'SYSTEM', // Mapping type properly
      title: n.title,
      message: n.message,
      createdAt: new Date(n.created_at),
      status: n.is_read ? 'READ' : 'UNREAD',
      category: 'ALERTS', // Simplified mapping
      actionUrl: n.related_refund_id ? '/app/refunds' : n.related_order_id ? `/app/orders/${n.related_order_id}` : undefined,
    }));

    const unreadCount = items.filter(n => n.status === 'UNREAD').length;

    // We do frontend pagination for now if API returns all
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      total: items.length,
      unreadCount
    };
  },

  markAsRead: async (id: string): Promise<void> => {
    await workerClient.markNotificationRead(id);
  },

  markAllAsRead: async (): Promise<void> => {
    // For now, no bulk mark read API, so we just mock resolving
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  updateStatus: async (id: string, status: NotificationStatus): Promise<void> => {
    if (status === 'READ') {
      await workerClient.markNotificationRead(id);
    }
  }
};
