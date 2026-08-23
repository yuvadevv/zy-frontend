// src/features/notifications/components/NotificationEmptyState.tsx
import React from 'react';
import { BellRing } from 'lucide-react';

export const NotificationEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <BellRing className="w-8 h-8 text-primary opacity-80" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">You&apos;re all caught up!</h3>
    <p className="text-sm text-muted-foreground max-w-[250px]">
      No new notifications at the moment. We&apos;ll alert you when there&apos;s an update.
    </p>
  </div>
);


