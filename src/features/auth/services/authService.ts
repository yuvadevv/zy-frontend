import { authApi } from '../api/authApi';
import { formatSupabaseError } from '../../../lib/utils/supabaseErrors';
import { SignupFormData, LoginFormData } from '../validators/authValidators';
import { OnboardingStep1Data, OnboardingStep2Data } from '../validators/onboardingValidators';
import { createClient } from '../../../lib/supabase/client';

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
    userId: string,
    email: string,
    step1Data: OnboardingStep1Data,
    step2Data: OnboardingStep2Data,
    mappedSemesterId: string,
    mappedClassroomId: string
  ) => {
    const supabase = createClient();
    try {
      // 1. Upsert into student_profiles (handles duplicate key error if they try again)
      const { error: profileError } = await supabase.from('student_profiles').upsert({
        user_id: userId,
        full_name: step1Data.fullName,
        search_name: step1Data.fullName.toLowerCase(),
        email: email,
        phone_number: step1Data.phoneNumber,
        avatar_path: step1Data.avatarPath || null,
        profile_completed: true,
        profile_completion_percentage: 100,
      }, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      // Ensure we have a department_id. Since UI doesn't ask for it, we must fetch it from the selected branch
      let deptId = step2Data.departmentId;
      if (!deptId) {
        const { data: branchData, error: branchErr } = await supabase
          .from('branches')
          .select('department_id')
          .eq('id', step2Data.branchId)
          .single();
        
        if (branchErr) throw branchErr;
        deptId = branchData.department_id;
      }

      // Fetch the actual semester_id based on academic_year_id
      const { data: semData, error: semErr } = await supabase
        .from('semesters')
        .select('id')
        .eq('academic_year_id', step2Data.academicYearId)
        .limit(1)
        .single();
        
      if (semErr) throw new Error("Could not find a valid semester for this academic year. Please contact support.");
      
      const actualSemesterId = semData.id;

      // First, let's check if an academic record already exists to avoid duplicates
      const { data: existingRecord } = await supabase
        .from('student_academic_records')
        .select('id')
        .eq('student_id', userId)
        .single();

      const academicPayload = {
        student_id: userId,
        roll_number: step2Data.rollNumber,
        college_id: step2Data.collegeId,
        department_id: deptId,
        branch_id: step2Data.branchId,
        academic_year_id: step2Data.academicYearId,
        semester_id: actualSemesterId,
        section_id: step2Data.sectionId,
        block: step2Data.block,
        classroom_number: step2Data.classroomNumber,
      };

      if (existingRecord) {
        const { error: academicUpdateError } = await supabase
          .from('student_academic_records')
          .update(academicPayload)
          .eq('id', existingRecord.id);
        if (academicUpdateError) throw academicUpdateError;
      } else {
        const { error: academicInsertError } = await supabase
          .from('student_academic_records')
          .insert(academicPayload);
        if (academicInsertError) throw academicInsertError;
      }

      // 3. Synchronize with D1 via Cloudflare Worker
      try {
        const { workerClient } = await import('../../../lib/api/workerClient');
        await workerClient.fetch('/api/students/me', {
          method: 'PUT',
          body: JSON.stringify({
            name: step1Data.fullName,
            roll_number: step2Data.rollNumber,
            phone: step1Data.phoneNumber,
            email: email,
            college_id: step2Data.collegeId,
            branch_id: step2Data.branchId,
            study_year_id: step2Data.academicYearId,
            semester_id: actualSemesterId,
            section: step2Data.sectionId || null
          })
        });
      } catch (workerError) {
        // We log the error but DO NOT throw it, so the user doesn't lose their successful Supabase onboarding
        console.error('Failed to synchronize profile to D1 backend:', workerError);
      }

      return { success: true };
    } catch (error) {
      throw formatSupabaseError(error);
    }
  }
};
