// src/features/profile/constants/index.ts

export const SUPPORT_LINKS = {
  WHATSAPP: 'https://wa.me/message/YOUR_BUSINESS_NUMBER',
  EMAIL: 'mailto:support@blintzy.com',
  PHONE: 'tel:+919876543210'
};

export const APP_INFO = {
  VERSION: '0.1.0-beta',
  BUILD: '104',
  ENV: process.env.NODE_ENV
};

export const PROFILE_SECTIONS = {
  PERSONAL: 'PERSONAL',
  ACADEMIC: 'ACADEMIC',
  DELIVERY: 'DELIVERY',
  NOTIFICATIONS: 'NOTIFICATIONS',
  SECURITY: 'SECURITY',
  SUPPORT: 'SUPPORT',
  ABOUT: 'ABOUT'
} as const;
