import React from 'react';
import { DeliveryInfo } from '../types';

interface DeliveryCardProps {
  info?: DeliveryInfo;
  onEdit?: () => void;
}

export const DeliveryCard = ({ info, onEdit }: DeliveryCardProps) => {
  return (
    <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-3">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-[15px] text-gray-900">Delivery Details</h3>
        <button onClick={onEdit} className="text-[13px] font-bold text-[#FF6B00] hover:text-orange-600 p-1 -m-1">Edit</button>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="w-[34px] h-[34px] bg-orange-50 rounded-full flex items-center justify-center text-[#FF6B00] shrink-0 mt-0.5 border border-orange-100/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        
        <div className="flex flex-col">
          {info ? (
            <>
              <span className="font-bold text-[14px] text-gray-900 leading-tight">{info.location}</span>
              <span className="text-[12px] font-medium text-gray-500 mt-0.5">{info.block}, {info.floor} • Room {info.classroom}</span>
            </>
          ) : (
            <>
              <span className="font-bold text-[14px] text-gray-900 text-opacity-50 leading-tight">College Campus</span>
              <span className="text-[12px] font-medium text-gray-400 mt-0.5">Standard Delivery</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
