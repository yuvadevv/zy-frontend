// src/features/notifications/components/NotificationCard.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { NotificationItem } from '../types';
import { formatNotificationTime } from '../utils/formatters';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants/categories';
import { NotificationActionMenu } from './NotificationActionMenu';
import { useNotifications } from '../providers/NotificationProvider';

interface NotificationCardProps {
  notification: NotificationItem;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const router = useRouter();
  const { markAsRead } = useNotifications();
  const Icon = CATEGORY_ICONS[notification.category];
  const colorClass = CATEGORY_COLORS[notification.category];
  const isUnread = notification.status === 'UNREAD';

  const handleClick = () => {
    if (isUnread) markAsRead(notification.id);
    
    // Hybrid deep linking based on actions payload
    if (notification.actions && notification.actions.length > 0) {
      const action = notification.actions[0];
      if (action.fallbackUrl) {
        router.push(action.fallbackUrl);
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative p-4 flex gap-4 border-b border-border transition-colors cursor-pointer ${
        isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'bg-background hover:bg-muted/30'
      }`}
    >
      {isUnread && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full" />
      )}
      
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`text-sm tracking-tight truncate ${isUnread ? 'font-bold text-foreground' : 'font-semibold text-foreground/90'}`}>
            {notification.title}
          </h4>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatNotificationTime(notification.createdAt)}
            </span>
            <NotificationActionMenu notification={notification} />
          </div>
        </div>
        
        <p className={`text-sm leading-snug line-clamp-2 ${isUnread ? 'text-foreground/80' : 'text-muted-foreground'}`}>
          {notification.description}
        </p>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="mt-2 flex gap-2">
            {notification.actions.map((action, index) => (
              <button 
                key={index}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isUnread) markAsRead(notification.id);
                  if (action.fallbackUrl) router.push(action.fallbackUrl);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
