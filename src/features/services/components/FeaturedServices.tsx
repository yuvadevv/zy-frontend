"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FeaturedService, Service } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedServicesProps {
  featured: FeaturedService[];
  services: Service[];
  onFeaturedClick: (serviceId: string, campaign?: string) => void;
}

export const FeaturedServices = ({ featured, services, onFeaturedClick }: FeaturedServicesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeFeatured = featured
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .filter(feat => services.find(s => s.id === feat.serviceId))
    .slice(0, 3); // Max 3 slides

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeFeatured.length);
  }, [activeFeatured.length]);

  useEffect(() => {
    if (isPaused || activeFeatured.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, activeFeatured.length, nextSlide]);

  if (!activeFeatured || activeFeatured.length === 0) return null;

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -10000) {
      nextSlide();
    } else if (swipe > 10000) {
      setCurrentIndex((prev) => (prev - 1 + activeFeatured.length) % activeFeatured.length);
    }
  };

  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const getThemeColors = (title: string) => {
    if (title.includes('Manuals')) return 'bg-blue-600 border-blue-500/30 shadow-blue-600/20';
    if (title.includes('Uploads')) return 'bg-purple-600 border-purple-500/30 shadow-purple-600/20';
    return 'bg-orange-500 border-orange-400/30 shadow-orange-500/20';
  };

  return (
    <div className="px-4 mt-2 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Featured</h2>
      </div>
      
      <div 
        className="relative w-full h-[180px] rounded-[24px] overflow-hidden touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} mode="wait">
          {activeFeatured.map((feat, index) => {
            if (index !== currentIndex) return null;
            
            const service = services.find(s => s.id === feat.serviceId)!;
            const themeClass = getThemeColors(service.title);
            
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className={`absolute inset-0 w-full h-full p-6 flex flex-col justify-center cursor-grab active:cursor-grabbing rounded-[24px] shadow-lg border ${themeClass}`}
              >
                <div className="relative z-10 flex flex-col items-start gap-1 max-w-[65%]">
                  <span className="text-[10px] uppercase font-black text-white/90 tracking-widest bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {feat.campaign || 'Featured'}
                  </span>
                  <h3 className="text-[22px] font-extrabold text-white mt-1 leading-tight tracking-tight">{service.title}</h3>
                  <p className="text-[13px] text-white/90 font-medium leading-snug line-clamp-2 mt-0.5">
                    {service.subtitle || service.description}
                  </p>
                  <button 
                    onClick={() => onFeaturedClick(feat.serviceId, feat.campaign)}
                    className="mt-3 bg-white text-gray-900 text-[13px] font-bold px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 shadow-sm"
                  >
                    {service.title.includes('Manuals') ? 'Browse Manuals' : service.title.includes('Upload') ? 'Upload Now' : 'Explore Now'} <span className="opacity-60 font-black">→</span>
                  </button>
                </div>
                
                <div className="absolute right-0 top-0 bottom-0 w-[35%] flex items-center justify-end pr-4 pointer-events-none">
                  <div className="text-[80px] opacity-[0.25] filter grayscale brightness-200 transform rotate-12 -translate-y-2 translate-x-2">
                    {service.icon === 'Book' ? '📚' : service.icon === 'Ticket' ? '🎟️' : service.icon === 'Copy' ? '📄' : service.icon === 'Upload' ? '📤' : '✨'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {activeFeatured.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4">
          {activeFeatured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="p-1 -m-1 cursor-pointer focus:outline-none"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-5 bg-orange-500' : 'w-1.5 bg-gray-300'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
