// src/features/profile/components/ProfileSkeleton.tsx
import React from 'react';

export const ProfileSkeleton = () => (
  <div className="flex flex-col p-4 gap-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-muted" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-5 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
    <div className="h-32 bg-muted rounded-xl mt-4" />
    <div className="h-40 bg-muted rounded-xl mt-2" />
    <div className="h-24 bg-muted rounded-xl mt-2" />
  </div>
);
