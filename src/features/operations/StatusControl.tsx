import React, { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminClient } from '@/lib/api/adminClient';
import { vendorClient } from '@/lib/api/vendorClient';

export const VALID_TRANSITIONS: Record<string, string[]> = {
  'received': ['accepted', 'printing', 'rejected'],
  'accepted': ['printing', 'cancelled'],
  'printing': ['binding', 'quality_check', 'ready_for_pickup'],
  'binding': ['quality_check'],
  'quality_check': ['ready_for_pickup', 'printing'],
  'ready_for_pickup': ['delivered', 'out_for_delivery'],
  'out_for_delivery': ['delivered', 'failed'],
  'delivered': [],
  'cancelled': [],
  'rejected': [],
  'failed': ['out_for_delivery', 'cancelled']
};

export const STATUS_LABELS: Record<string, string> = {
  'received': 'Received',
  'accepted': 'Accepted',
  'printing': 'Printing',
  'binding': 'Binding',
  'quality_check': 'Quality Check',
  'ready_for_pickup': 'Ready for Pickup',
  'out_for_delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  'rejected': 'Rejected',
  'failed': 'Failed'
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'received': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'accepted': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'printing':
    case 'binding':
    case 'quality_check': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'ready_for_pickup': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'out_for_delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
    case 'cancelled':
    case 'rejected':
    case 'failed': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

interface StatusControlProps {
  orderId: string;
  currentStatus: string;
  clientType: 'admin' | 'vendor';
  onUpdated?: () => void;
}

export function StatusControl({ orderId, currentStatus, clientType, onUpdated }: StatusControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const status = currentStatus || 'received';
  const isAdmin = clientType === 'admin';
  const allowedNext = isAdmin ? Object.keys(STATUS_LABELS) : (VALID_TRANSITIONS[status] || []);
  
  const handleUpdate = async (newStatus: string) => {
    setIsOpen(false);
    if (newStatus === status) return;
    
    setIsUpdating(true);
    try {
      const client = isAdmin ? adminClient : vendorClient;
      await client.updateOrderStatus(orderId, newStatus, status);
      toast.success('Status updated successfully');
      if (onUpdated) onUpdated();
    } catch (err: any) {
      if (err.status === 409 || err.message?.includes('elsewhere') || err.message?.includes('Concurrency')) {
        toast.error('This order was updated by someone else. Refreshing...', { duration: 4000 });
        if (onUpdated) onUpdated();
      } else {
        toast.error(err.message || 'Status update failed');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const colorClass = getStatusColor(status);
  
  if (allowedNext.length === 0) {
    // Read-only badge if no valid transitions
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${colorClass}`}>
        {STATUS_LABELS[status] || status}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider transition-colors hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#FF6B00] ${colorClass} ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isUpdating ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            Updating...
          </>
        ) : (
          <>
            {STATUS_LABELS[status] || status}
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="origin-top-right absolute left-0 mt-1 w-40 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 animate-in fade-in zoom-in-95 duration-100">
            <div className="py-1" role="menu">
              {isAdmin && (
                <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mr-1.5"></span>
                  Admin Override
                </div>
              )}
              {allowedNext.map(next => (
                <button
                  key={next}
                  onClick={() => handleUpdate(next)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${next === status ? 'bg-orange-50 text-[#FF6B00] font-bold' : 'text-gray-700'}`}
                  role="menuitem"
                >
                  {STATUS_LABELS[next] || next}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
