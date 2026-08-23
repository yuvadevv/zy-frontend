// src/features/profile/components/NotificationSettingsCard.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { BellRing, ChevronRight } from 'lucide-react';

export const NotificationSettingsCard = () => {
  const router = useRouter();

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm mt-4 overflow-hidden">
      <button 
        onClick={() => router.push('/app/profile/notifications')}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-foreground">Notification Settings</h3>
            <p className="text-xs text-muted-foreground">Manage push, email & SMS alerts</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
};
