'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { StudentProfile, StudentAcademicRecord } from '../types';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import { studentService } from '../services/studentService';
import { AcademicProfileModal } from '../components/AcademicProfileModal';

interface StudentContextType {
  profile: StudentProfile | null;
  academicRecord: StudentAcademicRecord | null;
  isLoading: boolean;
  isProfileCompleted: boolean;
  isAcademicModalOpen: boolean;
  openAcademicModal: (onSuccess?: () => void) => void;
  closeAcademicModal: () => void;
  refreshProfile: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType>({
  profile: null,
  academicRecord: null,
  isLoading: true,
  isProfileCompleted: false,
  isAcademicModalOpen: false,
  openAcademicModal: () => {},
  closeAcademicModal: () => {},
  refreshProfile: async () => {},
});

export const StudentProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: authLoading } = useAuthSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [academicRecord, setAcademicRecord] = useState<StudentAcademicRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Global Academic Profile Modal state
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const modalSuccessCallbackRef = useRef<(() => void) | null>(null);

  const fetchStudentData = useCallback(async () => {
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
      console.error('Error fetching student data:', error.message || error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchStudentData();
    }
  }, [authLoading, fetchStudentData]);

  // Strict profile completion calculation: all required academic fields must exist
  const isProfileCompleted = Boolean(
    profile?.profile_completed &&
    academicRecord?.roll_number?.trim() &&
    academicRecord?.branch_id &&
    academicRecord?.academic_year_id &&
    academicRecord?.section_id &&
    academicRecord?.block_id &&
    (academicRecord?.classroom_id || academicRecord?.classrooms?.name)
  );

  const openAcademicModal = useCallback((onSuccess?: () => void) => {
    modalSuccessCallbackRef.current = onSuccess || null;
    setIsAcademicModalOpen(true);
  }, []);

  const closeAcademicModal = useCallback(() => {
    setIsAcademicModalOpen(false);
  }, []);

  const handleModalSuccess = useCallback(async () => {
    await fetchStudentData();
    if (modalSuccessCallbackRef.current) {
      const cb = modalSuccessCallbackRef.current;
      modalSuccessCallbackRef.current = null;
      cb();
    }
  }, [fetchStudentData]);

  return (
    <StudentContext.Provider
      value={{
        profile,
        academicRecord,
        isLoading: isLoading || authLoading,
        isProfileCompleted,
        isAcademicModalOpen,
        openAcademicModal,
        closeAcademicModal,
        refreshProfile: fetchStudentData
      }}
    >
      {children}
      <AcademicProfileModal
        isOpen={isAcademicModalOpen}
        onClose={closeAcademicModal}
        onSuccess={handleModalSuccess}
      />
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
