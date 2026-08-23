'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentProfile, StudentAcademicRecord } from '../types';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import { studentService } from '../services/studentService';

interface StudentContextType {
  profile: StudentProfile | null;
  academicRecord: StudentAcademicRecord | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType>({
  profile: null,
  academicRecord: null,
  isLoading: true,
  refreshProfile: async () => {},
});

export const StudentProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: authLoading } = useAuthSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [academicRecord, setAcademicRecord] = useState<StudentAcademicRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentData = async () => {
    if (!user) {
      setProfile(null);
      setAcademicRecord(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [fetchedProfile, fetchedRecord] = await Promise.all([
        studentService.getProfile(user.id),
        studentService.getAcademicRecord(user.id)
      ]);
      setProfile(fetchedProfile);
      setAcademicRecord(fetchedRecord);
    } catch (error: any) {
      console.error('Error fetching student data:', error.message || error, JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchStudentData();
    }
  }, [user, authLoading]);

  return (
    <StudentContext.Provider value={{ profile, academicRecord, isLoading: isLoading || authLoading, refreshProfile: fetchStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
