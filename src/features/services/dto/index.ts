export interface BaseResponseDTO<T> {
  data: T;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface ServiceDTO {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  image?: string;
  route: string;
  enabled: boolean;
  disabled?: boolean;
  hidden?: boolean;
  coming_soon?: boolean;
  is_new?: boolean;
  featured?: boolean;
  beta?: boolean;
  maintenance?: boolean;
  badge?: string;
  color: string;
  analytics_key: string;
  estimated_time?: string;
  estimated_price?: number;
  availability?: string;
  future_banner?: string;
  future_discount?: string;
  permissions: string[];
  category_ids: string[];
}

export interface CategoryDTO {
  id: string;
  label: string;
  priority: number;
}

export interface FeaturedServiceDTO {
  id: string;
  service_id: string;
  priority: number;
  display_order: number;
  expiry?: string;
  campaign?: string;
  deep_link?: string;
}
