// src/features/notifications/services/notificationService.ts
import { notificationApi } from '../api/notificationApi';
import { NotificationStatus } from '../types';

export const notificationService = {
  fetchNotifications: async (page: number) => {
    return await notificationApi.getNotifications(page);
  },
  
  markAsRead: async (id: string) => {
    return await notificationApi.markAsRead(id);
  },
  
  markAllAsRead: async () => {
    return await notificationApi.markAllAsRead();
  },

  archiveNotification: async (id: string) => {
    return await notificationApi.updateStatus(id, 'ARCHIVED');
  }
};
