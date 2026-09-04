'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, ArrowLeft, Store, Mail, Phone, MapPin, Activity, Package, CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable, { Column } from '@/components/ui/DataTable';

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'activity'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vendorData, statsData, ordersData, activityData] = await Promise.all([
          adminClient.getVendor(unwrappedParams.id),
          adminClient.getVendorStats(unwrappedParams.id),
          adminClient.getVendorOrders(unwrappedParams.id, { limit: 10 }),
          adminClient.getVendorActivity(unwrappedParams.id)
        ]);

        setVendor(vendorData);
        setStats(statsData);
        setOrders(ordersData.orders || []);
        setActivity(activityData.logs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Vendor not found'}</p>
        <button onClick={() => router.back()} className="mt-4 text-[#FF6B00] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const orderColumns: Column<any>[] = [
    {
      header: 'Order ID',
      cell: (o) => <span className="font-medium text-gray-900">{o.publicId}</span>
    },
    {
      header: 'Date',
      cell: (o) => <span className="text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Status',
      cell: (o) => <StatusBadge status={o.status} />
    },
    {
      header: 'Amount',
      cell: (o) => <span className="font-medium">₹{o.pricing?.grandTotal?.toFixed(2)}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            {vendor.business_name || vendor.name}
            <StatusBadge status={vendor.status === 'active' ? 'Active' : 'Inactive'} variant={vendor.status === 'active' ? 'success' : 'neutral'} />
          </h1>
          <p className="text-sm text-gray-500 mt-1">Vendor ID: {vendor.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Store className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{vendor.contact_person || vendor.username}</p>
                  <p className="text-xs text-gray-500">Contact Person</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{vendor.email}</p>
                  <p className="text-xs text-gray-500">Email Address</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{vendor.phone || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{vendor.address || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{[vendor.city, vendor.state, vendor.pincode].filter(Boolean).join(', ') || 'Address details not fully provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Orders
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity Log
            </button>
          </div>

          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                  <div className="p-2 bg-orange-50 rounded-lg text-[#FF6B00]">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</div>
                <div className="text-xs text-gray-500 mt-1">{stats.todayOrders || 0} today</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">In Production</h3>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.printingOrders || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.deliveredOrders || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.cancelledOrders || 0}</div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <DataTable
                data={orders}
                columns={orderColumns}
                keyExtractor={(o) => o.publicId}
                emptyMessage="No recent orders found for this vendor."
              />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {activity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activity logs found.</p>
              ) : (
                <div className="space-y-6">
                  {activity.map((log: any) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{log.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                        {log.after_value && (
                          <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                            {JSON.stringify(JSON.parse(log.after_value), null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
