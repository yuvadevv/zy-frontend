'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { Package, CheckCircle, Search, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-hot-toast';

export default function ReadyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('packed,ready_for_pickup,out_for_delivery,failed');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await vendorClient.getOrders({
        page: 1, limit: 100, search, status: statusTab, sort: 'oldest'
      });
      
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || 'Failed to load ready orders');
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
      toast.success('Order status updated');
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

  const getNextActions = (status: string, deliveryType: string) => {
    switch (status) {
      case 'packed': 
        return deliveryType === 'Classroom' || deliveryType === 'Hostel' 
          ? [{ label: 'Out for Delivery', next: 'out_for_delivery' }] 
          : [{ label: 'Ready for Pickup', next: 'ready_for_pickup' }];
      case 'ready_for_pickup': 
        return [{ label: 'Mark Collected', next: 'delivered', bg: 'bg-green-600 hover:bg-green-700' }];
      case 'out_for_delivery': 
        return [
          { label: 'Mark Delivered', next: 'delivered', bg: 'bg-green-600 hover:bg-green-700' },
          { label: 'Delivery Failed', next: 'failed', bg: 'bg-red-600 hover:bg-red-700' }
        ];
      case 'failed':
        return [{ label: 'Retry Delivery', next: 'out_for_delivery' }];
      default: return [];
    }
  };

  const tabs = [
    { label: 'All Ready', val: 'packed,ready_for_pickup,out_for_delivery,failed' },
    { label: 'Packed', val: 'packed' },
    { label: 'Ready for Pickup', val: 'ready_for_pickup' },
    { label: 'Out for Delivery', val: 'out_for_delivery' },
    { label: 'Failed', val: 'failed' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-emerald-600" />
            Ready Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage completed orders ready for pickup or delivery.</p>
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
                    statusTab === tab.val ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
                placeholder="Search ID/Roll..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
            <p>No orders pending delivery or pickup!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((o: any) => {
              const actions = getNextActions(o.status, o.delivery?.type || 'Classroom');
              return (
                <div key={o.publicId} className="p-4 md:p-6 hover:bg-emerald-50/20 transition-colors flex flex-col md:flex-row gap-6">
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
                      <Link href={`/vendor/orders/${o.publicId}`} className="text-sm font-semibold text-emerald-600 hover:underline">
                        View Details
                      </Link>
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {o.delivery?.type === 'Pickup' ? (
                        <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                      ) : (
                        <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{o.delivery?.type || 'Classroom'} {o.delivery?.type === 'Pickup' ? '' : 'Delivery'}</p>
                        {o.delivery?.type !== 'Pickup' && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-900 font-medium">Building: {o.delivery?.building || 'Not specified'}</p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              Room: {o.delivery?.room || 'Not specified'}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2 font-medium">Payment: {o.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-3">
                    {actions.map((action: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleStatusUpdate(o.publicId, action.next, o.status)}
                        disabled={updatingId === o.publicId}
                        className={`w-full py-3 px-4 text-white font-bold rounded-lg disabled:opacity-50 transition-colors shadow-sm ${action.bg || 'bg-black hover:bg-gray-800'}`}
                      >
                        {updatingId === o.publicId ? 'Updating...' : action.label}
                      </button>
                    ))}
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
