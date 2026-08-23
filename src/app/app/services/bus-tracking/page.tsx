"use client";

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { MapPin, Bus, Clock, Check } from 'lucide-react';

export default function BusTrackingComingSoonPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const registered = localStorage.getItem('blintzy_bus_notify_registered');
      if (registered === 'true') {
        setIsRegistered(true);
      }
    } catch (e) {
      // Silently handle localStorage unavailability
    }
  }, []);

  const handleNotifyClick = () => {
    if (isRegistered) return;
    
    try {
      localStorage.setItem('blintzy_bus_notify_registered', 'true');
    } catch (e) {
      // Silently handle localStorage unavailability
    }
    
    setIsRegistered(true);
    setShowToast(true);
    
    // Hide toast after a few seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col flex-1 relative h-full bg-background min-h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 pt-4 pb-8 flex flex-col items-center text-center">
          
          {/* Main Visual */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full max-w-[280px] aspect-square relative mb-8 mt-4 flex items-center justify-center overflow-visible"
          >
            {/* Map/Route Background Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                {/* Static Background Path */}
                <path d="M20,180 Q80,80 180,20" stroke="#FF6B00" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.3" />
                
                {/* Animated Dashed Route Line */}
                <motion.path 
                  d="M20,180 Q80,80 180,20" 
                  stroke="#FF6B00" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeDasharray="8 8"
                  animate={prefersReducedMotion ? {} : {
                    strokeDashoffset: [0, -100]
                  }}
                  transition={{
                    duration: 5,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
                
                {/* Start Point */}
                <circle cx="20" cy="180" r="10" fill="#FF6B00" opacity="0.4" />
                <circle cx="20" cy="180" r="5" fill="#FF6B00" />
                
                {/* Intermediate Point 1 */}
                <motion.circle 
                  cx="70" cy="115" r="4" fill="#FF6B00"
                  animate={prefersReducedMotion ? {} : {
                    scale: [1, 1, 1.5, 1, 1],
                    opacity: [0.5, 0.5, 1, 0.5, 0.5]
                  }}
                  transition={{ duration: 30, times: [0, 0.2, 0.333, 0.4, 1], repeat: Infinity }}
                />

                {/* Intermediate Point 2 */}
                <motion.circle 
                  cx="120" cy="65" r="4" fill="#FF6B00"
                  animate={prefersReducedMotion ? {} : {
                    scale: [1, 1, 1.5, 1, 1],
                    opacity: [0.5, 0.5, 1, 0.5, 0.5]
                  }}
                  transition={{ duration: 30, times: [0, 0.45, 0.566, 0.65, 1], repeat: Infinity }}
                />
                
                {/* End Point */}
                <circle cx="180" cy="20" r="12" fill="none" stroke="#FF6B00" strokeWidth="2" />
                <circle cx="180" cy="20" r="4" fill="#FF6B00" />
              </svg>
            </div>
            
            {/* Animated Bus Sequence (30 seconds) */}
            <motion.div 
              className="absolute z-10 flex items-center justify-center w-28 h-28 bg-orange-50/90 rounded-full border-4 border-orange-100 shadow-[0_10px_40px_rgba(255,107,0,0.2)] backdrop-blur-sm"
              animate={prefersReducedMotion ? {
                x: 0, y: 0, scale: 1, rotate: 0
              } : {
                x: [
                  '-70px', // Phase 1: 0s (entrance)
                  '-70px', // 1.5s (begins moving)
                  '-50px', // 3s
                  '20px',  // 17s (travels)
                  '60px',  // 23s (approaches destination)
                  '70px',  // 26s (destination reached)
                  '70px',  // 28s (fade out)
                  '-70px'  // 30s (reset)
                ],
                y: [
                  '70px',
                  '70px',
                  '50px',
                  '-20px',
                  '-60px',
                  '-70px',
                  '-70px',
                  '70px'
                ],
                scale: [
                  0.8, 
                  0.8,
                  0.9,
                  1.1,
                  0.95,
                  0.9,
                  0.9,
                  0.8
                ],
                rotate: [
                  0,
                  0,
                  -5,
                  -12,
                  -5,
                  0,
                  0,
                  0
                ],
                opacity: [
                  0, // initial entrance fade in
                  1,
                  1, 
                  1, 
                  1, 
                  1, 
                  0, 
                  0
                ]
              }}
              transition={{
                duration: 30,
                ease: "easeInOut",
                times: [0, 0.005, 0.1, 0.566, 0.766, 0.866, 0.933, 1],
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 drop-shadow-xl">
                <rect x="6" y="16" width="52" height="34" rx="8" fill="#FBBF24" />
                <path d="M6 24C6 19.5817 9.58172 16 14 16H50C54.4183 16 58 19.5817 58 24V34H6V24Z" fill="#F59E0B" />
                <rect x="10" y="22" width="12" height="12" rx="2" fill="#DBEAFE" />
                <rect x="26" y="22" width="20" height="12" rx="2" fill="#DBEAFE" />
                <rect x="50" y="22" width="8" height="12" rx="2" fill="#DBEAFE" />
                <circle cx="16" cy="50" r="8" fill="#374151" />
                <circle cx="16" cy="50" r="4" fill="#9CA3AF" />
                <circle cx="48" cy="50" r="8" fill="#374151" />
                <circle cx="48" cy="50" r="4" fill="#9CA3AF" />
                <rect x="10" y="42" width="8" height="3" fill="#F87171" />
                <rect x="46" y="42" width="8" height="3" fill="#F87171" />
                <path d="M26 16V22" stroke="#D97706" strokeWidth="2" />
                <path d="M46 16V22" stroke="#D97706" strokeWidth="2" />
              </svg>
            </motion.div>
            
            {/* Route Progress Pulse Element (synced with bus) */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute z-0 w-32 h-32 rounded-full border-2 border-orange-300/30 bg-orange-100/10 pointer-events-none"
                animate={{
                  x: ['-70px', '-70px', '-50px', '20px', '60px', '70px', '70px', '-70px'],
                  y: ['70px', '70px', '50px', '-20px', '-60px', '-70px', '-70px', '70px'],
                  scale: [0.5, 0.5, 0.8, 1.5, 1.0, 1.5, 0.5, 0.5],
                  opacity: [0, 0, 0.5, 0, 0.5, 0, 0, 0]
                }}
                transition={{
                  duration: 30,
                  ease: "easeInOut",
                  times: [0, 0.005, 0.1, 0.566, 0.766, 0.866, 0.933, 1],
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center w-full relative z-20"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] uppercase font-black tracking-widest rounded-lg">
                LIVE TRACKING PREVIEW
              </span>
            </div>
            
            <h1 className="text-2xl font-black text-foreground mb-2 leading-tight">
              RCE Bus Tracking
            </h1>
            <p className="text-[15px] font-medium text-muted-foreground mb-1 leading-relaxed max-w-[280px]">
              Ramachandra College of Engineering
            </p>
            <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed max-w-sm">
              Track your college bus in real time, see its location, and know when it is approaching your stop.
            </p>

            {/* Feature Previews */}
            <div className="w-full max-w-sm flex flex-col gap-3 text-left bg-secondary/30 rounded-2xl p-5 border border-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">Live Bus Location</span>
                  <span className="text-xs text-muted-foreground">See exactly where your bus is</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">Track Your Bus</span>
                  <span className="text-xs text-muted-foreground">Monitor specific RCE routes</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">Estimated Arrival</span>
                  <span className="text-xs text-muted-foreground">Know exactly when to step out</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/90 backdrop-blur-md border-t border-border p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-50">
        
        {/* Success Toast / Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute -top-14 left-4 right-4 bg-gray-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-lg text-center leading-tight z-[100]"
            >
              We'll let you know when RCE Bus Live Tracking launches.
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          onClick={handleNotifyClick}
          disabled={isRegistered}
          whileTap={!isRegistered ? { scale: 0.97 } : undefined}
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md relative z-10 ${
            isRegistered 
              ? 'bg-orange-100 text-orange-600 opacity-100 cursor-not-allowed' 
              : 'bg-[#FF6B00] text-white hover:bg-orange-600 active:bg-orange-700'
          }`}
        >
          {isRegistered ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2"
            >
              You're on the list <Check className="w-5 h-5" strokeWidth={3} />
            </motion.div>
          ) : (
            <span>Notify Me When It Launches</span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
