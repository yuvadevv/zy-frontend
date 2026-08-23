// src/features/profile/hooks/useProfile.ts
import { useStudent } from '@/features/student/providers/StudentProvider';
import { StudentProfile, AcademicProfile } from '../types';

export const useProfile = () => {
  const { profile: studentProfile, academicRecord, isLoading, refreshProfile } = useStudent();

  const profile: StudentProfile | undefined = studentProfile ? {
    id: studentProfile.user_id,
    name: studentProfile.full_name,
    avatarUrl: studentProfile.avatar_path || undefined,
    mobile: studentProfile.phone_number,
    email: studentProfile.email,
    isEmailVerified: true, // We can assume verified if they logged in
    isMobileVerified: true
  } : undefined;

  const academic: AcademicProfile | undefined = academicRecord ? {
    collegeId: academicRecord.college_id,
    collegeName: academicRecord.colleges?.name || 'Ramachandra College of Engineering',
    campusId: 'campus-1',
    campusName: 'Main Campus',
    departmentId: academicRecord.department_id,
    departmentName: '', // Optional, or fetch
    branchId: academicRecord.branch_id,
    branchName: academicRecord.branches?.name || '',
    year: parseInt(academicRecord.academic_years?.name?.replace(/[^0-9]/g, '') || '1') || 1,
    semester: 1, // Optional, or fetch
    section: academicRecord.sections?.name || '',
    rollNumber: academicRecord.roll_number,
    classroomNumber: academicRecord.classroom_number
  } as any : undefined; // using as any to allow classroomNumber for now

  return { 
    profile, 
    academic, 
    isLoading, 
    error: null,
    refresh: refreshProfile
  };
};
