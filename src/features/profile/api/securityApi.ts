// src/features/profile/api/securityApi.ts
import { SecuritySettings } from '../types';
import { mockStudentData } from '../services/mockProfile';

let securityCache = { ...mockStudentData.security };

export const securityApi = {
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...securityCache };
  },

  logoutDevice: async (deviceId: string): Promise<SecuritySettings> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    securityCache = {
      ...securityCache,
      connectedDevices: securityCache.connectedDevices.filter(d => d.id !== deviceId)
    };
    return { ...securityCache };
  },

  logoutAllDevices: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Clear session entirely
  }
};
