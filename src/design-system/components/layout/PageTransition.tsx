'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'slide' | 'fade';
  className?: string;
}

export const PageTransition = ({ children, mode = 'slide', className = '' }: PageTransitionProps) => {
  const variants: Record<string, Variants> = {
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
      exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.25 } },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[mode]}
      className={`w-full h-full flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
};
