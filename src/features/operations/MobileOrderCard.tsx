import React from 'react';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { StatusControl } from './StatusControl';
import { formatMoney, formatDate, formatCompactETA } from '@/utils/formatters';

interface MobileOrderCardProps {
  order: any;
  selected: boolean;
  onSelect: (id: string) => void;
  clientType: 'admin' | 'vendor';
  onUpdated: () => void;
}

export function MobileOrderCard({ order, selected, onSelect, clientType, onUpdated }: MobileOrderCardProps) {
  const manageRoute = clientType === 'admin' ? `/admin/orders/${order.publicId}` : `/vendor/orders/${order.publicId}`;
  
  return (
    <div className={`bg-white rounded-[20px] p-4 shadow-sm border ${selected ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-gray-200'} transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] w-5 h-5 mt-0.5"
            checked={selected}
            onChange={() => onSelect(order.publicId)}
          />
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">ORDER ID</div>
            <div className="font-bold text-gray-900 font-mono text-sm tracking-tight">{order.publicId}</div>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-medium whitespace-nowrap">{formatDate(order.createdAt, true)}</div>
      </div>
      
      <div className="mb-4">
        <div className="font-bold text-gray-900 text-sm">{order.student?.name || 'Not provided'}</div>
        <div className="text-xs font-medium text-[#FF6B00] mt-0.5">{order.student?.rollNumber || '-'}</div>
        <div className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider bg-gray-50 p-1.5 rounded-md inline-block">
          {order.academic?.branchCode || '-'} {order.academic?.yearLabel ? `• ${order.academic.yearLabel}` : ''} {order.academic?.semesterLabel ? `• ${order.academic.semesterLabel}` : ''}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <div className="text-sm font-bold text-gray-700 mb-1">Items</div>
        <div className="space-y-1">
          {order.items?.length > 0 ? (
            order.items.map((m: any, i: number) => (
              <div key={i} className="text-xs font-medium text-gray-600 flex justify-between">
                <span className="truncate pr-2">{m.title}</span>
                <span className="shrink-0 font-bold">{m.quantity}x</span>
              </div>
            ))
          ) : (
            <div className="text-xs font-medium text-gray-500">Custom Documents</div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between mb-4 border-b border-gray-100 pb-4">
        <div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Amount</div>
          <div className="font-black text-gray-900 text-base">{formatMoney(order.pricing?.grandTotal)}</div>
        </div>
        <div className={`text-xs font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
          {order.paymentStatus || 'Pending'}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</div>
          <StatusControl orderId={order.publicId} currentStatus={order.status} clientType={clientType} onUpdated={onUpdated} />
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">ETA</div>
          <div className="text-xs font-bold text-gray-700 flex items-center justify-end">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            {formatCompactETA(order.estimatedDelivery)}
          </div>
        </div>
      </div>
      
      <Link 
        href={manageRoute}
        className="flex items-center justify-center w-full py-2.5 bg-gray-50 border border-gray-200 text-gray-800 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
      >
        Manage Order
      </Link>
    </div>
  );
}
