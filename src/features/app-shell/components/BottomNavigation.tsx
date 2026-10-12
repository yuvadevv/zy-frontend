'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { APP_ROUTES } from '@/config/routes';
import { useNotifications } from '@/features/notifications/providers/NotificationProvider';

export function BottomNavigation() {
  const pathname = usePathname();
  const tabs = Object.values(APP_ROUTES);
  const { unreadCount } = useNotifications();

  // Helper to accurately resolve active destination including nested sub-routes
  const getIsActive = (tabPath: string) => {
    if (tabPath === '/app/orders') {
      return pathname.startsWith('/app/orders');
    }
    if (tabPath === '/app/notifications') {
      return pathname.startsWith('/app/notifications');
    }
    if (tabPath === '/app/profile') {
      return pathname.startsWith('/app/profile');
    }
    if (tabPath === '/app/home') {
      return (
        pathname === '/app/home' ||
        pathname.startsWith('/app/services') ||
        pathname.startsWith('/app/offers') ||
        pathname.startsWith('/app/campus-fest') ||
        pathname.startsWith('/app/refer') ||
        pathname.startsWith('/app/leaderboard') ||
        (!pathname.startsWith('/app/orders') &&
         !pathname.startsWith('/app/notifications') &&
         !pathname.startsWith('/app/profile'))
      );
    }
    return pathname === tabPath;
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-[max(env(safe-area-inset-bottom,0px)+12px,16px)] left-1/2 -translate-x-1/2 z-50 flex h-[62px] w-[calc(100%-24px)] max-w-[390px] items-center justify-between rounded-full bg-white/95 backdrop-blur-xl border border-gray-100/90 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] px-2 py-1.5 select-none"
    >
      <div className="flex w-full h-full items-center justify-between">
        {tabs.map((tab) => {
          const isActive = getIsActive(tab.path);
          const Icon = tab.icon!;
          const isNotificationsTab = tab.path === '/app/notifications';

          return (
            <motion.div
              key={tab.path}
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className={`relative flex h-full items-center justify-center ${
                isActive ? 'flex-shrink-0' : 'flex-1'
              }`}
            >
              <Link
                href={tab.path}
                className="group relative flex h-full w-full items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                aria-label={
                  isNotificationsTab && unreadCount > 0
                    ? `${tab.title}, ${unreadCount} unread`
                    : tab.title
                }
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Dark Charcoal Expanding Capsule */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 rounded-full bg-[#201E20] shadow-md shadow-black/20"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                {/* Destination Content */}
                {isActive ? (
                  /* Active State: Icon on left, Label on right inside the capsule */
                  <div className="relative z-10 flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 whitespace-nowrap">
                    <div className="relative flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-[#FF6B00] stroke-[2.4]" />
                      {/* Notification Badge inside Active State */}
                      {isNotificationsTab && unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 z-20 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[9px] font-black leading-none text-white shadow-xs ring-2 ring-[#201E20]">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] font-bold text-white tracking-tight leading-none">
                      {tab.title}
                    </span>
                  </div>
                ) : (
                  /* Inactive State: Centred Icon ONLY (no label underneath) */
                  <div className="relative z-10 flex items-center justify-center py-2">
                    <Icon className="w-[20px] h-[20px] text-zinc-400 group-hover:text-zinc-600 transition-colors stroke-[2]" />
                    {/* Notification Badge on Inactive Icon */}
                    {isNotificationsTab && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 z-20 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[9px] font-black leading-none text-white shadow-xs ring-2 ring-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
