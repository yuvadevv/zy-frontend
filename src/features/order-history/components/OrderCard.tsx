import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Package, FileText, ChevronRight } from 'lucide-react';
import { OrderHistoryItem } from '../types';
import { formatHistoryDate, formatHistoryCurrency } from '../utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ReorderButton } from './ReorderButton';
import { OrderActionsMenu } from './OrderActionsMenu';
import { APP_ROUTES } from '@/constants/routes';
import { motion, PanInfo } from 'framer-motion';

interface OrderCardProps {
  order: OrderHistoryItem;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTrack = () => {
    router.push(APP_ROUTES.ORDERS.DETAILS(order.id));
  };

  const handleReorder = () => {
    // Analytics/Reorder Logic here
    router.push(APP_ROUTES.CHECKOUT); // Example route
  };

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      // Trigger long press bottom sheet (Actions Menu)
      // For now we simulate by triggering a custom event or state
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      alert('Long Press Detected: Open Actions Menu');
    }, 500);
  };

  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handlePanEnd = (e: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleTrack(); // Swipe left to track
    } else if (info.offset.x > threshold) {
      handleReorder(); // Swipe right to reorder
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      onPanEnd={handlePanEnd}
      onTapStart={startPress}
      onTap={endPress}
      onTapCancel={endPress}
      onClick={handleTrack}
      whileTap={{ scale: 0.97, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
      className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-orange-500/50 transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">{order.id}</span>
            <span className="text-[12px] text-gray-500 font-medium">{formatHistoryDate(order.createdAt)}</span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-2 mt-1 pointer-events-none">
        {order.documentNames.map((name, i) => (
          <div key={i} className="flex items-start gap-2 text-[14px] text-gray-700 font-medium">
            <FileText className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" strokeWidth={1.5} />
            <span className="line-clamp-1">{name}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-1">
        <div className="flex flex-col pointer-events-none">
          <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Total</span>
          <span className="font-black text-gray-900 text-[16px]">{formatHistoryCurrency(order.totalAmount)}</span>
        </div>
        
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <ReorderButton orderId={order.id} variant="icon" />
          <OrderActionsMenu 
            orderId={order.id} 
            order={order}
          />
          <div 
            onClick={handleTrack}
            className="text-[#FF6B00] text-[14px] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform ml-1 cursor-pointer py-2 pl-2"
          >
            Details
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
