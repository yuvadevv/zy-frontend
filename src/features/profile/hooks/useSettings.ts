// src/features/profile/hooks/useSettings.ts
import { useState, useEffect } from 'react';
import { DeliveryPreference } from '../types';
import { settingsApi } from '../api/settingsApi';

export const useSettings = () => {
  const [deliveryPref, setDeliveryPref] = useState<DeliveryPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await settingsApi.getDeliveryPreferences();
        if (mounted) setDeliveryPref(res);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return { deliveryPref, isLoading };
};
