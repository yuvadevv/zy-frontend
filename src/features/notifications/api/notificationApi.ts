import { NotificationItem, NotificationStatus } from '../types';
import { workerClient } from '@/lib/api/workerClient';

export const notificationApi = {
  getNotifications: async (page: number = 1, limit: number = 20): Promise<{ items: NotificationItem[], total: number, unreadCount: number }> => {
    // Fetch from real backend
    const response = await workerClient.fetch(`/api/notifications?page=${page}&limit=${limit}`);
    const rawData = response.notifications || [];
    
    const items: NotificationItem[] = rawData.map((n: any) => ({
      id: n.notification_id || n.id,
      type: n.category === 'Announcement' ? 'SYSTEM' : 'ALERTS',
      title: n.title,
      message: n.message,
      createdAt: new Date(n.created_at),
      status: n.read_at ? 'READ' : 'UNREAD',
      category: n.category || 'ALERTS',
      actionUrl: n.action_url || undefined,
    }));

    return {
      items,
      total: response.total || 0,
      unreadCount: items.filter(n => n.status === 'UNREAD').length // Fallback if API doesn't provide it
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await workerClient.fetch('/api/notifications/unread-count');
    return response.unreadCount || 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await workerClient.fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },

  markAllAsRead: async (): Promise<void> => {
    await workerClient.fetch(`/api/notifications/read-all`, { method: 'PATCH' });
  },

  updateStatus: async (id: string, status: NotificationStatus): Promise<void> => {
    if (status === 'READ') {
      await workerClient.fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    }
  }
};
