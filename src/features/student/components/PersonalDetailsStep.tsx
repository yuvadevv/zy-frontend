'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  onboardingStep1Schema, 
  OnboardingStep1Data 
} from '../../auth/validators/onboardingValidators';
import { useOnboarding } from '../providers/OnboardingProvider';

export const PersonalDetailsStep = () => {
  const { step1Data, setStep1Data, setStep } = useOnboarding();

  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: step1Data || {},
    mode: 'onBlur',
  });

  useEffect(() => {
    // Auto-focus first input on mount
    setFocus('fullName');
  }, [setFocus]);

  const onSubmit = (data: OnboardingStep1Data) => {
    setStep1Data(data);
    setStep(3); // Go to Academic info
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
      <div className="flex-1 overflow-y-auto pt-4 px-1 pb-16 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black">Personal Details</h2>
          <p className="text-gray-500 text-sm mt-1">Tell us a bit about yourself</p>
        </div>

        <form id="personal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Student Name</label>
            <input 
              {...register("fullName")}
              className={inputClass}
              placeholder="e.g. John Doe"
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black">Mobile Number</label>
            <input 
              type="tel"
              {...register("phoneNumber")}
              className={inputClass}
              placeholder="e.g. 9876543210"
            />
            {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
          </div>
        </form>
      </div>

      <div className="w-full mt-auto pt-4 pb-2 safe-area-bottom bg-white border-t border-transparent z-10 flex gap-3">
        <button 
          type="button"
          onClick={() => setStep(1)}
          className="w-1/3 bg-gray-100 text-black h-[56px] rounded-2xl font-bold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Back
        </button>
        <button 
          form="personal-form"
          type="submit"
          className="w-2/3 bg-orange-500 text-white h-[56px] rounded-2xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};
