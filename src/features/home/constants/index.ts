import { WidgetConfig } from '../types';

export const DASHBOARD_WIDGETS: WidgetConfig[] = [
  { id: 'greeting', title: 'Greeting', enabled: true, priority: 1, refreshIntervalMs: 0, analyticsKey: 'dashboard_greeting', rolloutPercentage: 100 },
  { id: 'continue_left_off', title: 'Continue Where You Left Off', enabled: true, priority: 2, refreshIntervalMs: 0, analyticsKey: 'dashboard_continue_left_off', rolloutPercentage: 100 },
  { id: 'current_order', title: 'Current Order', enabled: true, priority: 3, refreshIntervalMs: 15000, analyticsKey: 'dashboard_current_order', rolloutPercentage: 100 },
  { id: 'promo_banners', title: 'Promotions', enabled: true, priority: 4, refreshIntervalMs: 0, analyticsKey: 'dashboard_promo_banners', rolloutPercentage: 100 },
  { id: 'todays_highlights', title: 'Highlights', enabled: true, priority: 5, refreshIntervalMs: 300000, analyticsKey: 'dashboard_highlights', rolloutPercentage: 100 },
  { id: 'quick_services', title: 'Quick Services', enabled: true, priority: 6, refreshIntervalMs: 3600000, analyticsKey: 'dashboard_quick_services', rolloutPercentage: 100 },
  { id: 'announcements', title: 'Announcements', enabled: true, priority: 7, refreshIntervalMs: 600000, analyticsKey: 'dashboard_announcements', rolloutPercentage: 100 },
  { id: 'bus_tracking', title: 'Bus Tracking', enabled: true, priority: 8, refreshIntervalMs: 0, analyticsKey: 'dashboard_bus_tracking', rolloutPercentage: 100 },
  { id: 'recent_orders', title: 'Recent Orders', enabled: true, priority: 9, refreshIntervalMs: 600000, analyticsKey: 'dashboard_recent_orders', rolloutPercentage: 100 },
  { id: 'support', title: 'Support', enabled: true, priority: 10, refreshIntervalMs: 86400000, analyticsKey: 'dashboard_support', rolloutPercentage: 100 },
];
