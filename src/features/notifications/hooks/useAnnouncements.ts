// src/features/notifications/hooks/useAnnouncements.ts
import { useState, useEffect } from 'react';
import { Announcement } from '../types';
import { announcementService } from '../services/announcementService';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.fetchAnnouncements();
        if (mounted) setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load announcements", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { mounted = false; };
  }, []);

  return { announcements, isLoading };
};
