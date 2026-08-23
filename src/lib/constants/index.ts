// src/lib/constants/index.ts

export const SUPABASE_BUCKETS = {
  AVATARS: 'avatars',
  MANUALS: 'manuals',
  HALLTICKETS: 'halltickets',
  CUSTOM_UPLOADS: 'custom-uploads',
  VENDOR_FILES: 'vendor-files',
  APP_ASSETS: 'app-assets'
} as const;

export const APP_ENV = {
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test'
} as const;

export const AUTH_CONSTANTS = {
  SESSION_COOKIE_NAME: 'sb-auth-token',
  REDIRECT_PATH_AFTER_LOGIN: '/app/home',
  REDIRECT_PATH_AFTER_LOGOUT: '/app/login'
} as const;
