'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Bell, ShoppingBag, ChevronDown, ChevronLeft } from 'lucide-react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useFoodCart } from '../store/useFoodCart';
import { APP_ROUTES } from '@/constants/routes';

// Robust cleaner to convert messy usernames like "Sai9581353999" into friendly human names like "Sai"
export const cleanStudentName = (rawName?: string | null, email?: string | null): string => {
  let name = (rawName || '').trim();

  // If no name, derive from email handle
  if (!name && email) {
    name = email.split('@')[0];
  }

  if (!name || /^(error|404|not found|undefined|null|failed)/i.test(name)) {
    return 'Student';
  }

  // Remove any numbers/digits anywhere in the student name (e.g. "Sai9581353999" -> "Sai")
  name = name.replace(/\d+/g, '').replace(/[._-]/g, ' ').trim();

  if (!name || name.length < 2) {
    return 'Student';
  }

  // Format to Title Case
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const FoodStudentHeader: React.FC = () => {
  const router = useRouter();
  const { profile, academicRecord } = useStudent();
  const { user } = useAuthSession();
  const { unreadCount } = useNotifications();
  const { getTotalCount, openCartDrawer } = useFoodCart();

  const totalCartCount = getTotalCount();

  // Dynamic greeting based on current local hour
  const [greeting, setGreeting] = useState('Good afternoon');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  // Resolve student name dynamically
  const resolveRawName = (): string => {
    const pName = profile?.full_name?.trim();
    if (pName && !/^(error|404|not found|undefined|null|failed)/i.test(pName)) {
      return pName;
    }
    const metaName = (user?.user_metadata?.full_name || user?.user_metadata?.name)?.trim();
    if (metaName && !/^(error|404|not found|undefined|null|failed)/i.test(metaName)) {
      return metaName;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bl_session_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const sName = (parsed?.user_metadata?.full_name || parsed?.user_metadata?.name || parsed?.name)?.trim();
          if (sName && !/^(error|404|not found|undefined|null|failed)/i.test(sName)) {
            return sName;
          }
        }
      } catch {}
    }
    return '';
  };

  const rawName = resolveRawName();
  const studentName = cleanStudentName(rawName, user?.email);
  const collegeName = academicRecord?.colleges?.name || 'Ramachandra College of Engineering';

  // Compute clean initial for avatar
  const avatarInitial = studentName.charAt(0).toUpperCase() || 'S';

  return (
    <header className="w-full bg-white select-none flex flex-col gap-3 pt-1 pb-1">
      {/* 1. Top Navigation & Action Row (Back, Location Pill, Notifications, Food Cart) */}
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Left: Back button + Location Pill */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Back button to BLINTZY Home */}
          <button
            onClick={() => router.push(APP_ROUTES.HOME)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-[#151515] transition flex items-center justify-center shrink-0 shadow-2xs"
            aria-label="Back to BLINTZY Home"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
          </button>

          {/* Location Dropdown Pill */}
          <div
            className="px-2.5 py-1.5 rounded-full bg-gray-100/90 hover:bg-gray-150 border border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-gray-800 transition shadow-2xs truncate max-w-[210px] sm:max-w-[260px] cursor-pointer"
            title={collegeName}
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
            <span className="truncate text-[11px] font-extrabold text-gray-800">
              {collegeName}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
          </div>
        </div>

        {/* Right: Quick Action Buttons (Notifications + Food Cart) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell */}
          <button
            onClick={() => router.push('/app/notifications')}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 hover:text-black transition flex items-center justify-center relative shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Food Cart Icon */}
          <button
            onClick={() => router.push(APP_ROUTES.FOOD.CART)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 hover:text-black transition flex items-center justify-center relative shadow-2xs cursor-pointer"
            aria-label="Open Food Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Personalized Greeting & Student Profile Card */}
      <div className="flex items-center justify-between gap-3 pt-1 px-0.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with rich gradient ring */}
          <Link
            href="/app/profile"
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-[#FF6B00] text-white flex items-center justify-center font-black text-sm shrink-0 overflow-hidden shadow-sm ring-2 ring-orange-200/90 hover:scale-105 active:scale-95 transition-transform"
            aria-label="View Student Profile"
          >
            {profile?.avatar_path && profile.avatar_path.trim().length > 0 ? (
              <img
                src={profile.avatar_path.trim()}
                alt={studentName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{avatarInitial}</span>
            )}
          </Link>

          {/* Greeting + Formatted Student Name */}
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[11px] font-bold text-gray-400 leading-none">
              {greeting},
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <h2 className="text-base sm:text-lg font-black text-[#151515] tracking-tight truncate">
                {studentName}
              </h2>
              <span className="text-sm shrink-0">👋</span>
            </div>
            <p className="text-[10.5px] font-medium text-gray-500 mt-0.5">
              What would you like to eat today?
            </p>
          </div>
        </div>

        {/* Counter Pickup Badge */}
        <div className="flex flex-col items-end shrink-0">
          <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open</span>
          </span>
          <span className="text-[9px] text-gray-400 font-bold mt-0.5">
            ⚡ 10-15m
          </span>
        </div>
      </div>
    </header>
  );
};
