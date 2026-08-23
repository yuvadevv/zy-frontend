'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminClient } from '@/lib/api/adminClient';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Clock, 
  Printer, 
  PackageCheck, 
  CheckCircle,
  CreditCard,
  RefreshCcw,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';
import KpiCard from '@/components/ui/KpiCard';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      
      const [statsData, ordersData] = await Promise.all([
        adminClient.getDashboard(),
        adminClient.getOrders({ limit: 5 })
      ]);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const orderColumns: Column<any>[] = [
    {
      header: 'Order ID',
      accessorKey: 'orderId',
      cell: (order) => <span className="font-medium text-gray-900">{order.orderId}</span>,
    },
    {
      header: 'Student',
      cell: (order) => (
        <div>
          <div className="font-medium text-gray-900">{order.studentName}</div>
          <div className="text-xs text-gray-500">{order.rollNumber}</div>
        </div>
      )
    },
    {
      header: 'Branch',
      cell: (order) => (
        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
          {order.branchCode || '-'}
        </span>
      )
    },
    {
      header: 'Amount',
      cell: (order) => <span className="font-medium">₹{order.total}</span>
    },
    {
      header: 'Payment',
      cell: (order) => <StatusBadge status={order.paymentStatus || 'pending'} />
    },
    {
      header: 'Status',
      cell: (order) => <StatusBadge status={order.status.replace(/_/g, ' ')} />
    },
    {
      header: 'Action',
      cell: (order) => (
        <Link 
          href={`/admin/orders/${order.orderId}`} 
          className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-black transition-colors"
        >
          View
        </Link>
      )
    }
  ];

  const renderMobileOrderCard = (order: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-bold text-gray-900 block">{order.orderId}</span>
          <span className="text-sm text-gray-500">{order.studentName}</span>
        </div>
        <StatusBadge status={order.status.replace(/_/g, ' ')} />
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">₹{order.total}</span>
        <span className="text-gray-500">{order.branchCode || '-'}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <StatusBadge status={order.paymentStatus || 'pending'} />
        <Link 
          href={`/admin/orders/${order.orderId}`} 
          className="text-[#FF6B00] text-sm font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Executive Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor BLINTZY operations and platform performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Last 7 Days</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => loadData(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#FF6B00] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#e66000] transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium text-sm flex-1">{error}</p>
          <button onClick={() => loadData(true)} className="text-sm font-medium underline">Retry</button>
        </div>
      )}

      {/* Primary KPIs */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Primary Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard 
            isLoading={loading}
            label="Total Orders"
            value={stats?.orders?.today || 0}
            icon={Package}
            trend={{ value: 12, isPositive: true, label: "vs last week" }}
          />
          <KpiCard 
            isLoading={loading}
            label="Revenue"
            value={`₹${stats?.revenue?.today || 0}`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true, label: "vs last week" }}
          />
          <KpiCard 
            isLoading={loading}
            label="Active Users"
            value={stats?.users?.active || 0}
            icon={Users}
            trend={{ value: 0, isPositive: true, label: "vs last week" }}
          />
          <KpiCard 
            isLoading={loading}
            label="Pending Orders"
            value={stats?.orders?.pending || 0}
            icon={Clock}
          />
        </div>
      </div>

      {/* Secondary KPIs (Operations) */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Operational Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard 
            isLoading={loading}
            label="Printing"
            value={stats?.orders?.printing || 0}
            icon={Printer}
          />
          <KpiCard 
            isLoading={loading}
            label="Ready"
            value={stats?.orders?.ready || 0}
            icon={PackageCheck}
          />
          <KpiCard 
            isLoading={loading}
            label="Delivered"
            value={stats?.orders?.delivered || 0}
            icon={CheckCircle}
          />
          <KpiCard 
            isLoading={loading}
            label="Pending Payments"
            value={stats?.payments?.pending || 0}
            icon={CreditCard}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recent Operations</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-[#FF6B00] hover:underline">
            View all orders →
          </Link>
        </div>
        <DataTable
          data={orders}
          columns={orderColumns}
          keyExtractor={(order) => order.orderId}
          isLoading={loading}
          emptyMessage="No recent orders found."
          renderMobileCard={renderMobileOrderCard}
        />
      </div>
    </div>
  );
}
