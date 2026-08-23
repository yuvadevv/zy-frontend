'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '@/features/student/providers/StudentProvider';

interface DashboardEntryProps {
  children: React.ReactNode;
}

export const DashboardEntry: React.FC<DashboardEntryProps> = ({ children }) => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { profile, academicRecord } = useStudent();
  
  const studentName = profile?.full_name || "Student";
  const branch = academicRecord?.branches?.name || "Branch";
  const yearName = academicRecord?.academic_years?.name || "";
  const yearNumber = parseInt(yearName.replace(/[^0-9]/g, '') || '1') || 1;
  const section = academicRecord?.sections?.name || "A";
  const semester = (yearNumber - 1) * 2 + 1; // Basic heuristic
  
  const [greeting, setGreeting] = useState('Good Morning');
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    setFormattedDate(new Date().toLocaleDateString('en-US', dateOptions));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const flag = localStorage.getItem('isFirstLogin');
      if (flag === 'true') {
        setIsFirstLogin(true);
        setShowWelcomeCard(true);
        localStorage.removeItem('isFirstLogin');
      }
    }
  }, []);

  if (!isMounted) return <div className="invisible">{children}</div>;

  return (
    <div className="w-full">
      <AnimatePresence>
        {showWelcomeCard && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="px-4 pt-6 pb-2"
          >
            <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <h2 className="text-2xl font-bold mb-1 relative z-10">Welcome to BLINTZY</h2>
              <p className="text-orange-100 mb-6 relative z-10">We're glad to have you here.</p>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm relative z-10">
                <p className="font-semibold">{studentName}</p>
                <p className="text-orange-100 text-sm">{branch} • {yearNumber}rd Year • Sec {section}</p>
              </div>

              <button 
                onClick={() => setShowWelcomeCard(false)}
                className="mt-6 bg-white text-orange-500 px-6 py-2 rounded-xl font-bold text-sm w-full hover:bg-orange-50 transition-colors relative z-10"
              >
                Let's Go
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={isFirstLogin ? { opacity: 0, y: 20 } : false}
        animate={isFirstLogin ? { opacity: 1, y: 0 } : false}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {!showWelcomeCard && (
          <section className="px-5 pt-8">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{greeting} 👋</h1>
            <p className="text-lg font-bold text-gray-900 leading-tight">{studentName}</p>
            <p className="mt-1 text-sm text-gray-500">Welcome back.</p>
          </section>
        )}

        <div className="mt-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
