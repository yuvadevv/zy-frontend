'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { 
  onboardingStep2Schema, 
  OnboardingStep2Data 
} from '../../auth/validators/onboardingValidators';
import { useOnboarding } from '../providers/OnboardingProvider';
import { academicService } from '../services/academicService';
import { SearchableDropdown } from './SearchableDropdown';

export const AcademicDetailsStep = () => {
  const { step2Data, setStep2Data, setStep2ReadableData, setStep } = useOnboarding();

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<OnboardingStep2Data>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: step2Data || { classroomNumber: '' },
    mode: 'onBlur',
  });

  const selectedAcademicYearId = watch('academicYearId');

  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: academicService.getColleges
  });

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

  useEffect(() => {
    if (colleges.length > 0 && !watch('collegeId')) {
      setValue('collegeId', colleges[0].id);
    }
  }, [colleges, setValue, watch]);

  const onSubmit = (data: OnboardingStep2Data) => {
    data.rollNumber = data.rollNumber.trim().toUpperCase();
    
    // Map IDs to readable names
    const collegeName = colleges.find(c => c.id === data.collegeId)?.name || 'Ramachandra College of Engineering';
    const branchName = branches.find(b => b.id === data.branchId)?.name || '';
    const academicYearName = academicYears.find(y => y.id === data.academicYearId)?.name || '';
    const sectionName = sections.find(s => s.id === data.sectionId)?.name || '';

    setStep2Data(data);
    setStep2ReadableData({
      collegeName,
      branchName,
      academicYearName,
      sectionName
    });
    setStep(4);
  };

  const inputClass = "w-full h-[56px] px-4 rounded-2xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all";

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
          <h2 className="text-2xl font-bold text-black">Academic Info</h2>
          <p className="text-gray-500 text-sm mt-1">Help us tailor your BLINTZY experience</p>
        </div>

        <form id="academic-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">College</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                readOnly
                value="Ramachandra College of Engineering"
                className="w-full h-[56px] pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-600 outline-none cursor-not-allowed"
              />
            </div>
            {errors.collegeId && <p className="text-xs text-red-500 mt-1">{errors.collegeId.message}</p>}
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
                />
              )}
            />
            {errors.branchId && <p className="text-xs text-red-500 mt-1">{errors.branchId.message}</p>}
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
                />
              )}
            />
            {errors.academicYearId && <p className="text-xs text-red-500 mt-1">{errors.academicYearId.message}</p>}
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
                  disabled={!selectedAcademicYearId}
                />
              )}
            />
            {errors.sectionId && <p className="text-xs text-red-500 mt-1">{errors.sectionId.message}</p>}
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
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Select Block"
                  searchable={false}
                />
              )}
            />
            {errors.block && <p className="text-xs text-red-500 mt-1">{errors.block.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Classroom Number</label>
            <input 
              {...register("classroomNumber")}
              className={inputClass}
              placeholder="e.g. A-204"
            />
            {errors.classroomNumber && <p className="text-xs text-red-500 mt-1">{errors.classroomNumber.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Roll Number</label>
            <input 
              {...register("rollNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
                }
              })}
              className={inputClass}
              placeholder="e.g. 21BCE0001"
            />
            {errors.rollNumber && <p className="text-xs text-red-500 mt-1">{errors.rollNumber.message}</p>}
          </div>
        </form>
      </div>

      <div className="w-full mt-auto pt-4 pb-2 safe-area-bottom bg-white border-t border-transparent z-10 flex gap-3">
        <button 
          type="button"
          onClick={() => setStep(2)}
          className="w-1/3 bg-gray-100 text-black h-[56px] rounded-2xl font-bold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Back
        </button>
        <button 
          form="academic-form"
          type="submit"
          className="w-2/3 bg-orange-500 text-white h-[56px] rounded-2xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all"
        >
          Review
        </button>
      </div>
    </motion.div>
  );
};
