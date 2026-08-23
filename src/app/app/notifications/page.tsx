"use client";
import React from 'react';
import { NotificationHeader } from '@/features/notifications/components/NotificationHeader';
import { NotificationCategoryFilter } from '@/features/notifications/components/NotificationCategoryFilter';
import { NotificationList } from '@/features/notifications/components/NotificationList';
import { AnnouncementBanner } from '@/features/notifications/components/AnnouncementBanner';
import { useAnnouncements } from '@/features/notifications/hooks/useAnnouncements';

export default function NotificationsPage() {
  const { announcements } = useAnnouncements();

  return (
    <div className="flex flex-col w-full h-full bg-background min-h-[100dvh]">
      <NotificationHeader />
      <NotificationCategoryFilter />
      <AnnouncementBanner announcements={announcements} />
      <NotificationList />
    </div>
  );
}
