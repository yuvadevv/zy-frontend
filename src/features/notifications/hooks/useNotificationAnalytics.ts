// src/features/notifications/hooks/useNotificationAnalytics.ts
import { useCallback } from 'react';
import { NotificationCategory, NotificationPriority, NotificationActionType } from '../types';

export const useNotificationAnalytics = () => {
  const trackAction = useCallback((actionName: string, data?: Record<string, unknown>) => {
    console.log(`[Notification Analytics] ${actionName}`, data);
  }, []);

  return {
    trackNotificationOpened: (id: string, category: NotificationCategory, priority: NotificationPriority) => 
      trackAction('Notification_Opened', { id, category, priority }),
      
    trackNotificationRead: (id: string) => 
      trackAction('Notification_Read', { id }),
      
    trackNotificationDismissed: (id: string) => 
      trackAction('Notification_Dismissed', { id }),
      
    trackNotificationArchived: (id: string) => 
      trackAction('Notification_Archived', { id }),
      
    trackNotificationShared: (id: string) => 
      trackAction('Notification_Shared', { id }),
      
    trackAnnouncementOpened: (id: string) => 
      trackAction('Announcement_Opened', { id }),
      
    trackPreferencesChanged: (preferenceId: string, enabled: boolean) => 
      trackAction('Preference_Changed', { preferenceId, enabled }),
      
    trackDeepLinkOpened: (actionType: NotificationActionType, payload?: Record<string, unknown>) => 
      trackAction('DeepLink_Opened', { actionType, payload })
  };
};
