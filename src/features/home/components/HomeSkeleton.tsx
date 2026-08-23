import React from 'react';
import { Skeleton } from '@/design-system/components/feedback/Skeleton/Skeleton';

export const WidgetSkeleton = () => (
  <div className="flex flex-col gap-4 p-4 rounded-xl bg-card border border-border">
    <Skeleton className="h-6 w-1/3 rounded-md" />
    <Skeleton className="h-24 w-full rounded-md" />
  </div>
);

export const CurrentOrderSkeleton = () => (
  <div className="p-6 bg-card border border-border rounded-xl">
    <Skeleton className="h-6 w-1/4 mb-4 rounded-md" />
    <Skeleton className="h-10 w-full mb-3 rounded-md" />
    <Skeleton className="h-2 w-full rounded-full mb-3" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-1/4 rounded-md" />
      <Skeleton className="h-4 w-1/4 rounded-md" />
    </div>
    <Skeleton className="h-12 w-full mt-4 rounded-lg" />
  </div>
);

