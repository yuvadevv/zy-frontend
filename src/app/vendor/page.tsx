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

      if (statsData?.password_change_required) {
        router.push('/vendor/change-password');
        return;
      }

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
      accessorKey: 'orderId',
      cell: (o) => <span className="font-medium text-gray-900">{o.orderId}</span>
    },
    {
      header: 'Student Info',
      cell: (o) => (
        <div>
          <div className="text-gray-900 font-medium">{o.studentName}</div>
          <div className="text-xs text-gray-500">{o.rollNumber}</div>
        </div>
      )
    },
    {
      header: 'Location',
      cell: (o) => (
        <div>
          <div className="text-gray-900">{o.classroom || 'Default Location'}</div>
          <div className="text-xs text-gray-500">{o.branchName || '-'}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (o) => <StatusBadge status={o.orderStatus} />
    },
    {
      header: 'Action',
      cell: (o) => (
        <div className="flex justify-end">
          <Link href={`/vendor/orders/${o.orderId}`} className="inline-flex items-center text-sm font-semibold text-[#FF6B00] hover:text-[#e66000] transition-colors">
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
          <div className="font-semibold text-gray-900">{o.orderId}</div>
          <div className="text-sm text-gray-900 font-medium">{o.studentName}</div>
          <div className="text-xs text-gray-500">{o.rollNumber}</div>
        </div>
        <StatusBadge status={o.orderStatus} />
      </div>
      <div className="text-sm text-gray-600 flex items-center gap-1">
        <MapPin className="w-4 h-4 text-gray-400" />
        {o.classroom || 'Default Location'} ({o.branchName || '-'})
      </div>
      <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100">
        <Link href={`/vendor/orders/${o.orderId}`} className="text-[#FF6B00] hover:text-[#e66000] flex items-center gap-1 text-sm font-medium">
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="New Orders" value={stats?.received || 0} icon={Package} isLoading={loading && !stats} />
        <KpiCard label="Printing" value={stats?.printing || 0} icon={Printer} isLoading={loading && !stats} />
        <KpiCard label="Binding & QC" value={(stats?.binding || 0) + (stats?.quality_check || 0)} icon={CheckCircle} isLoading={loading && !stats} />
        <KpiCard label="Ready / Packed" value={(stats?.packed || 0) + (stats?.ready_for_pickup || 0)} icon={Package} isLoading={loading && !stats} />
        <KpiCard label="Out for Delivery" value={stats?.out_for_delivery || 0} icon={MapPin} isLoading={loading && !stats} />
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <FilterBar 
          searchPlaceholder="Search ID or Roll No..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[]}
          activeFilters={{}}
          onFilterChange={() => {}}
          onClearFilters={() => {}}
        />
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
