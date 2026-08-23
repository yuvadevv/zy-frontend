"use client";
import React from 'react';
import { CurrentOrder } from '../types';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { motion } from 'framer-motion';
import { FileText, Ticket, BookOpen, ChevronRight, Truck, CheckCircle2 } from 'lucide-react';
import { ORDER_STATUSES } from '@/features/orders/constants/status';

interface RecentOrdersProps {
  orders: any[];
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const displayOrders = orders;

  if (!displayOrders || displayOrders.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {displayOrders.slice(0, 3).map((order: any, i) => {
        
        // Determine status dot color
        let statusColor = "bg-gray-400";
        if (['draft', 'pending', 'received', 'accepted'].includes(order.status)) statusColor = "bg-[#FF6B00]";
        else if (['printing', 'binding', 'quality_check'].includes(order.status)) statusColor = "bg-blue-500";
        else if (['packed', 'ready_for_pickup', 'out_for_delivery', 'delivered'].includes(order.status)) statusColor = "bg-green-500";

        // Determine icon styling
        let iconBg = "bg-gray-50 text-gray-500";
        let icon = <FileText className="w-5 h-5" />;
        if (order.type === 'manual') {
          iconBg = "bg-blue-50 text-blue-500";
          icon = <BookOpen className="w-5 h-5" />;
        } else if (order.type === 'hall_ticket') {
          iconBg = "bg-green-50 text-green-500";
          icon = <Ticket className="w-5 h-5" />;
        } else if (order.type === 'custom') {
          iconBg = "bg-orange-50 text-orange-500";
          icon = <FileText className="w-5 h-5" />;
        }

        const isReady = ['packed', 'ready_for_pickup', 'delivered'].includes(order.status);

        return (
          <motion.div 
            key={order.id} 
            whileTap={{ scale: 0.985 }}
            onClick={() => window.location.href = `/app/orders/${order.id}`}
            className="flex items-start p-4 bg-white border border-gray-100 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer group transition-colors hover:border-gray-200"
          >
            <div className={`w-11 h-11 rounded-full flex flex-shrink-0 items-center justify-center mr-3.5 ${iconBg}`}>
              {icon}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0 pr-2">
              <span className="font-bold text-[15px] text-gray-900 leading-tight mb-1 line-clamp-2">
                {order.documentName}
              </span>
              <span className="text-[12px] font-mono font-bold text-gray-400 mb-1.5 truncate">
                {order.id}
              </span>
              <span className="text-[13px] text-gray-500 font-medium truncate mb-2">
                {order.details}
              </span>
              
              <div className="flex items-center gap-1.5 mt-auto">
                {isReady ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Truck className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-[12px] font-bold truncate ${isReady ? 'text-green-600' : 'text-gray-700'}`}>
                  {isReady ? `Ready • Available Today` : `Delivers ${order.eta}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between self-stretch ml-2 flex-shrink-0">
              <span className="font-black text-[16px] text-orange-600">{order.total}</span>
              
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || order.status}</span>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-300 mt-auto group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        );
      })}
      
      {displayOrders.length > 3 && (
        <button 
          onClick={() => window.location.href = '/app/orders'}
          className="w-full mt-1 py-3 text-[13px] font-bold text-[#FF6B00] hover:text-orange-600 transition-colors flex items-center justify-center gap-1.5 group bg-orange-50 rounded-xl"
        >
          View All Orders <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}
    </div>
  );
};


