// src/features/notifications/hooks/useNotifications.ts
import { useNotifications as useGlobalNotifications } from '../providers/NotificationProvider';

export const useNotifications = () => {
  return useGlobalNotifications();
};
