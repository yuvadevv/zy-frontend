import { ServiceLauncherItem } from '../types';
import { APP_ROUTES } from '@/constants/routes';

export const DEFAULT_LAUNCHER_SERVICES: ServiceLauncherItem[] = [
  {
    id: 'printing',
    label: 'Printing',
    supportingText: 'Academic prints & manuals',
    icon: 'printer',
    href: APP_ROUTES.SERVICES.HUB,
    status: 'active',
    badge: 'ACTIVE',
    analyticsKey: 'service_launcher_printing',
  },
  {
    id: 'food',
    label: 'Food',
    supportingText: 'Canteen & Mess ordering',
    icon: 'food',
    href: APP_ROUTES.CAMPUS_FOOD,
    status: 'active',
    isPrimary: true,
    badge: 'NEW',
    analyticsKey: 'service_launcher_food',
  },
];

