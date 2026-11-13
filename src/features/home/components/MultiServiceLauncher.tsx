'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Printer, Utensils, Bike, ArrowUpRight, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ServiceLauncherItem } from '../types';
import { DEFAULT_LAUNCHER_SERVICES } from '../config/servicesLauncher';
import { fetchBootstrapConfig, isTestingEnvironment } from '@/features/bootstrap/services/bootstrapService';
import { FoodLockedModal } from '@/features/food/components/FoodLockedModal';

interface MultiServiceLauncherProps {
  services?: ServiceLauncherItem[];
  className?: string;
}

export const MultiServiceLauncher: React.FC<MultiServiceLauncherProps> = ({
  services = DEFAULT_LAUNCHER_SERVICES,
  className = '',
}) => {
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  // Live platform status for Food lock check
  const { data: bootstrapData } = useQuery({
    queryKey: ['bootstrap'],
    queryFn: fetchBootstrapConfig,
    staleTime: 1000 * 15,
  });

  const isTesting = isTestingEnvironment();
  const isFoodLocked = bootstrapData?.data
    ? Boolean(bootstrapData.data.is_food_locked_for_current_client)
    : !isTesting; // Default on main: locked! Default on testing: allowed!
  const foodLockMessage = bootstrapData?.data?.food_service_lock_message;

  const renderIcon = (icon: string, isPrimary?: boolean, isMuted?: boolean, isLocked?: boolean) => {
    if (isLocked) {
      return (
        <div className="relative">
          <Utensils className="w-5 h-5 text-zinc-400 stroke-[2]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#151515] text-[#FF6B00] flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
        </div>
      );
    }

    const iconClass = isPrimary
      ? 'w-5 h-5 text-white stroke-[2.4]'
      : isMuted
      ? 'w-5 h-5 text-gray-400 stroke-[2]'
      : 'w-5 h-5 text-[#FF6B00] stroke-[2.3]';

    switch (icon) {
      case 'printer':
        return <Printer className={iconClass} />;
      case 'food':
        return <Utensils className={iconClass} />;
      case 'ride':
        return <Bike className={iconClass} />;
      default:
        return <Printer className={iconClass} />;
    }
  };

  return (
    <>
      <section 
        aria-label="Campus Services"
        className={`w-full px-0.5 select-none ${className}`}
      >
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-[14.5px] sm:text-[15px] font-black text-[#151515] tracking-tight">
              Campus Services
            </h2>
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
              {services.length} Hubs
            </span>
          </div>
        </div>

        <div className={`grid ${services.length === 2 ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-2 sm:gap-2.5'} w-full`}>
          {services.map((service) => {
            const isFoodItem = service.id === 'food';
            const isItemLocked = isFoodItem ? isFoodLocked : false;
            const isActive = !isItemLocked && service.status === 'active' && !!service.href;
            const isPrimary = !isItemLocked && !!service.isPrimary;
            const isMuted = isItemLocked || service.status === 'coming_soon' || service.status === 'maintenance';

            const displayBadge = isItemLocked ? 'LOCKED' : service.badge;
            const displaySupportingText = isItemLocked ? 'Launching soon' : service.supportingText;

            const cardContent = (
              <div className="flex flex-col justify-between h-full relative z-10">
                {/* Top Row: Icon Container and Status Badge */}
                <div className="flex items-start justify-between gap-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 shadow-xs ${
                      isItemLocked
                        ? 'bg-zinc-800 border border-zinc-700/80 text-zinc-400'
                        : isPrimary
                        ? 'bg-gradient-to-br from-[#FF6B00] to-orange-600 text-white shadow-orange-500/35'
                        : isMuted
                        ? 'bg-gray-150 text-gray-400 border border-gray-200/60'
                        : 'bg-orange-50 border border-orange-200/70 text-[#FF6B00] group-hover:border-[#FF6B00]/60'
                    }`}
                  >
                    {renderIcon(service.icon, isPrimary, isMuted, isItemLocked)}
                  </div>

                  {displayBadge && (
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full leading-none shrink-0 shadow-2xs flex items-center gap-1 ${
                        isItemLocked
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : isPrimary
                          ? 'bg-[#FF6B00] text-white ring-1 ring-orange-400/50'
                          : isMuted
                          ? 'bg-gray-200/80 text-gray-500 border border-gray-300/40'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                      }`}
                    >
                      {isItemLocked && <Lock className="w-2.5 h-2.5" />}
                      <span>{displayBadge}</span>
                    </span>
                  )}
                </div>

                {/* Bottom Row: Service Label & Supporting Text */}
                <div className="mt-3 flex flex-col">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[14px] sm:text-[15px] font-black leading-tight tracking-tight ${
                        isItemLocked
                          ? 'text-zinc-300 group-hover:text-amber-400 transition-colors'
                          : isPrimary
                          ? 'text-white'
                          : isMuted
                          ? 'text-gray-400 font-bold'
                          : 'text-[#151515] group-hover:text-[#FF6B00] transition-colors'
                      }`}
                    >
                      {service.label}
                    </span>
                    {isActive ? (
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          isPrimary ? 'text-orange-400' : 'text-gray-400 group-hover:text-[#FF6B00]'
                        }`}
                      />
                    ) : isItemLocked ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                    ) : null}
                  </div>

                  <span
                    className={`text-[10.5px] sm:text-[11px] leading-tight mt-1 line-clamp-1 ${
                      isItemLocked
                        ? 'text-zinc-500 font-medium'
                        : isPrimary
                        ? 'text-zinc-300 font-medium'
                        : isMuted
                        ? 'text-gray-400 font-medium'
                        : 'text-gray-500 font-medium'
                    }`}
                  >
                    {displaySupportingText}
                  </span>
                </div>
              </div>
            );

            // Case A: Food is Locked -> Open Interactive Info Modal
            if (isItemLocked) {
              return (
                <motion.div
                  key={service.id}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <button
                    type="button"
                    onClick={() => setIsLockedModalOpen(true)}
                    className="w-full text-left group relative flex flex-col h-[122px] sm:h-[128px] p-3.5 sm:p-4 rounded-[22px] border border-zinc-800 bg-gradient-to-br from-[#1c1c1c] via-[#161616] to-[#111111] shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:border-amber-500/50 hover:shadow-[0_8px_24px_rgba(245,158,11,0.14)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 overflow-hidden cursor-pointer"
                    aria-label={`${service.label} - Locked`}
                  >
                    {/* Subtle lock ambient amber lighting */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
                    {cardContent}
                  </button>
                </motion.div>
              );
            }

            // Case B: Active Unlocked Service -> Route to Link
            if (isActive && service.href) {
              return (
                <motion.div
                  key={service.id}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <Link
                    href={service.href}
                    className={`group relative flex flex-col h-[122px] sm:h-[128px] p-3.5 sm:p-4 rounded-[22px] border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] overflow-hidden ${
                      isPrimary
                        ? 'bg-gradient-to-br from-[#1c1c1c] via-[#151515] to-[#111111] border-zinc-800 shadow-[0_6px_22px_rgba(21,21,21,0.18)] hover:border-[#FF6B00]/70 hover:shadow-[0_8px_28px_rgba(255,107,0,0.22)]'
                        : 'bg-white border-gray-200/90 hover:border-orange-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]'
                    }`}
                    aria-label={`${service.label} - ${service.supportingText}`}
                  >
                    {/* Subtle ambient lighting for hero card */}
                    {isPrimary && (
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FF6B00]/25 rounded-full blur-xl pointer-events-none" />
                    )}
                    {cardContent}
                  </Link>
                </motion.div>
              );
            }

            // Case C: Coming Soon or Disabled Generic Service
            return (
              <div
                key={service.id}
                role="button"
                aria-disabled="true"
                tabIndex={-1}
                className="group relative flex flex-col h-[122px] sm:h-[128px] p-3.5 sm:p-4 rounded-[22px] border border-dashed border-gray-250 bg-gray-50/70 opacity-65 cursor-not-allowed select-none"
                aria-label={`${service.label} - Coming soon`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* Food Locked Information Modal */}
      <FoodLockedModal 
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        message={foodLockMessage}
      />
    </>
  );
};
