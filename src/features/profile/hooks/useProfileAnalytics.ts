// src/features/profile/hooks/useProfileAnalytics.ts
import { useCallback } from 'react';

export const useProfileAnalytics = () => {
  const trackAction = useCallback((actionName: string, data?: Record<string, unknown>) => {
    console.log(`[Profile Analytics] ${actionName}`, data);
  }, []);

  return {
    trackProfileOpened: () => trackAction('Profile_Opened'),
    trackProfileEdited: (fields: string[]) => trackAction('Profile_Edited', { fields }),
    trackSettingsUpdated: (setting: string) => trackAction('Settings_Updated', { setting }),
    trackSupportOpened: (type: string) => trackAction('Support_Opened', { type }),
    trackLogout: () => trackAction('User_Logout')
  };
};
