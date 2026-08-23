import { createClient } from '../../../lib/supabase/client';
import { College, Department, Branch, AcademicYear, Semester, Section } from '../types';

export const academicService = {
  getColleges: async (): Promise<College[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('colleges').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  getDepartmentsByCollege: async (collegeId: string): Promise<Department[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('departments').select('*').eq('college_id', collegeId).order('name');
    if (error) throw error;
    return data || [];
  },

  getBranchesByDepartment: async (departmentId: string): Promise<Branch[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('branches').select('*').eq('department_id', departmentId).order('name');
    if (error) throw error;
    return data || [];
  },

  getAllBranches: async (): Promise<Branch[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('branches').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('academic_years').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  getSemestersByYear: async (academicYearId: string): Promise<Semester[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('semesters').select('*').eq('academic_year_id', academicYearId).order('name');
    if (error) throw error;
    return data || [];
  },

  getSectionsBySemester: async (semesterId: string): Promise<Section[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('sections').select('*').eq('semester_id', semesterId).order('name');
    if (error) throw error;
    return data || [];
  }
};
