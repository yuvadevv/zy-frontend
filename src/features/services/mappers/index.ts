import { ServiceDTO, CategoryDTO, FeaturedServiceDTO } from '../dto';
import { Service, Category, FeaturedService } from '../types';

export const mapService = (dto: ServiceDTO): Service => ({
  id: dto.id,
  title: dto.title,
  subtitle: dto.subtitle,
  description: dto.description,
  icon: dto.icon,
  image: dto.image,
  route: dto.route,
  enabled: dto.enabled,
  disabled: !!dto.disabled,
  hidden: !!dto.hidden,
  comingSoon: !!dto.coming_soon,
  isNew: !!dto.is_new,
  featured: !!dto.featured,
  beta: !!dto.beta,
  maintenance: !!dto.maintenance,
  badge: dto.badge,
  color: dto.color,
  analyticsKey: dto.analytics_key,
  estimatedTime: dto.estimated_time,
  estimatedPrice: dto.estimated_price,
  availability: dto.availability,
  futureBanner: dto.future_banner,
  futureDiscount: dto.future_discount,
  permissions: dto.permissions || [],
  categoryIds: dto.category_ids || [],
});

export const mapCategory = (dto: CategoryDTO): Category => ({
  id: dto.id,
  label: dto.label,
  priority: dto.priority,
});

export const mapFeaturedService = (dto: FeaturedServiceDTO): FeaturedService => ({
  id: dto.id,
  serviceId: dto.service_id,
  priority: dto.priority,
  displayOrder: dto.display_order,
  expiry: dto.expiry,
  campaign: dto.campaign,
  deepLink: dto.deep_link,
});
