// src/features/notifications/components/AnnouncementBanner.tsx
import React, { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { Announcement } from '../types';
import { useRouter } from 'next/navigation';
import { useNotificationAnalytics } from '../hooks/useNotificationAnalytics';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export const AnnouncementBanner = ({ announcements }: AnnouncementBannerProps) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { trackAnnouncementOpened } = useNotificationAnalytics();

  const visibleAnnouncements = announcements.filter(a => !dismissed.has(a.id));

  if (visibleAnnouncements.length === 0) return null;

  const announcement = visibleAnnouncements[0]; // Show highest priority first

  const handleAction = () => {
    trackAnnouncementOpened(announcement.id);
    if (announcement.cta && announcement.cta.fallbackUrl) {
      router.push(announcement.cta.fallbackUrl);
    }
  };

  return (
    <div className={`relative px-4 py-3 mx-4 mt-4 mb-2 rounded-2xl flex items-start gap-3 shadow-sm ${
      announcement.priority === 'HIGH' || announcement.priority === 'CRITICAL' 
        ? 'bg-blue-600 text-white' 
        : 'bg-primary/10 text-primary'
    }`}>
      <Megaphone className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-1 pr-6">
        <h4 className="font-bold text-sm leading-tight">{announcement.title}</h4>
        <p className="text-xs opacity-90 leading-snug">{announcement.message}</p>
        
        {announcement.cta && (
          <button 
            onClick={handleAction}
            className="mt-2 text-xs font-bold uppercase tracking-wider bg-white/20 w-fit px-3 py-1.5 rounded-md hover:bg-white/30 transition-colors"
          >
            {announcement.cta.label}
          </button>
        )}
      </div>
      <button 
        onClick={() => setDismissed(prev => new Set(prev).add(announcement.id))}
        className="absolute top-3 right-3 opacity-60 hover:opacity-100 transition-opacity p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
