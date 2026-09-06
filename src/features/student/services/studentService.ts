import { workerClient } from '../../../lib/api/workerClient';
import { StudentProfile, StudentAcademicRecord } from '../types';

export const studentService = {
  getProfile: async (userId: string): Promise<StudentProfile | null> => {
    try {
      const data = await workerClient.fetch('/api/students/me');
      if (!data?.student) return null;
      if (typeof document !== 'undefined') {
        document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
      }
      const s = data.student;
      return {
        user_id: s.id || userId,
        full_name: s.name || '',
        search_name: (s.name || '').toLowerCase(),
        email: s.email || '',
        phone_number: s.phone || '',
        avatar_path: null,
        profile_completed: true,
        profile_completion_percentage: 100,
        delivery_notes: s.delivery_notes || '',
        created_at: s.created_at,
        updated_at: s.updated_at,
      };
    } catch (error: any) {
      return null;
    }
  },

  getAcademicRecord: async (userId: string): Promise<StudentAcademicRecord | null> => {
    try {
      const data = await workerClient.fetch('/api/students/me');
      if (!data?.student) return null;
      const s = data.student;
      return {
        student_id: s.id || userId,
        roll_number: s.roll_number || '',
        college_id: s.college_id || '',
        department_id: s.department_id || '',
        branch_id: s.branch_id || '',
        academic_year_id: s.study_year_id || s.year || '',
        semester_id: s.semester_id || s.semester || '',
        section_id: s.section || '',
        colleges: s.college_name ? { id: s.college_id, name: s.college_name } : undefined,
        branches: s.branch_name ? { id: s.branch_id, department_id: '', name: s.branch_name } : undefined,
        academic_years: s.year_label ? { id: s.year, name: s.year_label } : undefined,
        sections: s.section ? { id: s.section, semester_id: '', name: s.section_name || s.section } : undefined,
      };
    } catch (error: any) {
      return null;
    }
  },
  
  updateProfile: async (userId: string, updates: Partial<StudentProfile>) => {
    const data = await workerClient.fetch('/api/students/me', {
      method: 'PUT',
      body: JSON.stringify({
        name: updates.full_name,
        phone: updates.phone_number,
        email: updates.email
      })
    });
    return data?.student;
  },

  updateAcademicRecord: async (userId: string, updates: Partial<StudentAcademicRecord>) => {
    const data = await workerClient.fetch('/api/students/me', {
      method: 'PUT',
      body: JSON.stringify({
        roll_number: updates.roll_number,
        college_id: updates.college_id,
        branch_id: updates.branch_id,
        study_year_id: updates.academic_year_id,
        semester_id: updates.semester_id,
        section: updates.section_id
      })
    });
    return data?.student;
  },

  uploadAvatar: async (_userId: string, file: File): Promise<string> => {
    return URL.createObjectURL(file);
  }
};
