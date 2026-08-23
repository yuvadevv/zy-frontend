import { CurrentOrderDTO, QuickServiceDTO, AnnouncementDTO, SupportActionDTO, BaseResponseDTO } from '../dto';



export const STATIC_QUICK_SERVICES: BaseResponseDTO<QuickServiceDTO[]> = {
  data: [
    { id: 'srv_1', title: 'Manuals', icon: 'Book', description: 'College Manuals', color: 'bg-blue-500', route: '/app/services/manuals', enabled: true, coming_soon: false, disabled: false, is_new: false, is_popular: true, is_recommended: false, requires_login: true, permissions: [], badge: 'Popular', analytics_key: 'srv_manuals' },
    { id: 'srv_bus_tracking', title: 'Bus Tracking', icon: 'BusFront', description: 'Track your college bus', color: 'bg-green-600', route: '/app/services/bus-tracking', enabled: true, coming_soon: true, disabled: false, is_new: true, is_popular: false, is_recommended: false, requires_login: true, permissions: [], analytics_key: 'srv_bus' },
    { id: 'srv_2', title: 'Hall Tickets', icon: 'Ticket', description: 'Print instantly', color: 'bg-orange-500', route: '/app/services/hall-tickets', enabled: true, badge: 'Urgent', coming_soon: false, disabled: false, is_new: false, is_popular: false, is_recommended: true, requires_login: true, permissions: [], analytics_key: 'srv_tickets' },
    { id: 'srv_3', title: 'Custom Uploads', icon: 'Upload', description: 'Upload custom documents', color: 'bg-purple-500', route: '/app/services/upload', enabled: true, coming_soon: false, disabled: false, is_new: false, is_popular: false, is_recommended: false, requires_login: true, permissions: [], badge: 'Most Used', analytics_key: 'srv_upload' }
  ],
  meta: { timestamp: new Date().toISOString(), version: '1.0' }
};



export const STATIC_SUPPORT_ACTIONS: BaseResponseDTO<SupportActionDTO[]> = {
  data: [
    { type: 'WHATSAPP', enabled: true, label: 'WhatsApp', action_url: 'https://wa.me/1234567890' },
    { type: 'PHONE', enabled: true, label: 'Call Us', action_url: 'tel:+1234567890', support_hours: '9 AM - 6 PM' },
    { type: 'EMAIL', enabled: true, label: 'Email', action_url: 'mailto:support@blintzy.com' }
  ],
  meta: { timestamp: new Date().toISOString(), version: '1.0' }
};
