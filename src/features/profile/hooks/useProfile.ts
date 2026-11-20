'use client';

import { useStudent } from '@/features/student/providers/StudentProvider';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { StudentProfile, AcademicProfile } from '../types';

export const useProfile = () => {
  const { profile: studentProfile, academicRecord, isLoading, refreshProfile } = useStudent();
  const { user } = useAuthSession();

  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const googleName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.name || '';
  const googleEmail = user?.email || '';

  const profile: StudentProfile | undefined = (studentProfile || user) ? {
    id: studentProfile?.user_id || user?.id || '',
    name: studentProfile?.full_name || googleName || 'Student',
    avatarUrl: studentProfile?.avatar_path || googleAvatar || undefined,
    mobile: studentProfile?.phone_number || user?.user_metadata?.phone || '',
    email: studentProfile?.email || googleEmail,
    isEmailVerified: true,
    isMobileVerified: Boolean(studentProfile?.phone_number || user?.user_metadata?.phone)
  } : undefined;

  const academic: AcademicProfile | undefined = academicRecord ? {
    collegeId: academicRecord.college_id,
    collegeName: academicRecord.colleges?.name || 'Ramachandra College of Engineering',
    campusId: 'campus-1',
    campusName: 'Main Campus',
    departmentId: academicRecord.department_id,
    departmentName: '',
    branchId: academicRecord.branch_id,
    branchName: academicRecord.branches?.name || '',
    year: parseInt(academicRecord.academic_years?.name?.replace(/[^0-9]/g, '') || '1') || 1,
    semester: 1,
    section: academicRecord.sections?.name || '',
    rollNumber: academicRecord.roll_number,
    classroomNumber: academicRecord.classroom_id
  } as any : undefined;

  return { 
    profile, 
    academic, 
    isLoading, 
    error: null,
    refresh: refreshProfile
  };
};
