// src/features/profile/api/profileApi.ts
import { CombinedStudentData } from '../types';
import { mockStudentData } from '../services/mockProfile';

let profileCache = { ...mockStudentData };

export const profileApi = {
  getProfile: async (): Promise<CombinedStudentData> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
    return { ...profileCache };
  },

  updateProfile: async (updates: Partial<CombinedStudentData['profile']>): Promise<CombinedStudentData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    profileCache = {
      ...profileCache,
      profile: { ...profileCache.profile, ...updates }
    };
    return { ...profileCache };
  }
};
