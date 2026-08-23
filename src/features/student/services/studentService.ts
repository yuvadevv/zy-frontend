import { createClient } from '../../../lib/supabase/client';
import { StudentProfile, StudentAcademicRecord } from '../types';

export const studentService = {
  getProfile: async (userId: string): Promise<StudentProfile | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data;
  },

  getAcademicRecord: async (userId: string): Promise<StudentAcademicRecord | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_academic_records')
      .select(`
        *,
        colleges (id, name),
        branches (id, name),
        academic_years (id, name),
        sections (id, name)
      `)
      .eq('student_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data;
  },
  
  updateProfile: async (userId: string, updates: Partial<StudentProfile>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  updateAcademicRecord: async (userId: string, updates: Partial<StudentAcademicRecord>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_academic_records')
      .update(updates)
      .eq('student_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('student-profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('student-profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
