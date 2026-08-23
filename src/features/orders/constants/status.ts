import { OrderStatus } from '../types';

export const ORDER_STATUSES: Record<OrderStatus, string> = {
  draft: 'Draft',
  pending: 'Pending Payment',
  received: 'Order Received',
  accepted: 'Order Accepted',
  printing: 'Printing in Progress',
  binding: 'Binding in Progress',
  quality_check: 'Quality Check',
  packed: 'Packed & Ready',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  refunded: 'Refunded',
  failed: 'Failed',
  on_hold: 'On Hold'
};

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'received',
  'accepted',
  'printing',
  'binding',
  'quality_check',
  'packed',
  'out_for_delivery',
];

export const isOrderActive = (status: OrderStatus) => ACTIVE_ORDER_STATUSES.includes(status);
export const isOrderCancellable = (status: OrderStatus) => ['received', 'accepted', 'pending'].includes(status);
