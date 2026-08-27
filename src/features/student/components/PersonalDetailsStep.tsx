'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  onboardingStep1Schema, 
  OnboardingStep1Data 
} from '../../auth/validators/onboardingValidators';
import { useOnboarding } from '../providers/OnboardingProvider';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export const PersonalDetailsStep = () => {
  const { step1Data, setStep1Data, setStep } = useOnboarding();
  const { user } = useAuthSession();
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const { register, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: step1Data || {},
    mode: 'onBlur',
  });

  useEffect(() => {
    if (user) {
      const provider = user.app_metadata?.provider;
      const isGoogle = provider === 'google';
      setIsGoogleUser(isGoogle);

      if (isGoogle && !step1Data?.fullName) {
        const metadata = user.user_metadata || {};
        const googleName = metadata.full_name || metadata.name || (metadata.first_name ? `${metadata.first_name} ${metadata.last_name || ''}`.trim() : '');
        if (googleName) {
          setValue('fullName', googleName, { shouldValidate: true });
        }
        
        const googlePhone = metadata.phone || metadata.phone_number;
        if (googlePhone && /^\d{10}$/.test(googlePhone) && !step1Data?.phoneNumber) {
          setValue('phoneNumber', googlePhone, { shouldValidate: true });
        }
      }
    }
  }, [user, setValue, step1Data]);

  useEffect(() => {
    // Auto-focus first input on mount if not read-only
    if (!isGoogleUser) {
      setFocus('fullName');
    } else {
      setFocus('phoneNumber');
    }
  }, [setFocus, isGoogleUser]);

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
            <label className="text-sm font-semibold text-black flex justify-between">
              Student Name
              {isGoogleUser && <span className="text-xs text-gray-500 font-normal">Name from your Google account</span>}
            </label>
            <input 
              {...register("fullName")}
              className={`${inputClass} ${isGoogleUser ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="e.g. John Doe"
              readOnly={isGoogleUser}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black flex justify-between">
              Mobile Number
              {!isGoogleUser && <span className="text-xs text-gray-500 font-normal">Enter your 10-digit mobile number.</span>}
            </label>
            <input 
              type="tel"
              inputMode="numeric"
              maxLength={10}
              {...register("phoneNumber", {
                maxLength: 10,
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }
              })}
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
