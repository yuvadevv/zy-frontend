// src/features/notifications/services/announcementService.ts
import { announcementApi } from '../api/announcementApi';

export const announcementService = {
  fetchAnnouncements: async () => {
    return await announcementApi.getActiveAnnouncements();
  }
};
