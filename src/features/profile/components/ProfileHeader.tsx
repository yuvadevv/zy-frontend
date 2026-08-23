// src/features/profile/components/ProfileHeader.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export const ProfileHeader = () => {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Account</h1>
      </div>
    </header>
  );
};
