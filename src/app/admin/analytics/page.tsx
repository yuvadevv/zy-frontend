'use client';

import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, ShoppingBag, FileText, Calendar } from 'lucide-react';
import KpiCard from '@/components/ui/KpiCard';
import { adminClient } from '@/lib/api/adminClient';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // KPIs
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminClient.getAnalytics();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Key performance metrics and platform growth insights.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          label="Total Students" 
          value={data?.users?.total?.toLocaleString() || '0'} 
          icon={Users} 
          isLoading={loading}
        />
        <KpiCard 
          label="Total Orders" 
          value={data?.orders?.total?.toLocaleString() || '0'} 
          icon={ShoppingBag} 
          isLoading={loading}
        />
        <KpiCard 
          label="Total Revenue" 
          value={`₹${data?.revenue?.total?.toLocaleString() || '0'}`} 
          icon={TrendingUp} 
          isLoading={loading}
        />
        <KpiCard 
          label="Pending Orders" 
          value={data?.orders?.pending?.toLocaleString() || '0'} 
          icon={FileText} 
          isLoading={loading}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          label="Active Students" 
          value={data?.users?.active?.toLocaleString() || '0'} 
          icon={Users} 
          isLoading={loading}
        />
        <KpiCard 
          label="Completed Orders" 
          value={data?.orders?.delivered?.toLocaleString() || '0'} 
          icon={ShoppingBag} 
          isLoading={loading}
        />
        <KpiCard 
          label="Today's Revenue" 
          value={`₹${data?.revenue?.today?.toLocaleString() || '0'}`} 
          icon={TrendingUp} 
          isLoading={loading}
        />
        <KpiCard 
          label="Today's Orders" 
          value={data?.orders?.today?.toLocaleString() || '0'} 
          icon={FileText} 
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Over Time (Last 7 Days)</h3>
          {data?.charts?.ordersOverTime?.length > 0 ? (
            <div className="space-y-3">
              {data.charts.ordersOverTime.map((d: any, idx: number) => {
                const max = Math.max(...data.charts.ordersOverTime.map((x: any) => x.count || 0));
                const pct = max > 0 ? ((d.count || 0) / max) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 w-24">{d.day}</span>
                    <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
                      <div className="bg-[#FF6B00] h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{d.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Over Time (Last 7 Days)</h3>
          {data?.charts?.revenueOverTime?.length > 0 ? (
            <div className="space-y-3">
              {data.charts.revenueOverTime.map((d: any, idx: number) => {
                const max = Math.max(...data.charts.revenueOverTime.map((x: any) => x.revenue || 0));
                const pct = max > 0 ? ((d.revenue || 0) / max) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 w-24">{d.day}</span>
                    <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">₹{d.revenue}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders By Status</h3>
          {data?.charts?.ordersByStatus?.length > 0 ? (
            <div className="space-y-3">
              {data.charts.ordersByStatus.map((d: any, idx: number) => {
                const max = Math.max(...data.charts.ordersByStatus.map((x: any) => x.count || 0));
                const pct = max > 0 ? ((d.count || 0) / max) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 w-24 capitalize">{String(d.status).replace('_', ' ')}</span>
                    <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{d.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders By Branch</h3>
          {data?.charts?.ordersByBranch?.length > 0 ? (
            <div className="space-y-3">
              {data.charts.ordersByBranch.map((d: any, idx: number) => {
                const max = Math.max(...data.charts.ordersByBranch.map((x: any) => x.count || 0));
                const pct = max > 0 ? ((d.count || 0) / max) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 w-24">{d.branch || 'Unknown'}</span>
                    <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{d.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
