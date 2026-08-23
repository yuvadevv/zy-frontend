// src/features/profile/services/profileService.ts
import { profileApi } from '../api/profileApi';

export const profileService = {
  fetchProfileData: async () => {
    return await profileApi.getProfile();
  }
};
