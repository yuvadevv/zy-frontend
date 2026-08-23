// src/features/notifications/constants/categories.ts
import { NotificationCategory } from '../types';
import { 
  Bell, Package, CreditCard, Gift, LifeBuoy, 
  Megaphone, ShieldAlert, Clock, BookOpen, 
  Calendar, Briefcase, Settings
} from 'lucide-react';
import React from 'react';

export const CATEGORY_ICONS: Record<NotificationCategory, React.ElementType> = {
  SYSTEM: Settings,
  ORDER: Package,
  PAYMENT: CreditCard,
  PROMOTION: Gift,
  SUPPORT: LifeBuoy,
  ANNOUNCEMENT: Megaphone,
  SECURITY: ShieldAlert,
  REMINDER: Clock,
  ACADEMIC: BookOpen,
  EVENT: Calendar,
  PLACEMENT: Briefcase
};

export const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  SYSTEM: 'text-gray-500 bg-gray-100',
  ORDER: 'text-blue-500 bg-blue-100',
  PAYMENT: 'text-green-500 bg-green-100',
  PROMOTION: 'text-purple-500 bg-purple-100',
  SUPPORT: 'text-orange-500 bg-orange-100',
  ANNOUNCEMENT: 'text-indigo-500 bg-indigo-100',
  SECURITY: 'text-red-500 bg-red-100',
  REMINDER: 'text-yellow-600 bg-yellow-100',
  ACADEMIC: 'text-teal-500 bg-teal-100',
  EVENT: 'text-pink-500 bg-pink-100',
  PLACEMENT: 'text-cyan-500 bg-cyan-100'
};
