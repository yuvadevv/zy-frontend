import { authApi } from '../api/authApi';
import { formatSupabaseError } from '../../../lib/utils/supabaseErrors';
import { SignupFormData, LoginFormData } from '../validators/authValidators';
import { OnboardingStep1Data, OnboardingStep2Data } from '../validators/onboardingValidators';
import { SessionManager } from '@/utils/SessionManager';

export const authService = {
  loginWithGoogle: async (nextUrl?: string) => {
    try {
      return await authApi.signInWithGoogle(nextUrl);
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  signUpWithEmail: async (credentials: SignupFormData) => {
    try {
      return await authApi.signUpWithEmail(credentials);
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  resendVerificationEmail: async (email: string) => {
    try {
      return await authApi.resendVerificationEmail(email);
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  signInWithEmail: async (credentials: LoginFormData) => {
    try {
      return await authApi.signInWithEmail(credentials);
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  resetPassword: async (email: string) => {
    try {
      return await authApi.resetPassword(email);
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  updatePassword: async (password: string) => {
    try {
      return await authApi.updatePassword(password);
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },
  
  logout: async () => {
    try {
      return await authApi.signOut();
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  getCurrentSession: async () => {
    try {
      return await authApi.getSession();
    } catch (error) {
      throw formatSupabaseError(error);
    }
  },

  // Onboarding Transaction
  submitOnboarding: async (
    userId: string, // Kept for signature compatibility
    email: string,  // Kept for signature compatibility
    step1Data: OnboardingStep1Data,
    step2Data: OnboardingStep2Data,
    mappedSemesterId: string,
    mappedClassroomId: string
  ) => {
    try {
      if (!step1Data.fullName?.trim()) {
        throw new Error("Student name is required.");
      }
      
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(step1Data.phoneNumber)) {
        throw new Error("Mobile number must be exactly 10 digits.");
      }

      const rollRegex = /^[a-zA-Z0-9]{10}$/;
      const normalizedRoll = step2Data.rollNumber.trim().toUpperCase();
      if (!rollRegex.test(normalizedRoll)) {
        throw new Error("Roll number must be exactly 10 alphanumeric characters.");
      }

      // Synchronize directly with backend D1 via workerClient
      const { workerClient } = await import('../../../lib/api/workerClient');
      await workerClient.fetch('/api/students/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: step1Data.fullName,
          roll_number: normalizedRoll,
          phone: step1Data.phoneNumber,
          email: email,
          college_id: step2Data.collegeId,
          branch_id: step2Data.branchId,
          study_year_id: step2Data.academicYearId,
          semester_id: mappedSemesterId || step2Data.academicYearId,
          section: step2Data.sectionId || null,
          block_id: step2Data.blockId,
          classroom_id: step2Data.classroomId || mappedClassroomId
        })
      });

      // Update local session user metadata and set profile completed cookie
      try {
        if (typeof document !== 'undefined') {
          document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
        }
        const user = SessionManager.getUser();
        if (user) {
          user.user_metadata = { ...(user.user_metadata || {}), profile_completed: true, name: step1Data.fullName };
          const token = SessionManager.getToken() || '';
          SessionManager.setSession(token, user);
        }
      } catch (metaErr) {
        console.warn('Could not update session user metadata:', metaErr);
      }

      return { success: true };
    } catch (error) {
      throw formatSupabaseError(error);
    }
  }
};
