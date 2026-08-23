import { Home, Package, Bell, User } from 'lucide-react';
export type RouteConfig = { title: string; path: string; icon?: React.ElementType; requiresAuth: boolean; };
export const APP_ROUTES: Record<string, RouteConfig> = {
  home: { title: 'Home', path: '/app/home', icon: Home, requiresAuth: true },
  orders: { title: 'Orders', path: '/app/orders', icon: Package, requiresAuth: true },
  notifications: { title: 'Notifications', path: '/app/notifications', icon: Bell, requiresAuth: true },
  profile: { title: 'Profile', path: '/app/profile', icon: User, requiresAuth: true }
};
