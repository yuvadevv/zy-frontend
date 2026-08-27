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
    defaultValues: step2Data || {},
    mode: 'onBlur',
  });

  const { data: options, isLoading } = useQuery({
    queryKey: ['academicOptions'],
    queryFn: academicService.getAllOptions
  });

  const selectedAcademicYearId = watch('academicYearId');
  const selectedBlockId = watch('blockId');
  const selectedCollegeId = watch('collegeId');

  useEffect(() => {
    if (options?.colleges?.length && !watch('collegeId')) {
      setValue('collegeId', options.colleges[0].id);
    }
  }, [options, setValue, watch]);

  const onSubmit = (data: OnboardingStep2Data) => {
    data.rollNumber = data.rollNumber.trim().toUpperCase();
    
    // Map IDs to readable names
    const collegeName = options?.colleges.find(c => c.id === data.collegeId)?.name || 'College';
    const branchName = options?.branches.find(b => b.id === data.branchId)?.name || '';
    const academicYearName = options?.academicYears.find(y => y.id === data.academicYearId)?.name || '';
    const sectionName = options?.sections.find(s => s.id === data.sectionId)?.name || '';
    const blockName = options?.blocks.find(b => b.id === data.blockId)?.name || '';
    const classroomName = options?.classrooms.find(c => c.id === data.classroomId)?.name || '';

    setStep2Data(data);
    setStep2ReadableData({
      collegeName,
      branchName,
      academicYearName,
      sectionName,
      blockName,
      classroomName
    });
    setStep(4);
  };

  const inputClass = "w-full h-[56px] px-4 rounded-2xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all";

  if (isLoading || !options) {
    return <div className="p-8 text-center text-gray-500">Loading academic options...</div>;
  }

  const availableSections = options.sections;

  const availableBlocks = options.blocks.filter(b => b.college_id === selectedCollegeId);
  const availableClassrooms = options.classrooms.filter(c => c.block_id === selectedBlockId);

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
            <input 
              type="text"
              readOnly
              value={options.colleges[0]?.name || 'Ramachandra College of Engineering'}
              className={`${inputClass} bg-gray-100 cursor-not-allowed`}
            />
            {/* Hidden field to keep form state valid */}
            <input type="hidden" {...register("collegeId")} value={options.colleges[0]?.id || 'COL-001'} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Branch</label>
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={options.branches.map(b => ({ label: b.name, value: b.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Branch"
                  searchable={true}
                  isLoading={isLoading}
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
                  options={options.academicYears.map(y => ({ label: y.name, value: y.id }))}
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    setValue('sectionId', '');
                  }}
                  placeholder="Select Year"
                  searchable={false}
                  isLoading={isLoading}
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
                  options={availableSections.map(s => ({ label: s.name, value: s.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Section"
                  searchable={false}
                  disabled={!selectedAcademicYearId}
                />
              )}
            />
            {errors.sectionId && <p className="text-xs text-red-500 mt-1">{errors.sectionId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Block</label>
            <Controller
              name="blockId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={availableBlocks.map(b => ({ label: b.name, value: b.id }))}
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    setValue('classroomId', '');
                  }}
                  placeholder="Select Block"
                  searchable={true}
                  disabled={!selectedCollegeId}
                />
              )}
            />
            {errors.blockId && <p className="text-xs text-red-500 mt-1">{errors.blockId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Classroom</label>
            <Controller
              name="classroomId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={availableClassrooms.map(c => ({ label: c.name, value: c.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Classroom"
                  searchable={true}
                  disabled={!selectedBlockId}
                />
              )}
            />
            {errors.classroomId && <p className="text-xs text-red-500 mt-1">{errors.classroomId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Roll Number</label>
            <input 
              maxLength={10}
              {...register("rollNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                }
              })}
              className={inputClass}
              placeholder="e.g. 25ME1A4244"
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
