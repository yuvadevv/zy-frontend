export interface QuickService {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  route: string;
  enabled: boolean;
  badge?: string;
  comingSoon: boolean;
  disabled: boolean;
  isNew: boolean;
  isPopular: boolean;
  isRecommended: boolean;
  requiresLogin: boolean;
  permissions: string[];
  analyticsKey: string;
}

export type OrderStatus = 'draft' | 'pending' | 'received' | 'accepted' | 'printing' | 'binding' | 'quality_check' | 'packed' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected' | 'refunded' | 'failed' | 'on_hold' | string;

export interface CurrentOrder {
  id: string;
  documentName: string;
  status: OrderStatus;
  progress: number; // 0 to 100
  estimatedDeliveryTime?: string;
  amount: number;
  date: string;
  qrCodeUrl?: string;
  deliveryOtp?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    photoUrl?: string;
  };
  liveLocationUrl?: string;
  deliveryPhotoUrl?: string;
}

export interface Highlight {
  id: string;
  priority: number;
  title: string;
  icon?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  expiryDate?: string;
  actionLabel?: string;
  deepLink?: string;
}

export interface Announcement {
  id: string;
  pinned: boolean;
  priority: number;
  expiryDate?: string;
  category: string;
  title: string;
  imageUrl?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  markdownContent?: string;
}

export type SupportActionType = 'WhatsApp' | 'Phone' | 'Email' | 'LiveChat' | 'Ticket' | 'FAQ';

export interface SupportAction {
  type: SupportActionType;
  enabled: boolean;
  supportHours?: string;
  label: string;
  actionUrl: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  enabled: boolean;
  priority: number;
  refreshIntervalMs: number;
  analyticsKey: string;
  rolloutPercentage: number;
}
