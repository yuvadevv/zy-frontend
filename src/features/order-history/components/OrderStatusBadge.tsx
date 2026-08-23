// src/features/order-history/components/OrderStatusBadge.tsx
import React from 'react';
import { OrderStatus } from '@/features/orders/types';
import { twMerge } from 'tailwind-merge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
      case 'rejected':
      case 'refunded':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'ready_for_pickup':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getLabel = (status: OrderStatus) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <span className={twMerge(
      "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
      getBadgeStyle(status)
    )}>
      {getLabel(status)}
    </span>
  );
};
