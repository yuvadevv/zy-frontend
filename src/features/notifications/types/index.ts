// src/features/notifications/types/index.ts

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'DELETED' | 'PINNED' | 'MUTED';

export type NotificationCategory = 
  | 'SYSTEM'
  | 'ORDER'
  | 'PAYMENT'
  | 'PROMOTION'
  | 'SUPPORT'
  | 'ANNOUNCEMENT'
  | 'SECURITY'
  | 'REMINDER'
  | 'ACADEMIC'
  | 'EVENT'
  | 'PLACEMENT';

export type NotificationActionType = 
  | 'OPEN'
  | 'DISMISS'
  | 'MARK_READ'
  | 'ARCHIVE'
  | 'DELETE'
  | 'SHARE'
  | 'SAVE'
  | 'ORDER_TRACKING'
  | 'ORDER_HISTORY'
  | 'CHECKOUT'
  | 'PROFILE'
  | 'MANUAL'
  | 'SUPPORT_TICKET';

export interface NotificationAction {
  actionType: NotificationActionType;
  label: string;
  payload?: Record<string, unknown>;
  fallbackUrl?: string; // In case the frontend cannot route it naturally
}

// Future rich notification payload
export interface RichNotificationPayload {
  imageUrl?: string;
  bannerUrl?: string;
  pdfUrl?: string;
  videoUrl?: string;
  countdownTo?: Date;
  carouselImages?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: Date;
  actions?: NotificationAction[];
  richPayload?: RichNotificationPayload;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  isPinned: boolean;
  priority: NotificationPriority;
  expiresAt?: Date;
  bannerUrl?: string;
  cta?: NotificationAction;
}

export type NotificationPreferenceType = 
  | 'PUSH'
  | 'EMAIL'
  | 'SMS'
  | 'WHATSAPP'
  | 'MARKETING'
  | 'TRANSACTIONAL'
  | 'ANNOUNCEMENTS'
  | 'SUPPORT'
  | 'SECURITY';

export interface NotificationPreference {
  id: NotificationPreferenceType;
  label: string;
  description: string;
  enabled: boolean;
  isSystemMandatory?: boolean; // True for security and transactional
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // '22:00'
  endTime: string;   // '08:00'
  weekendOnly: boolean;
  weekdaysOnly: boolean;
}
