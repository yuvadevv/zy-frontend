// src/features/notifications/components/NotificationSkeleton.tsx
import React from 'react';

export const NotificationSkeleton = () => (
  <div className="p-4 flex gap-4 border-b border-border bg-background">
    <div className="w-10 h-10 rounded-full bg-muted animate-pulse shrink-0" />
    <div className="flex-1 flex flex-col gap-2 pt-1">
      <div className="flex justify-between items-center gap-4">
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-3 bg-muted animate-pulse rounded w-12" />
      </div>
      <div className="h-3 bg-muted animate-pulse rounded w-full" />
      <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
    </div>
  </div>
);
