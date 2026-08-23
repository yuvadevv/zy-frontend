'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Check } from 'lucide-react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { studentService } from '@/features/student/services/studentService';
import { academicService } from '@/features/student/services/academicService';
import { SearchableDropdown } from '@/features/student/components/SearchableDropdown';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { PageTransition } from '@/design-system/components/layout/PageTransition';

const editProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[0-9+() -]{10,20}$/, 'Invalid phone number format'),
  branchId: z.string().uuid('Please select a branch'),
  academicYearId: z.string().uuid('Please select your academic year'),
  sectionId: z.string().uuid('Please select your section'),
  block: z.string().min(1, 'Block is required'),
  classroomNumber: z.string().min(1, 'Classroom is required'),
  rollNumber: z.string().min(3, 'Roll number is required'),
  deliveryNotes: z.string().optional(),
});

type EditProfileData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, academicRecord, refreshProfile } = useStudent();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { isDirty } } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      branchId: '',
      academicYearId: '',
      sectionId: '',
      block: '',
      classroomNumber: '',
      rollNumber: '',
      deliveryNotes: '',
    },
  });

  useEffect(() => {
    if (profile && academicRecord) {
      reset({
        fullName: profile.full_name || '',
        phoneNumber: profile.phone_number || '',
        branchId: academicRecord.branch_id || '',
        academicYearId: academicRecord.academic_year_id || '',
        sectionId: academicRecord.section_id || '',
        block: academicRecord.block || '',
        classroomNumber: academicRecord.classroom_number || '',
        rollNumber: academicRecord.roll_number || '',
        deliveryNotes: profile.delivery_notes || '',
      });
    }
  }, [profile, academicRecord, reset]);

  const selectedAcademicYearId = watch('academicYearId');

  const { data: branches = [], isLoading: isLoadingBranches } = useQuery({
    queryKey: ['all_branches'],
    queryFn: academicService.getAllBranches
  });

  const { data: academicYears = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ['academicYears'],
    queryFn: academicService.getAcademicYears
  });

  const { data: sections = [], isLoading: isLoadingSections } = useQuery({
    queryKey: ['sections', selectedAcademicYearId],
    queryFn: async () => {
      if (!selectedAcademicYearId) return [];
      const sems = await academicService.getSemestersByYear(selectedAcademicYearId);
      if (sems.length > 0) {
        return academicService.getSectionsBySemester(sems[0].id);
      }
      return [];
    },
    enabled: !!selectedAcademicYearId
  });

  const onSubmit = async (data: EditProfileData) => {
    if (!profile || !academicRecord) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await studentService.updateProfile(profile.user_id, {
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        delivery_notes: data.deliveryNotes,
      });

      const sems = await academicService.getSemestersByYear(data.academicYearId);
      const semesterId = sems.length > 0 ? sems[0].id : academicRecord.semester_id;

      await studentService.updateAcademicRecord(profile.user_id, {
        branch_id: data.branchId,
        academic_year_id: data.academicYearId,
        section_id: data.sectionId,
        block: data.block,
        classroom_number: data.classroomNumber,
        roll_number: data.rollNumber.trim().toUpperCase(),
        semester_id: semesterId,
      });

      await refreshProfile();
      toast.success('Profile updated successfully');
      router.back();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      router.back();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardConfirm(false);
    router.back();
  };

  const inputClass = "w-full h-[52px] px-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all disabled:opacity-50";

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[100dvh]">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10 gap-3">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-black truncate">Edit Profile</h2>
        </div>
        <button
          type="submit"
          form="edit-profile-form"
          disabled={!isDirty || isSaving}
          className={`h-[44px] min-w-[120px] px-4 rounded-[14px] text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isDirty && !isSaving 
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.20)] active:scale-[0.97]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Student Name</label>
            <input disabled={isSaving} {...register('fullName')} className={inputClass} placeholder="Full Name" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Mobile Number</label>
            <input disabled={isSaving} {...register('phoneNumber')} className={inputClass} placeholder="Phone Number" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">College (Read Only)</label>
            <input 
              type="text"
              readOnly
              value={academicRecord?.colleges?.name || 'Ramachandra College of Engineering'}
              className={`${inputClass} bg-gray-100 cursor-not-allowed`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Branch</label>
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={branches.map(b => ({ label: b.name, value: b.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Branch"
                  searchable={true}
                  isLoading={isLoadingBranches}
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Academic Year</label>
            <Controller
              name="academicYearId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={academicYears.map(y => ({ label: y.name, value: y.id }))}
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    setValue('sectionId', '');
                  }}
                  placeholder="Select Year"
                  searchable={false}
                  isLoading={isLoadingYears}
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Section</label>
            <Controller
              name="sectionId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={sections.map(s => ({ label: s.name, value: s.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Section"
                  searchable={false}
                  isLoading={isLoadingSections}
                  disabled={!selectedAcademicYearId || isSaving}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Block</label>
            <Controller
              name="block"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={[
                    { label: 'A Block', value: 'A Block' },
                    { label: 'B Block', value: 'B Block' },
                    { label: 'C Block', value: 'C Block' },
                    { label: 'D Block', value: 'D Block' },
                    { label: 'E Block', value: 'E Block' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Block"
                  searchable={false}
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Classroom Number</label>
            <input disabled={isSaving} {...register('classroomNumber')} className={inputClass} placeholder="e.g. SH-213" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Roll Number</label>
            <input 
              disabled={isSaving}
              {...register('rollNumber', {
                onChange: (e) => e.target.value = e.target.value.toUpperCase().replace(/\s/g, '')
              })} 
              className={inputClass} 
              placeholder="e.g. 21BCE0001" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Delivery Notes (Optional)</label>
            <textarea 
              disabled={isSaving}
              {...register('deliveryNotes')} 
              className={`${inputClass} h-auto py-3 resize-none`}
              rows={3}
              placeholder="e.g. Leave near classroom door."
            />
          </div>
        </form>
      </div>



      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl">
            <h3 className="text-lg font-bold text-black">Discard your changes?</h3>
            <p className="text-sm text-gray-600">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold text-black hover:bg-gray-200"
              >
                Keep Editing
              </button>
              <button 
                onClick={confirmDiscard}
                className="flex-1 py-3 bg-red-600 rounded-xl font-semibold text-white hover:bg-red-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
