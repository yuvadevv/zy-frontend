import { QuickServiceDTO, CurrentOrderDTO, HighlightDTO, AnnouncementDTO, SupportActionDTO, WidgetConfigDTO } from '../dto';
import { QuickService, CurrentOrder, Highlight, Announcement, SupportAction, WidgetConfig } from '../types';

export const mapQuickService = (dto: QuickServiceDTO): QuickService => ({
  id: dto.id,
  title: dto.title,
  icon: dto.icon,
  description: dto.description,
  color: dto.color,
  route: dto.route,
  enabled: dto.enabled,
  badge: dto.badge,
  comingSoon: dto.coming_soon,
  disabled: dto.disabled,
  isNew: dto.is_new,
  isPopular: dto.is_popular,
  isRecommended: dto.is_recommended,
  requiresLogin: dto.requires_login,
  permissions: dto.permissions,
  analyticsKey: dto.analytics_key,
});

export const mapCurrentOrder = (dto: CurrentOrderDTO): CurrentOrder => ({
  id: dto.id,
  documentName: dto.document_name,
  status: dto.status === 'OUT_FOR_DELIVERY' ? 'OutForDelivery' : dto.status === 'QUALITY_CHECK' ? 'QualityCheck' : dto.status === 'ON_HOLD' ? 'OnHold' : dto.status.charAt(0) + dto.status.slice(1).toLowerCase() as any,
  progress: dto.progress,
  estimatedDeliveryTime: dto.estimated_delivery_time,
  amount: dto.amount,
  date: dto.date,
  qrCodeUrl: dto.qr_code_url,
  deliveryOtp: dto.delivery_otp,
  deliveryPerson: dto.delivery_person ? {
    name: dto.delivery_person.name,
    phone: dto.delivery_person.phone,
    photoUrl: dto.delivery_person.photo_url,
  } : undefined,
  liveLocationUrl: dto.live_location_url,
  deliveryPhotoUrl: dto.delivery_photo_url,
});

export const mapHighlight = (dto: HighlightDTO): Highlight => ({
  id: dto.id,
  priority: dto.priority,
  title: dto.title,
  icon: dto.icon,
  backgroundColor: dto.background_color,
  backgroundImageUrl: dto.background_image_url,
  expiryDate: dto.expiry_date,
  actionLabel: dto.action_label,
  deepLink: dto.deep_link,
});

export const mapAnnouncement = (dto: AnnouncementDTO): Announcement => ({
  id: dto.id,
  pinned: dto.pinned,
  priority: dto.priority,
  expiryDate: dto.expiry_date,
  category: dto.category,
  title: dto.title,
  imageUrl: dto.image_url,
  ctaButtonText: dto.cta_button_text,
  ctaButtonLink: dto.cta_button_link,
  markdownContent: dto.markdown_content,
});

export const mapSupportAction = (dto: SupportActionDTO): SupportAction => ({
  type: dto.type === 'LIVE_CHAT' ? 'LiveChat' : dto.type === 'WHATSAPP' ? 'WhatsApp' : dto.type.charAt(0) + dto.type.slice(1).toLowerCase() as any,
  enabled: dto.enabled,
  supportHours: dto.support_hours,
  label: dto.label,
  actionUrl: dto.action_url,
});

export const mapWidgetConfig = (dto: WidgetConfigDTO): WidgetConfig => ({
  id: dto.id,
  title: dto.title,
  enabled: dto.enabled,
  priority: dto.priority,
  refreshIntervalMs: dto.refresh_interval_ms,
  analyticsKey: dto.analytics_key,
  rolloutPercentage: dto.rollout_percentage,
});
