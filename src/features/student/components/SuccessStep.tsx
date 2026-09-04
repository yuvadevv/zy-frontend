'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export const SuccessStep = () => {
  const router = useRouter();

  const goToDashboard = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isFirstLogin', 'true');
      document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
      window.location.href = '/app/home';
    }
  };

  useEffect(() => {
    // Set flag for first-time dashboard animation
    if (typeof window !== 'undefined') {
      localStorage.setItem('isFirstLogin', 'true');
      document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
    }

    const timer = setTimeout(() => {
      goToDashboard();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center py-12 px-4"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
        >
          <CheckCircle2 className="w-12 h-12 text-orange-500" />
        </motion.div>
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[3px] border-orange-500 border-t-transparent rounded-full opacity-50"
        />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-black mb-4 tracking-tight">Welcome to BLINTZY!</h2>
      <p className="text-gray-500 text-lg mb-8 max-w-[260px] mx-auto">
        Your account has been created successfully.
      </p>

      <button
        onClick={goToDashboard}
        className="w-full max-w-xs py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
      >
        Go to Dashboard
      </button>
    </motion.div>
  );
};
