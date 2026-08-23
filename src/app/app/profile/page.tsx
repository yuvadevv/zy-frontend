"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { authService } from '@/features/auth/services/authService';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { StudentProfileCard } from '@/features/profile/components/StudentProfileCard';
import { AcademicInformationCard } from '@/features/profile/components/AcademicInformationCard';
import { DeliveryPreferencesCard } from '@/features/profile/components/DeliveryPreferencesCard';
import { NotificationSettingsCard } from '@/features/profile/components/NotificationSettingsCard';
import { PrivacySecurityCard } from '@/features/profile/components/PrivacySecurityCard';
import { HelpSupportCard } from '@/features/profile/components/HelpSupportCard';
import { AboutAppCard } from '@/features/profile/components/AboutAppCard';
import { ProfileSkeleton } from '@/features/profile/components/ProfileSkeleton';
import { useProfile } from '@/features/profile/hooks/useProfile';

export default function ProfilePage() {
  const { isLoading } = useProfile();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-muted/10 min-h-[100dvh]">
      <ProfileHeader />
      
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="p-4 flex flex-col pb-24 overflow-y-auto">
          <StudentProfileCard />
          <div className="mt-4" />
          <AcademicInformationCard />
          <DeliveryPreferencesCard />
          <NotificationSettingsCard />
          <PrivacySecurityCard />
          <HelpSupportCard />
          <AboutAppCard />
          <div className="mt-8 mb-4 px-2">
            {!showLogoutConfirm ? (
              <Button 
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </Button>
            ) : (
              <div className="flex flex-col gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <span className="text-sm font-bold text-red-700 text-center">Are you sure you want to log out?</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    disabled={isLoggingOut}
                    className="flex-1 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl flex justify-center items-center gap-2"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
