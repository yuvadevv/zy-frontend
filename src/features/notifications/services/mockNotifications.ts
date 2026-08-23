// src/features/notifications/services/mockNotifications.ts
import { NotificationItem, NotificationPreference, Announcement } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Order Delivered Successfully 🎉',
    description: 'Your order ORD-123 has been delivered to CSE Dept. Enjoy your print!',
    category: 'ORDER',
    priority: 'HIGH',
    status: 'UNREAD',
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 5), // 5 mins ago
    actions: [
      { actionType: 'ORDER_HISTORY', label: 'View Order', payload: { orderId: 'ORD-123' }, fallbackUrl: '/app/orders' }
    ]
  },
  {
    id: 'NOTIF-2',
    title: 'Payment Failed ⚠️',
    description: 'The payment for order ORD-124 was declined. Please try another payment method.',
    category: 'PAYMENT',
    priority: 'CRITICAL',
    status: 'UNREAD',
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    actions: [
      { actionType: 'CHECKOUT', label: 'Retry Payment', payload: { orderId: 'ORD-124' }, fallbackUrl: '/app/checkout' }
    ]
  },
  {
    id: 'NOTIF-3',
    title: 'New Machine Learning Manual Available',
    description: 'The updated lab manual for 3rd Year CSE is now live. Order your copy today!',
    category: 'ACADEMIC',
    priority: 'NORMAL',
    status: 'READ',
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    actions: [
      { actionType: 'MANUAL', label: 'Order Now', payload: { manualId: 'ML-301' }, fallbackUrl: '/app/services/manuals' }
    ]
  },
  {
    id: 'NOTIF-4',
    title: 'Scheduled Maintenance',
    description: 'Blintzy will be down for maintenance from 2 AM to 4 AM tonight.',
    category: 'SYSTEM',
    priority: 'NORMAL',
    status: 'READ',
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 48), // 2 days ago
  },
  {
    id: 'NOTIF-5',
    title: 'Mid-term Sale! Get 20% off',
    description: 'Use code MIDTERM20 to get a flat 20% off your next print order. Valid till Friday.',
    category: 'PROMOTION',
    priority: 'NORMAL',
    status: 'READ',
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  }
];

export const mockPreferences: NotificationPreference[] = [
  { id: 'PUSH', label: 'Push Notifications', description: 'Receive real-time push notifications on this device.', enabled: true },
  { id: 'EMAIL', label: 'Email Notifications', description: 'Receive order summaries and invoices via email.', enabled: true },
  { id: 'SMS', label: 'SMS Alerts', description: 'Get quick SMS alerts for order deliveries.', enabled: false },
  { id: 'WHATSAPP', label: 'WhatsApp Updates', description: 'Receive delivery agent details on WhatsApp.', enabled: true },
  { id: 'TRANSACTIONAL', label: 'Order & Payments', description: 'Updates about your active orders and payments.', enabled: true, isSystemMandatory: true },
  { id: 'MARKETING', label: 'Offers & Promotions', description: 'Discounts, seasonal sales, and promo codes.', enabled: true },
  { id: 'ANNOUNCEMENTS', label: 'College Announcements', description: 'Important updates regarding new manuals and syllabus changes.', enabled: true },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ANN-1',
    title: 'Exam Season Printing Demand',
    message: 'Due to high demand, expect a 2-hour delay in print deliveries. Order early!',
    isPinned: true,
    priority: 'HIGH',
  },
  {
    id: 'ANN-2',
    title: 'Refer a Friend!',
    message: 'Invite your friends to Blintzy and get 50 free pages printed.',
    isPinned: false,
    priority: 'NORMAL',
    cta: { actionType: 'SHARE', label: 'Invite Now' }
  }
];
