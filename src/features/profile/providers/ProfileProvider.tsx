// src/features/profile/providers/ProfileProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CombinedStudentData } from '../types';
import { profileService } from '../services/profileService';
import { useProfileAnalytics } from '../hooks/useProfileAnalytics';

interface ProfileContextProps {
  data: CombinedStudentData | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CombinedStudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { trackProfileOpened } = useProfileAnalytics();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await profileService.fetchProfileData();
      setData(res);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => {
        fetchProfile();
        trackProfileOpened();
      }, 0);
    }
    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ProfileContext.Provider value={{ data, isLoading, error, refresh: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfileContext must be used within ProfileProvider');
  return context;
};
