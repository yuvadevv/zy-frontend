// src/features/notifications/components/NotificationHeader.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings, ChevronLeft } from 'lucide-react';
import { useNotifications } from '../providers/NotificationProvider';

export const NotificationHeader = () => {
  const router = useRouter();
  const { unreadCount, markAllAsRead } = useNotifications();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllAsRead()}
            className="text-xs font-medium text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
        <button 
          onClick={() => router.push('/app/notifications/preferences')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
