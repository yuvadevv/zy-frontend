// src/features/notifications/components/NotificationList.tsx
import React from 'react';
import { useNotifications } from '../providers/NotificationProvider';
import { NotificationCard } from './NotificationCard';
import { NotificationSkeleton } from './NotificationSkeleton';
import { NotificationEmptyState } from './NotificationEmptyState';
import { getNotificationTimeGroup, TimeGroup } from '../utils/formatters';
import { NotificationItem } from '../types';

export const NotificationList = () => {
  const { notifications, isLoading, hasMore, loadMore } = useNotifications();

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)}
      </div>
    );
  }

  if (notifications.length === 0) {
    return <NotificationEmptyState />;
  }

  // Group notifications
  const grouped: Record<TimeGroup, NotificationItem[]> = {
    'TODAY': [],
    'YESTERDAY': [],
    'THIS_WEEK': [],
    'EARLIER': []
  };

  notifications.forEach(n => {
    const group = getNotificationTimeGroup(n.createdAt);
    grouped[group].push(n);
  });

  const renderGroup = (title: string, items: NotificationItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 bg-muted/20">
          {title}
        </h3>
        {items.map(n => <NotificationCard key={n.id} notification={n} />)}
      </div>
    );
  };

  return (
    <div className="flex flex-col pb-24 h-full overflow-y-auto">
      {renderGroup('Today', grouped['TODAY'])}
      {renderGroup('Yesterday', grouped['YESTERDAY'])}
      {renderGroup('This Week', grouped['THIS_WEEK'])}
      {renderGroup('Earlier', grouped['EARLIER'])}

      {hasMore && (
        <button 
          onClick={loadMore}
          className="mx-4 my-6 py-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
};
