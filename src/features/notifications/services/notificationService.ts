// src/features/notifications/services/notificationService.ts
import { notificationApi } from '../api/notificationApi';
import { NotificationStatus } from '../types';

export const notificationService = {
  fetchNotifications: async (page: number) => {
    return await notificationApi.getNotifications(page);
  },
  
  getUnreadCount: async (): Promise<number> => {
    return await notificationApi.getUnreadCount();
  },
  
  markAsRead: async (id: string): Promise<void> => {
    return await notificationApi.markAsRead(id);
  },
  
  markAllAsRead: async (): Promise<void> => {
    return await notificationApi.markAllAsRead();
  },

  archiveNotification: async (id: string): Promise<void> => {
    return await notificationApi.updateStatus(id, 'ARCHIVED');
  }
};
