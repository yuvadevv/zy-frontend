// src/features/profile/services/profileService.ts
import { profileApi } from '../api/profileApi';
import { CombinedStudentData } from '../types';

export const profileService = {
  fetchProfileData: async (userId: string): Promise<CombinedStudentData> => {
    return await profileApi.getProfile(userId);
  },
};
