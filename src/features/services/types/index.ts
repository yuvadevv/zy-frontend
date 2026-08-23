export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  image?: string;
  route: string;
  enabled: boolean;
  disabled: boolean;
  hidden: boolean;
  comingSoon: boolean;
  isNew: boolean;
  featured: boolean;
  beta: boolean;
  maintenance: boolean;
  badge?: string;
  color: string;
  analyticsKey: string;
  estimatedTime?: string;
  estimatedPrice?: number;
  availability?: string;
  futureBanner?: string;
  futureDiscount?: string;
  permissions: string[];
  categoryIds: string[];
}

export interface Category {
  id: string;
  label: string;
  priority: number;
}

export interface FeaturedService {
  id: string;
  serviceId: string;
  priority: number;
  displayOrder: number;
  expiry?: string;
  campaign?: string;
  deepLink?: string;
}
