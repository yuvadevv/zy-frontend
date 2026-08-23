export interface StudentProfile {
  user_id: string;
  full_name: string;
  search_name: string;
  email: string;
  phone_number: string;
  avatar_path: string | null;
  profile_completed: boolean;
  profile_completion_percentage: number;
  delivery_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentAcademicRecord {
  student_id: string;
  roll_number: string;
  admission_year?: string;
  college_id: string;
  department_id: string;
  branch_id: string;
  academic_year_id: string;
  semester_id: string;
  section_id: string;
  block?: string;
  classroom_number?: string;
  created_at?: string;
  updated_at?: string;
  
  // Joined Relations for readable names
  colleges?: College;
  branches?: Branch;
  academic_years?: AcademicYear;
  sections?: Section;
}

// Master data types for the dropdowns
export interface AcademicEntity {
  id: string;
  name: string;
  code?: string;
  created_at?: string;
}

export interface College extends AcademicEntity {}
export interface Department extends AcademicEntity {
  college_id: string;
}
export interface Branch extends AcademicEntity {
  department_id: string;
}
export interface AcademicYear extends AcademicEntity {}
export interface Semester extends AcademicEntity {
  academic_year_id: string;
}
export interface Section extends AcademicEntity {
  semester_id: string;
}
