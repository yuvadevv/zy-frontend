'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useOnboarding } from '@/features/student/providers/OnboardingProvider';
import { ProgressStepper } from '@/features/student/components/ProgressStepper';
import { WelcomeCard } from '@/features/student/components/WelcomeCard';
import { PersonalDetailsStep } from '@/features/student/components/PersonalDetailsStep';
import { AcademicDetailsStep } from '@/features/student/components/AcademicDetailsStep';
import { ReviewStep } from '@/features/student/components/ReviewStep';
import { SuccessStep } from '@/features/student/components/SuccessStep';

export default function OnboardingWizard() {
  const { user } = useAuthSession();
  const { step, setStep } = useOnboarding();

  const STEPS = ['Personal', 'Academic', 'Review'];

  return (
    <div className="h-screen w-full bg-white flex flex-col pt-safe px-4 overflow-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col h-full pt-4 relative">
        {step > 1 && step < 5 && (
          <div className="shrink-0 mb-6">
            <ProgressStepper steps={STEPS} currentStep={step} />
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <WelcomeCard 
                key="step1" 
                userName={user?.user_metadata?.full_name || user?.email} 
                onContinue={() => setStep(2)} 
              />
            )}
            
            {step === 2 && <PersonalDetailsStep key="step2" />}
            
            {step === 3 && <AcademicDetailsStep key="step3" />}
            
            {step === 4 && <ReviewStep key="step4" />}
            
            {step === 5 && <SuccessStep key="step5" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
