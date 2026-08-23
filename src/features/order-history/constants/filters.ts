// src/features/order-history/constants/filters.ts
import { HistoryFilterStatus, HistorySortOption } from '../types';

export const HISTORY_FILTER_OPTIONS: { label: string; value: HistoryFilterStatus }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'Active', value: 'accepted' }, // Simplified mapping for UI
  { label: 'Pending', value: 'pending' },
  { label: 'Printing', value: 'printing' },
  { label: 'Binding', value: 'binding' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Rejected', value: 'rejected' },
];

export const HISTORY_SORT_OPTIONS: { label: string; value: HistorySortOption }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Amount', value: 'highest_amount' },
  { label: 'Lowest Amount', value: 'lowest_amount' },
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Recent Activity', value: 'recent_activity' },
];
