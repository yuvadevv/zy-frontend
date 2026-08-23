'use client';

import React, { createContext, useContext, useState } from 'react';
import { OnboardingStep1Data, OnboardingStep2Data } from '../../auth/validators/onboardingValidators';

export interface Step2ReadableData {
  collegeName: string;
  branchName: string;
  academicYearName: string;
  sectionName: string;
}

interface OnboardingContextType {
  step: number;
  setStep: (step: number) => void;
  step1Data: OnboardingStep1Data | null;
  setStep1Data: (data: OnboardingStep1Data) => void;
  step2Data: OnboardingStep2Data | null;
  setStep2Data: (data: OnboardingStep2Data) => void;
  step2ReadableData: Step2ReadableData | null;
  setStep2ReadableData: (data: Step2ReadableData) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  step: 1,
  setStep: () => {},
  step1Data: null,
  setStep1Data: () => {},
  step2Data: null,
  setStep2Data: () => {},
  step2ReadableData: null,
  setStep2ReadableData: () => {},
  resetOnboarding: () => {},
});

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<OnboardingStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<OnboardingStep2Data | null>(null);
  const [step2ReadableData, setStep2ReadableData] = useState<Step2ReadableData | null>(null);

  const resetOnboarding = () => {
    setStep(1);
    setStep1Data(null);
    setStep2Data(null);
    setStep2ReadableData(null);
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        step, setStep, 
        step1Data, setStep1Data, 
        step2Data, setStep2Data, 
        step2ReadableData, setStep2ReadableData,
        resetOnboarding 
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
