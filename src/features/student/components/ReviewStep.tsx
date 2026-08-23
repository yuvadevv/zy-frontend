'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Edit2 } from 'lucide-react';
import { useOnboarding } from '../providers/OnboardingProvider';
import { authService } from '@/features/auth/services/authService';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useStudent } from '../providers/StudentProvider';

export const ReviewStep = () => {
  const { user } = useAuthSession();
  const { step1Data, step2Data, step2ReadableData, setStep } = useOnboarding();
  const { refreshProfile } = useStudent();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalizeOnboarding = async () => {
    if (!step1Data || !step2Data) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const mappedSemesterId = "00000000-0000-0000-0000-000000000001"; // Mock or resolve from backend
      
      if (user) {
        await authService.submitOnboarding(
          user.id,
          user.email || '',
          step1Data,
          step2Data,
          mappedSemesterId,
          "" // Empty string or omit, since classroom_id is gone. But submitOnboarding still takes mappedClassroomId as a parameter right now? Wait, I didn't remove the param from submitOnboarding, I just ignored it. Let me pass "" to avoid issues.
        );
        await refreshProfile();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setStep(5); // Success step
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const CardRow = ({ label, value }: { label: string, value?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-black max-w-[60%] text-right truncate" title={value}>{value || '-'}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto pt-6 px-1 pb-24 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black">Review & Confirm</h2>
          <p className="text-gray-500 text-sm mt-1">Please verify your information</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Personal Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-black text-sm">Personal Information</h3>
            <button 
              onClick={() => setStep(2)}
              disabled={isLoading}
              className="text-orange-500 p-1 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <CardRow label="Student Name" value={step1Data?.fullName} />
            <CardRow label="Mobile Number" value={step1Data?.phoneNumber} />
          </div>
        </div>

        {/* Academic Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-black text-sm">Academic Information</h3>
            <button 
              onClick={() => setStep(3)}
              disabled={isLoading}
              className="text-orange-500 p-1 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <CardRow label="College" value={step2ReadableData?.collegeName} />
            <CardRow label="Branch" value={step2ReadableData?.branchName} />
            <CardRow label="Academic Year" value={step2ReadableData?.academicYearName} />
            <CardRow label="Section" value={step2ReadableData?.sectionName} />
            <CardRow label="Block" value={step2Data?.block} />
            <CardRow label="Classroom" value={step2Data?.classroomNumber} />
            <CardRow label="Roll Number" value={step2Data?.rollNumber} />
          </div>
        </div>

      </div>

      <div className="w-full mt-auto pt-4 pb-2 safe-area-bottom bg-white border-t border-transparent z-10 flex gap-3">
        <button 
          onClick={() => setStep(3)}
          disabled={isLoading}
          className="w-1/3 bg-gray-100 text-black h-[56px] rounded-2xl font-bold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button 
          onClick={finalizeOnboarding}
          disabled={isLoading}
          className="w-2/3 bg-orange-500 text-white h-[56px] rounded-2xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : "Create Account"}
        </button>
      </div>
    </motion.div>
  );
};
