'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { vendorClient } from '@/lib/api/vendorClient';
import { Loader2, ArrowRight, Printer, Package, CheckCircle, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/ui/DataTable';
import FilterBar from '@/components/ui/FilterBar';
import KpiCard from '@/components/ui/KpiCard';
import StatusBadge from '@/components/ui/StatusBadge';

export default function VendorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, ordersData] = await Promise.all([
        vendorClient.getDashboard(),
        vendorClient.getOrders({ limit: 50, search })
      ]);

      // Automatic password redirect removed for normal vendor access

      setStats(statsData);
      setOrders(ordersData.orders);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Unauthorized or Forbidden access.");
      } else {
        setError(err.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Lightweight polling every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [search]);

  const columns: Column<any>[] = [
    {
      header: 'Order ID',
      accessorKey: 'publicId',
      cell: (o) => <span className="font-medium text-gray-900">{o.publicId}</span>
    },
    {
      header: 'Student Info',
      cell: (o) => (
        <div>
          <div className="text-gray-900 font-medium">{o.student?.name || 'Not provided'}</div>
          <div className="text-xs text-gray-500">{o.student?.rollNumber || 'Not provided'}</div>
        </div>
      )
    },
    {
      header: 'Location',
      cell: (o) => (
        <div>
          <div className="text-gray-900">{o.delivery?.room || 'Default Location'}</div>
          <div className="text-xs text-gray-500">{o.academic?.branchCode || '-'}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (o) => <StatusBadge status={o.status} />
    },
    {
      header: 'Action',
      cell: (o) => (
        <div className="flex justify-end">
          <Link href={`/vendor/orders/${o.publicId}`} className="inline-flex items-center text-sm font-semibold text-[#FF6B00] hover:text-[#e66000] transition-colors">
            Process <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )
    }
  ];

  const renderMobileCard = (o: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-gray-900">{o.publicId}</div>
          <div className="text-sm text-gray-900 font-medium">{o.student?.name || 'Not provided'}</div>
          <div className="text-xs text-gray-500">{o.student?.rollNumber || 'Not provided'}</div>
        </div>
        <StatusBadge status={o.status} />
      </div>
      <div className="text-sm text-gray-600 flex items-center gap-1">
        <MapPin className="w-4 h-4 text-gray-400" />
        {o.delivery?.room || 'Default Location'} ({o.academic?.branchCode || '-'})
      </div>
      <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100">
        <Link href={`/vendor/orders/${o.publicId}`} className="text-[#FF6B00] hover:text-[#e66000] flex items-center gap-1 text-sm font-medium">
          Process <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of operations and active order queue.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-start">
          <p className="font-medium mb-2">{error}</p>
          <button onClick={loadData} className="text-sm underline">Retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard label="Incoming" value={stats?.received || 0} icon={Package} isLoading={loading && !stats} />
        <KpiCard label="Accepted" value={stats?.accepted || 0} icon={CheckCircle} isLoading={loading && !stats} />
        <KpiCard label="Printing" value={stats?.printing || 0} icon={Printer} isLoading={loading && !stats} />
        <KpiCard label="Binding & QC" value={(stats?.binding || 0) + (stats?.quality_check || 0)} icon={CheckCircle} isLoading={loading && !stats} />
        <KpiCard label="Ready / Packed" value={(stats?.packed || 0) + (stats?.ready_for_pickup || 0)} icon={Package} isLoading={loading && !stats} />
        <KpiCard label="Out for Delivery" value={stats?.out_for_delivery || 0} icon={MapPin} isLoading={loading && !stats} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
        <Link href="/vendor/printing" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-[#FF6B00] transition-all group">
          <div className="w-10 h-10 bg-orange-50 text-[#FF6B00] rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Printing Queue</h3>
            <p className="text-sm text-gray-500">Manage orders currently in production</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-[#FF6B00] transition-colors" />
        </Link>
        <Link href="/vendor/ready" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-emerald-500 transition-all group">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ready Orders</h3>
            <p className="text-sm text-gray-500">Manage completed orders ready for pickup or delivery</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </Link>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterBar 
            searchPlaceholder="Search ID or Roll No..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[]}
            activeFilters={{}}
            onFilterChange={() => {}}
            onClearFilters={() => {}}
          />
        </div>
        <DataTable
          data={orders}
          columns={columns}
          keyExtractor={(o) => o.orderId}
          isLoading={loading && !stats}
          renderMobileCard={renderMobileCard}
          emptyMessage="No active orders found."
        />
      </div>
    </div>
  );
}
