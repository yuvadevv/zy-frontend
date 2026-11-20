'use client';

import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { ProfileAvatar } from './ProfileAvatar';
import { Edit2, BadgeCheck } from 'lucide-react';

export const StudentProfileCard = () => {
  const { profile } = useProfile();
  const { openAcademicModal } = useStudent();

  if (!profile) return null;

  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-3xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-orange-500/20 to-orange-500/5" />
      
      <div className="relative flex justify-between items-start pt-2">
        <ProfileAvatar name={profile.name} avatarUrl={profile.avatarUrl} size="lg" />
        <button 
          onClick={() => openAcademicModal()}
          className="p-2.5 bg-white/90 backdrop-blur rounded-full text-[#FF6B00] hover:bg-orange-50 transition-colors border border-orange-100 shadow-sm"
          title="Edit Profile"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          {profile.name}
          <BadgeCheck className="w-5 h-5 text-blue-500" />
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center py-2.5 border-t border-gray-100 text-xs">
          <span className="font-bold text-gray-400 uppercase tracking-wider">Mobile</span>
          <span className="font-extrabold text-gray-900 flex items-center gap-2 font-mono">
            {profile.mobile ? `+91 ${profile.mobile}` : 'Not configured'}
            {profile.mobile && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
          </span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-t border-gray-100 text-xs">
          <span className="font-bold text-gray-400 uppercase tracking-wider">Email</span>
          <span className="font-extrabold text-gray-900 flex items-center gap-2">
            {profile.email}
            {profile.isEmailVerified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
          </span>
        </div>
      </div>
    </div>
  );
};
