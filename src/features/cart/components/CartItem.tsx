"use client";
import React from 'react';
import { CartItem as ICartItem } from '../types';

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove, onEdit }: CartItemProps) => {
  return (
    <div className="flex flex-col p-3.5 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-3">
      <div className="flex gap-3.5">
        <div className="w-[60px] h-[76px] bg-gray-50 rounded-[12px] border border-gray-100 flex items-center justify-center shrink-0">
          <span className="text-xl font-black text-gray-300 uppercase tracking-tighter">{item.serviceType.substring(0,2)}</span>
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <div className="pr-2">
              <h4 className="text-[15px] font-black text-gray-900 leading-tight line-clamp-2">{item.title}</h4>
              <p className="text-[11px] font-semibold text-gray-400 mt-1 leading-snug line-clamp-2">{item.subtitle}</p>
            </div>
            <div className="text-right shrink-0 mt-0.5">
              <span className="font-black text-[16px] text-gray-900">₹{item.priceBreakdown.total}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[9px] uppercase font-bold rounded-md tracking-widest border border-gray-100">
              {item.printOptions.color ? 'Color' : 'B&W'}
            </span>
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[9px] uppercase font-bold rounded-md tracking-widest border border-gray-100">
              {item.printOptions.singleSided ? 'Single-Sided' : 'Double-Sided'}
            </span>
            {item.printOptions.bindingType !== 'none' && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[9px] uppercase font-bold rounded-md tracking-widest border border-gray-100">
                {item.printOptions.bindingType}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <button onClick={() => onEdit(item.id)} className="text-[12px] font-bold text-gray-400 hover:text-gray-900 transition-colors p-1 -m-1">Edit</button>
              <button onClick={() => onRemove(item.id)} className="text-[12px] font-bold text-red-400 hover:text-red-500 transition-colors p-1 -m-1">Remove</button>
            </div>
            
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-[10px] p-1 border border-gray-100">
              <button 
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-[26px] h-[26px] flex items-center justify-center bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] text-gray-700 active:scale-95 transition-transform font-medium"
              >−</button>
              <span className="font-black text-[13px] w-4 text-center text-gray-800">{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-[26px] h-[26px] flex items-center justify-center bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] text-gray-700 active:scale-95 transition-transform font-medium"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
