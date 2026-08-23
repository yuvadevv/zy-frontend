"use client";
import React from 'react';
import { QuickService } from '../types';
import { motion } from 'framer-motion';
import { motionPresets } from '@/design-system/animations';
import { Badge } from '@/design-system/components/common/Badge/Badge';

import { APP_ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface QuickServicesProps {
  services: QuickService[];
}

export const QuickServicesGrid = ({ services }: QuickServicesProps) => {
  const router = useRouter();
  
  if (!services || services.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {services.map((service, index) => {
          const bgColors = ['bg-blue-50', 'bg-orange-50', 'bg-purple-50', 'bg-green-50'];
          const iconBg = bgColors[index % bgColors.length];
          if (service.id === 'srv_bus_tracking' || service.id === 'srv_bus') {
            return (
              <div
                key={service.id}
                className="relative flex flex-col items-center justify-center p-3 rounded-[20px] border border-orange-100/50 shadow-none h-full bg-gray-50/80 overflow-hidden opacity-80 cursor-not-allowed"
              >
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M10,90 Q40,40 90,10" stroke="#FF6B00" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                    <circle cx="90" cy="10" r="3" fill="#FF6B00" />
                    <circle cx="10" cy="90" r="3" fill="#FF6B00" />
                  </svg>
                </div>

                <div className="w-14 h-14 mb-2 relative z-10 flex items-center justify-center">
                  <motion.svg 
                    viewBox="0 0 64 64" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-full h-full drop-shadow-md"
                    animate={{
                      x: [0, 2, 4, 2, 0, -2, -4, -2, 0],
                      y: [0, -1, 0, -1, 0, -1, 0, -1, 0],
                      rotate: [0, 1, 2, 1, 0, -1, -2, -1, 0]
                    }}
                    transition={{
                      duration: 8,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <rect x="8" y="16" width="48" height="32" rx="6" fill="#FBBF24" />
                    <path d="M8 22C8 18.6863 10.6863 16 14 16H50C53.3137 16 56 18.6863 56 22V32H8V22Z" fill="#F59E0B" />
                    <rect x="12" y="20" width="10" height="10" rx="2" fill="#DBEAFE" />
                    <rect x="24" y="20" width="16" height="10" rx="2" fill="#DBEAFE" />
                    <rect x="42" y="20" width="10" height="10" rx="2" fill="#DBEAFE" />
                    <circle cx="18" cy="48" r="6" fill="#374151" />
                    <circle cx="18" cy="48" r="3" fill="#9CA3AF" />
                    <circle cx="46" cy="48" r="6" fill="#374151" />
                    <circle cx="46" cy="48" r="3" fill="#9CA3AF" />
                    <rect x="12" y="38" width="6" height="2" fill="#F87171" />
                    <rect x="46" y="38" width="6" height="2" fill="#F87171" />
                  </motion.svg>
                </div>

                <div className="flex flex-col items-center w-full z-10">
                  <span className="font-bold text-[14px] text-gray-700 leading-tight mb-0.5 text-center">
                    RCE Bus Tracking
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 leading-tight text-center mb-1.5">
                    Live college bus location
                  </span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-[9px] uppercase font-bold tracking-widest rounded-md whitespace-nowrap">
                    COMING SOON
                  </span>
                </div>
              </div>
            );
          }

          const MotionLink = motion(Link);
          return (
            <MotionLink
              href={(!service.disabled && !service.comingSoon && service.route) ? service.route : '#'}
              key={service.id}
              onClick={(e: React.MouseEvent) => {
                if (service.disabled || service.comingSoon || !service.route) {
                  e.preventDefault();
                }
              }}
              aria-label={`Open ${service.title} service`}
              className={
                'relative flex flex-col items-start p-3 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] touch-manipulation h-full ' +
                (service.disabled || service.comingSoon ? 'bg-gray-50 opacity-75 cursor-not-allowed' : 'bg-white hover:border-orange-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(255,107,0,0.08)] transition-all duration-200')
              }
              {...motionPresets.fade}
              whileTap={(!service.disabled && !service.comingSoon) ? { scale: 0.96 } : undefined}
            >
              <div className="flex justify-between w-full items-start mb-1.5">
                <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${iconBg}`}>
                  <span className="text-[24px]">
                    {service.icon === 'Book' ? '📚' : service.icon === 'Ticket' ? '🎫' : service.icon === 'Copy' ? '📄' : service.icon === 'Upload' ? '📤' : '⚙️'}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between w-full gap-2 mb-0.5 flex-nowrap">
                <span className="font-bold text-[15px] text-gray-900 text-left leading-tight min-w-0">
                  {service.title}
                </span>
                {service.badge && (
                  <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[9px] uppercase font-bold tracking-widest rounded-md whitespace-nowrap flex-shrink-0 mt-0.5">
                    {service.badge}
                  </span>
                )}
              </div>
              
              <span className="text-xs font-medium text-gray-500 text-left leading-tight">
                {service.description}
              </span>
            </MotionLink>
          );
        })}
      </div>
      
      <Link 
        href={APP_ROUTES.SERVICES.HUB}
        className="w-full mt-1 flex items-center justify-between p-3.5 bg-[#FF6B00] border border-orange-500 rounded-[20px] hover:bg-orange-600 active:bg-orange-700 transition-all group shadow-[0_4px_14px_rgba(255,107,0,0.2)]"
      >
        <div className="flex flex-col items-start text-left pl-2">
          <span className="font-bold text-[15px] text-white leading-none">View All Services</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm shadow-sm">
          <span className="text-white font-bold text-xl leading-none group-hover:translate-x-0.5 transition-transform -mt-0.5">
            →
          </span>
        </div>
      </Link>
    </div>
  );
};


