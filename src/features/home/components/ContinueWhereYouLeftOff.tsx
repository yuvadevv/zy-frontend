"use client";
import React from 'react';
import { CurrentOrder } from '../types';
import { motion } from 'framer-motion';

interface Props {
  activeOrder: CurrentOrder | null;
}

export const ContinueWhereYouLeftOff = ({ activeOrder }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-gray-500 tracking-wide uppercase px-1">Continue Where You Left Off</h2>
      
      {activeOrder ? (
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/app/orders'}
          className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] p-4 shadow-sm hover:border-gray-200 text-left"
        >
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm">Track Order</span>
            <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{activeOrder.documentName}</span>
          </div>
          <span className="text-orange-500 font-bold">&rarr;</span>
        </motion.button>
      ) : (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => window.location.href = '/app/services'}
            className="flex-shrink-0 snap-center flex flex-col justify-center items-start gap-1 bg-gray-50 border border-gray-100 rounded-[20px] p-4 w-[140px]"
          >
            <span className="text-xl">🖨️</span>
            <span className="font-bold text-gray-900 text-sm">Start Printing</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => window.location.href = '/app/services/manuals'}
            className="flex-shrink-0 snap-center flex flex-col justify-center items-start gap-1 bg-gray-50 border border-gray-100 rounded-[20px] p-4 w-[140px]"
          >
            <span className="text-xl">📚</span>
            <span className="font-bold text-gray-900 text-sm">Browse Manuals</span>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => window.location.href = '/app/services/hall-tickets'}
            className="flex-shrink-0 snap-center flex flex-col justify-center items-start gap-1 bg-gray-50 border border-gray-100 rounded-[20px] p-4 w-[140px]"
          >
            <span className="text-xl">🎫</span>
            <span className="font-bold text-gray-900 text-sm">Hall Tickets</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
