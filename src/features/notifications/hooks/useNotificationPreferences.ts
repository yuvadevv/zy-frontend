// src/features/notifications/hooks/useNotificationPreferences.ts
import { useState, useEffect } from 'react';
import { NotificationPreference, NotificationPreferenceType } from '../types';
import { preferencesApi } from '../api/preferencesApi';
import { useNotificationAnalytics } from './useNotificationAnalytics';

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { trackPreferencesChanged } = useNotificationAnalytics();

  useEffect(() => {
    let mounted = true;
    const fetchPref = async () => {
      try {
        const data = await preferencesApi.getPreferences();
        if (mounted) setPreferences(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchPref();
    return () => { mounted = false; };
  }, []);

  const togglePreference = async (id: NotificationPreferenceType, enabled: boolean) => {
    // Optimistic update
    setPreferences(prev => prev.map(p => p.id === id ? { ...p, enabled } : p));
    trackPreferencesChanged(id, enabled);

    try {
      await preferencesApi.updatePreference(id, enabled);
    } catch (err) {
      // Revert on error
      const data = await preferencesApi.getPreferences();
      setPreferences(data);
    }
  };

  return { preferences, isLoading, error, togglePreference };
};
