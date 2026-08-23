// src/features/notifications/api/announcementApi.ts
import { Announcement } from '../types';
import { workerClient } from '@/lib/api/workerClient';

export const announcementApi = {
  getActiveAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const response = await workerClient.getContent('announcement');
      if (response.content) {
        return response.content.map((a: any) => ({
          id: a.id,
          title: a.title,
          message: a.message,
          priority: a.priority || 'NORMAL',
          createdAt: new Date().toISOString(),
          cta: a.cta_label ? {
            label: a.cta_label,
            fallbackUrl: a.cta_url || '#'
          } : undefined
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to load real announcements', err);
      return [];
    }
  }
};
