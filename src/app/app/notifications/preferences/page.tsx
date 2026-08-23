"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { NotificationPreferencesCard } from '@/features/notifications/components/NotificationPreferencesCard';
import { ChevronLeft } from 'lucide-react';

export default function NotificationPreferencesPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full bg-background min-h-[100dvh]">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Notification Preferences</h1>
        </div>
      </header>
      
      <div className="pb-24 overflow-y-auto h-full">
        <NotificationPreferencesCard />
      </div>
    </div>
  );
}
