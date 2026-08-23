import React from 'react';
import { motion } from 'framer-motion';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressStepper = ({ currentStep, totalSteps }: ProgressStepperProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 bg-background">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="w-full bg-secondary h-1">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
