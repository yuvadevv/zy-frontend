import React from 'react';

export const OrderSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-2">
        <div className="h-6 w-32 bg-muted rounded-md" />
        <div className="h-8 w-8 bg-muted rounded-full" />
      </div>

      {/* Main Status Skeleton */}
      <div className="h-32 bg-muted rounded-2xl w-full" />

      {/* Timeline Skeleton */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 w-24 bg-muted rounded-md" />
              <div className="h-3 w-48 bg-muted rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Details Cards Skeletons */}
      <div className="grid gap-4">
        <div className="h-24 bg-muted rounded-2xl" />
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="h-32 bg-muted rounded-2xl" />
      </div>
    </div>
  );
};
