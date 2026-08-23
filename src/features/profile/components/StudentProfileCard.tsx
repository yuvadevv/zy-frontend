// src/features/profile/components/StudentProfileCard.tsx
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { ProfileAvatar } from './ProfileAvatar';
import { Edit2, BadgeCheck } from 'lucide-react';

import { useRouter } from 'next/navigation';

export const StudentProfileCard = () => {
  const { profile } = useProfile();
  const router = useRouter();

  if (!profile) return null;

  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary/20 to-primary/5" />
      
      <div className="relative flex justify-between items-start pt-2">
        <ProfileAvatar name={profile.name} size="lg" />
        <button 
          onClick={() => router.push('/app/profile/edit')}
          className="p-2 bg-background/80 backdrop-blur rounded-full text-primary hover:bg-muted transition-colors border border-border shadow-sm"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          {profile.name}
          <BadgeCheck className="w-5 h-5 text-blue-500" />
        </h2>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{profile.id}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center py-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Mobile</span>
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            +91 {profile.mobile}
            {profile.isMobileVerified && <BadgeCheck className="w-4 h-4 text-green-500" />}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            {profile.email}
            {profile.isEmailVerified && <BadgeCheck className="w-4 h-4 text-green-500" />}
          </span>
        </div>
      </div>
    </div>
  );
};
