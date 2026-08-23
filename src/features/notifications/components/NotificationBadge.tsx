// src/features/notifications/components/NotificationBadge.tsx
import React from 'react';
import { useNotifications } from '../providers/NotificationProvider';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  className?: string;
  iconOnly?: boolean;
}

export const NotificationBadge = ({ className = '', iconOnly = false }: NotificationBadgeProps) => {
  const { unreadCount } = useNotifications();

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Bell className="w-6 h-6 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background flex items-center justify-center min-w-[20px]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};
