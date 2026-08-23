import React from 'react';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { motion } from 'framer-motion';

const V2_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Printing', value: 'printing', color: 'text-orange-600' },
  { label: 'Pending', value: 'pending', color: 'text-yellow-600' },
  { label: 'Ready', value: 'ready', color: 'text-blue-600' },
  { label: 'Delivered', value: 'delivered', color: 'text-green-600' },
  { label: 'Cancelled', value: 'cancelled', color: 'text-red-600' },
  { label: 'Refunded', value: 'refunded', color: 'text-purple-600' }
];

export const OrderFilters = () => {
  const { filter, setFilter } = useOrderHistory();

  const handleSelect = (val: string) => {
    if (val === 'all') {
      setFilter(undefined);
    } else {
      setFilter({ status: val as any });
    }
  };

  const currentVal = filter?.status || 'all';

  return (
    <div className="w-full px-5 overflow-x-auto hide-scrollbar py-3">
      <div className="flex gap-2.5 min-w-max pb-1">
        {V2_FILTERS.map(opt => {
          const isActive = currentVal === opt.value;
          return (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelect(opt.value)}
              className={`relative px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors z-10 ${isActive ? 'text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-[#FF6B00] rounded-full shadow-[0_4px_14px_rgba(255,107,0,0.3)] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
