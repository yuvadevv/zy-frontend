'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { Printer, CheckCircle, Package, ArrowLeft, Download, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-hot-toast';

export default function PrintingQueuePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('received,accepted,printing,binding,quality_check');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [data, profile] = await Promise.all([
        vendorClient.getOrders({
          page: 1, limit: 100, search, status: statusTab, sort: 'oldest'
        }),
        vendorClient.getProfile()
      ]);
      
      setOrders(data.orders);
      setCurrentVendorId(profile.id);
    } catch (err: any) {
      setError(err.message || 'Failed to load printing queue');
    } finally {
      setLoading(false);
    }
  }, [search, statusTab]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleStatusUpdate = async (id: string, newStatus: string, currentStatus: string) => {
    try {
      setUpdatingId(id);
      await vendorClient.updateOrderStatus(id, newStatus, currentStatus);
      toast.success('Order status advanced successfully');
      loadData();
    } catch (err: any) {
      if (err.message?.includes('409') || err.message?.includes('Concurrency')) {
        toast.error('This order was updated by someone else. Refreshing...');
        loadData();
      } else {
        toast.error(err.message || 'Failed to update order status');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'received': return { label: 'Accept Order', next: 'accepted' };
      case 'accepted': return { label: 'Start Printing', next: 'printing' };
      case 'printing': return { label: 'Mark Printed (QC)', next: 'quality_check' };
      case 'binding': return { label: 'Finish Binding (QC)', next: 'quality_check' };
      case 'quality_check': return { label: 'Pack Order', next: 'packed' };
      default: return null;
    }
  };

  const tabs = [
    { label: 'All Active', val: 'received,accepted,printing,binding,quality_check' },
    { label: 'New (Received)', val: 'received' },
    { label: 'Accepted', val: 'accepted' },
    { label: 'Printing', val: 'printing' },
    { label: 'Binding', val: 'binding' },
    { label: 'QC', val: 'quality_check' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <Printer className="w-8 h-8 mr-3 text-[#FF6B00]" />
            Printing Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">All orders in the active production pipeline — global pool.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.val}
                  onClick={() => setStatusTab(tab.val)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    statusTab === tab.val ? 'bg-[#FF6B00] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]"
              />
            </div>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading queue...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
            <p>Queue is clear! All caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((o: any) => {
              const action = getNextAction(o.status);
              return (
                <div key={o.publicId} className="p-4 md:p-6 hover:bg-orange-50/10 transition-colors flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900">{o.publicId}</h3>
                          <StatusBadge status={o.status} />
                        </div>
                        <p className="font-medium text-gray-900">{o.student?.name || 'Not provided'}</p>
                        <p className="text-sm text-gray-500">{o.student?.rollNumber || 'Not provided'}</p>
                      </div>
                      <Link href={`/vendor/orders/${o.publicId}`} className="text-sm font-semibold text-[#FF6B00] hover:underline">
                        View Details
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Items</p>
                        <p className="font-bold text-black">{o.items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Copies</p>
                        <p className="font-bold text-black">{o.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase font-bold">First Item Details</p>
                        <p className="text-sm font-medium text-black truncate">{o.items?.[0]?.title || 'Document'}</p>
                        <p className="text-xs text-gray-600">{o.items?.[0]?.pages} pages • {o.items?.[0]?.printType === 'color' ? 'Color' : 'B&W'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-3">
                    {/* For 'received' status — any vendor can claim */}
                    {o.status === 'received' && !o.vendorId && action ? (
                      <button
                        onClick={() => handleStatusUpdate(o.publicId, action.next, o.status)}
                        disabled={updatingId === o.publicId}
                        className="w-full py-3 px-4 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#e66000] disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {updatingId === o.publicId ? 'Accepting...' : 'Accept Order'}
                      </button>
                    ) : o.vendorId === currentVendorId && action ? (
                      // Only owner can advance status
                      <button
                        onClick={() => handleStatusUpdate(o.publicId, action.next, o.status)}
                        disabled={updatingId === o.publicId}
                        className="w-full py-3 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {updatingId === o.publicId ? 'Updating...' : action.label}
                      </button>
                    ) : o.vendorId && o.vendorId !== currentVendorId ? (
                      <span className="text-xs text-blue-600 font-semibold text-center">Processing by other vendor</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
