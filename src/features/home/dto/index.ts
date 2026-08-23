export interface BaseResponseDTO<T> {
  data: T;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface QuickServiceDTO {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  route: string;
  enabled: boolean;
  badge?: string;
  coming_soon: boolean;
  disabled: boolean;
  is_new: boolean;
  is_popular: boolean;
  is_recommended: boolean;
  requires_login: boolean;
  permissions: string[];
  analytics_key: string;
}

export type OrderStatusDTO = 'RECEIVED' | 'PRINTING' | 'BINDING' | 'QUALITY_CHECK' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REJECTED' | 'ON_HOLD';

export interface CurrentOrderDTO {
  id: string;
  document_name: string;
  status: OrderStatusDTO;
  progress: number;
  estimated_delivery_time?: string;
  amount: number;
  date: string;
  qr_code_url?: string;
  delivery_otp?: string;
  delivery_person?: {
    name: string;
    phone: string;
    photo_url?: string;
  };
  live_location_url?: string;
  delivery_photo_url?: string;
}

export interface HighlightDTO {
  id: string;
  priority: number;
  title: string;
  icon?: string;
  background_color?: string;
  background_image_url?: string;
  expiry_date?: string;
  action_label?: string;
  deep_link?: string;
}

export interface AnnouncementDTO {
  id: string;
  pinned: boolean;
  priority: number;
  expiry_date?: string;
  category: string;
  title: string;
  image_url?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  markdown_content?: string;
}

export type SupportActionTypeDTO = 'WHATSAPP' | 'PHONE' | 'EMAIL' | 'LIVE_CHAT' | 'TICKET' | 'FAQ';

export interface SupportActionDTO {
  type: SupportActionTypeDTO;
  enabled: boolean;
  support_hours?: string;
  label: string;
  action_url: string;
}

export interface WidgetConfigDTO {
  id: string;
  title: string;
  enabled: boolean;
  priority: number;
  refresh_interval_ms: number;
  analytics_key: string;
  rollout_percentage: number;
}
