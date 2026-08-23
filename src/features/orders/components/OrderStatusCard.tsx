import React from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { RefreshCw } from 'lucide-react';
import { OrderStatus } from '../types';
import { formatDate } from '../utils/formatters';

interface OrderStatusCardProps {
  status: OrderStatus;
  date: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const OrderStatusCard = ({ status, date, onRefresh, isRefreshing }: OrderStatusCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-foreground flex-1 min-w-0 truncate">Order Status</h2>
        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh order status"
              title="Refresh order status"
              className="text-muted-foreground hover:text-[#FF6B00] transition-colors p-1.5 rounded-md hover:bg-[#FF6B00]/10 disabled:opacity-50 flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50"
            >
              <span className="hidden sm:inline text-sm font-medium">Refresh</span>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
            </button>
          )}
          <OrderStatusBadge status={status} />
        </div>
      </div>
      <div className="flex justify-between items-end mt-1">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Order Placed On</span>
          <span className="font-medium text-foreground">{formatDate(date)}</span>
        </div>
        {isRefreshing && (
          <span className="text-xs text-[#FF6B00] font-medium animate-pulse">Updating...</span>
        )}
        {!isRefreshing && onRefresh && (
          <span className="text-xs text-muted-foreground">Updated just now</span>
        )}
      </div>
    </div>
  );
};
