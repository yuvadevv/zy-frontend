"use client";
import React, { useState, useEffect } from 'react';
import { CurrentOrder } from '../types';
import { OrderProgressTimeline } from './OrderProgressTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, RefreshCw } from 'lucide-react';
import { ORDER_STATUSES } from '@/features/orders/constants/status';

interface CurrentOrderHeroProps {
  orders: CurrentOrder[] | null;
  onTrackOrder?: (id: string) => void;
  onRefresh?: (id: string) => void;
  refreshingOrderId?: string | null;
}

export const CurrentOrderHero = ({ orders, onTrackOrder, onRefresh, refreshingOrderId }: CurrentOrderHeroProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!orders || orders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % orders.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [orders]);

  if (!orders || orders.length === 0) {
    return null;
  }

  const order = orders[current];

  const formattedEta = order.estimatedDeliveryTime || 'Updating soon';

  return (
    <div className="w-full relative">
      <div className="relative overflow-hidden w-full rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 bg-white">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full px-5 py-3 flex flex-col h-[220px] justify-between"
          >
            {/* Status Chip */}
            <div className="h-[20px] flex items-center mb-1">
              <span className="text-[13px] font-bold text-orange-500 flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || order.status}
              </span>
            </div>
            
            {/* Document Row */}
            <div className="flex items-start gap-3 h-[60px] mb-2">
              <FileText className="w-7 h-7 text-gray-400 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col flex-1 h-full min-w-0">
                <h3 className="h-[44px] text-[18px] font-black text-gray-900 leading-tight line-clamp-2 overflow-hidden">{order.documentName}</h3>
                <span className="h-[16px] text-[13px] font-medium text-gray-400 mt-auto flex items-end">Order #{order.id.replace('ORD-', '')}</span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="h-[40px] flex flex-col justify-end mb-3">
              <OrderProgressTimeline status={order.status} progress={order.progress} />
            </div>

            {/* Bottom Row */}
            <div className="flex flex-row flex-nowrap justify-between items-center mt-auto h-[44px] gap-2 overflow-hidden">
              <div className="flex flex-row items-center justify-between bg-gray-50 px-2 sm:px-3 h-[44px] flex-1 rounded-[16px] min-w-0 overflow-hidden">
                <span className="text-[12px] font-medium text-gray-500 tracking-tight mr-1 shrink-0">ETA</span>
                <span className="text-[13px] font-semibold text-gray-900 whitespace-nowrap tracking-tight overflow-hidden text-ellipsis">{formattedEta}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {onRefresh && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefresh(order.id);
                    }}
                    disabled={refreshingOrderId === order.id}
                    className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-gray-200 rounded-full text-orange-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    aria-label="Refresh order status"
                    title="Refresh order status"
                  >
                    <RefreshCw className={`w-5 h-5 ${refreshingOrderId === order.id ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => {
                    if (onTrackOrder) {
                      onTrackOrder(order.id);
                    } else {
                      window.location.href = `/app/orders/${order.id}`;
                    }
                  }}
                  className="w-auto min-w-[130px] sm:min-w-[140px] px-3 h-[44px] bg-[#FF6B00] text-white font-bold rounded-[16px] text-[14px] shadow-md shadow-orange-500/20 shrink-0 flex items-center justify-center whitespace-nowrap"
                >
                  Track Order
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {orders.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {orders.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className="p-2 -m-2 cursor-pointer"
              aria-label={`Go to order ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-orange-500' : 'w-1.5 bg-gray-200'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

