// src/features/notifications/api/notificationApi.ts
import { NotificationItem, NotificationStatus } from '../types';
import { mockNotifications } from '../services/mockNotifications';

let notificationsCache = [...mockNotifications];

export const notificationApi = {
  getNotifications: async (page: number = 1, limit: number = 20): Promise<{ items: NotificationItem[], total: number, unreadCount: number }> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Network delay

    // Compute unread count globally
    const unreadCount = notificationsCache.filter(n => n.status === 'UNREAD').length;

    // Filter out deleted
    const visible = notificationsCache.filter(n => n.status !== 'DELETED');
    
    // Sort newest first
    const sorted = [...visible].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      total: sorted.length,
      unreadCount
    };
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = notificationsCache.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Notification not found');
    
    notificationsCache[index] = { ...notificationsCache[index], status: 'READ' };
    return notificationsCache[index];
  },

  markAllAsRead: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    notificationsCache = notificationsCache.map(n => 
      n.status === 'UNREAD' ? { ...n, status: 'READ' } : n
    );
  },

  updateStatus: async (id: string, status: NotificationStatus): Promise<NotificationItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = notificationsCache.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Notification not found');
    
    notificationsCache[index] = { ...notificationsCache[index], status };
    return notificationsCache[index];
  }
};
