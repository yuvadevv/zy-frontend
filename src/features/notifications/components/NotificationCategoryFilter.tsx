// src/features/notifications/components/NotificationCategoryFilter.tsx
import React from 'react';
import { useNotifications } from '../providers/NotificationProvider';
import { NotificationCategory } from '../types';

const FILTERS: { label: string; value: NotificationCategory | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Orders', value: 'ORDER' },
  { label: 'Payments', value: 'PAYMENT' },
  { label: 'System', value: 'SYSTEM' },
  { label: 'Promotions', value: 'PROMOTION' }
];

export const NotificationCategoryFilter = () => {
  const { activeCategory, setActiveCategory } = useNotifications();

  return (
    <div className="flex overflow-x-auto gap-2 px-4 py-3 no-scrollbar border-b border-border">
      {FILTERS.map(filter => (
        <button
          key={filter.value}
          onClick={() => setActiveCategory(filter.value)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === filter.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
