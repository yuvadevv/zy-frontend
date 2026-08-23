// src/features/notifications/api/preferencesApi.ts
import { NotificationPreference, NotificationPreferenceType } from '../types';
import { mockPreferences } from '../services/mockNotifications';

const preferencesCache = [...mockPreferences];

export const preferencesApi = {
  getPreferences: async (): Promise<NotificationPreference[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...preferencesCache];
  },

  updatePreference: async (id: NotificationPreferenceType, enabled: boolean): Promise<NotificationPreference> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = preferencesCache.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Preference not found');
    
    if (preferencesCache[index].isSystemMandatory) {
      throw new Error('Cannot modify system mandatory preferences');
    }

    preferencesCache[index] = { ...preferencesCache[index], enabled };
    return preferencesCache[index];
  }
};
