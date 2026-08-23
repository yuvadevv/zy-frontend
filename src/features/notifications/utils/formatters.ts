// src/features/notifications/utils/formatters.ts

export type TimeGroup = 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'EARLIER';

export const getNotificationTimeGroup = (date: Date): TimeGroup => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const targetDate = new Date(date);
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffTime = Math.abs(today.getTime() - targetDay.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  if (diffDays <= 7) return 'THIS_WEEK';
  return 'EARLIER';
};

export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
