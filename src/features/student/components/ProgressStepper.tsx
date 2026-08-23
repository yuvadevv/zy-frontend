'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-sm mx-auto px-4 mt-2 mb-8 relative">
      <div className="flex items-center justify-between relative z-10">
        
        {/* Background Track */}
        <div className="absolute left-0 top-[18px] w-full h-[3px] bg-gray-200 -z-10 rounded-full"></div>
        
        {/* Active Track */}
        <motion.div 
          className="absolute left-0 top-[18px] h-[3px] bg-orange-500 -z-10 rounded-full"
          initial={false}
          animate={{ width: `${(Math.max(0, currentStep - 2) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber + 1; 
          const isActive = currentStep === stepNumber + 1; 

          return (
            <div key={stepName} className="flex flex-col items-center relative">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#f97316' : '#ffffff',
                  borderColor: isCompleted || isActive ? '#f97316' : '#e5e7eb',
                  color: isCompleted || isActive ? '#ffffff' : '#9ca3af',
                }}
                transition={{ duration: 0.3 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-[2px] text-sm font-bold`}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white" /> : stepNumber}
              </motion.div>
              <span className={`absolute -bottom-6 text-[11px] font-semibold whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-400'}`}>
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
