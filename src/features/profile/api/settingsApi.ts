// src/features/profile/api/settingsApi.ts
import { DeliveryPreference } from '../types';
import { mockStudentData } from '../services/mockProfile';

let deliveryCache = { ...mockStudentData.delivery };

export const settingsApi = {
  getDeliveryPreferences: async (): Promise<DeliveryPreference> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...deliveryCache };
  },

  updateDeliveryPreferences: async (updates: DeliveryPreference): Promise<DeliveryPreference> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    deliveryCache = { ...updates };
    return { ...deliveryCache };
  }
};
