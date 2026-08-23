import React from 'react';
import { OrderStatus } from '../types';
import { ORDER_STATUSES } from '../constants/status';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const getBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
      case 'rejected':
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
      case 'pending':
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'printing':
      case 'binding':
      case 'quality_check':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'packed':
      case 'ready_for_pickup':
      case 'out_for_delivery':
      case 'received':
      case 'accepted':
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0',
        getBadgeColor(status),
        className
      )}
    >
      {ORDER_STATUSES[status] || status}
    </span>
  );
};
