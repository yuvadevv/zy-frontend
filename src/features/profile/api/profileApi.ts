// src/features/profile/api/profileApi.ts
import { CombinedStudentData } from '../types';
import { mockStudentData } from '../services/mockProfile';

const profileCacheMap: Record<string, CombinedStudentData> = {};

const getCacheForUser = (userId: string) => {
  if (!profileCacheMap[userId]) {
    profileCacheMap[userId] = JSON.parse(JSON.stringify(mockStudentData));
  }
  return profileCacheMap[userId];
};

export const profileApi = {
  getProfile: async (userId: string): Promise<CombinedStudentData> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
    return { ...getCacheForUser(userId) };
  },

  updateProfile: async (userId: string, updates: Partial<CombinedStudentData['profile']>): Promise<CombinedStudentData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userCache = getCacheForUser(userId);
    profileCacheMap[userId] = {
      ...userCache,
      profile: { ...userCache.profile, ...updates }
    };
    return { ...profileCacheMap[userId] };
  }
};
