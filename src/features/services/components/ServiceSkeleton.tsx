import React from 'react';
import { Skeleton } from '@/design-system/components/feedback/Skeleton/Skeleton';

export const ServiceCardSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 bg-card border border-border rounded-xl">
    <div className="flex items-center gap-3 mb-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col gap-1 w-full">
        <Skeleton className="h-5 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
    <Skeleton className="h-3 w-full rounded" />
    <Skeleton className="h-3 w-5/6 rounded" />
  </div>
);

export const ServiceGridSkeleton = () => (
  <div className="flex flex-col gap-4">
    <ServiceCardSkeleton />
    <ServiceCardSkeleton />
    <ServiceCardSkeleton />
  </div>
);

export const CategoryFilterSkeleton = () => (
  <div className="flex overflow-x-hidden gap-2 pb-2">
    <Skeleton className="h-8 w-20 rounded-full" />
    <Skeleton className="h-8 w-24 rounded-full" />
    <Skeleton className="h-8 w-16 rounded-full" />
    <Skeleton className="h-8 w-28 rounded-full" />
  </div>
);
