'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, DollarSign, Download, AlertCircle, FileText, CheckCircle2, Settings } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import KpiCard from '@/components/ui/KpiCard';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // KPIs
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    pendingSettlements: 0,
    completedSettlements: 0
  });

  const loadData = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getPayments({ page: currentPage, limit: 25 });
      setPayments(data.payments || []);
      setTotalPages(data.totalPages || 1);
      
      // Calculate basic KPIs from returned payments or fetch from analytics later
      const totalRev = (data.payments || []).reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
      setKpis({
        totalRevenue: totalRev,
        pendingSettlements: 0,
        completedSettlements: totalRev
      });
      
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Access Denied. You do not have permission to view payments.");
      } else {
        setError(err.message || 'Failed to load payments data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const columns: Column<any>[] = [
    {
      header: 'Transaction ID',
      accessorKey: 'id',
      cell: (p) => <span className="font-medium text-gray-900">{p.id}</span>
    },
    {
      header: 'Vendor',
      accessorKey: 'vendor',
      cell: (p) => <span className="text-gray-700">{p.vendor}</span>
    },
    {
      header: 'Amount',
      cell: (p) => <span className="font-bold text-gray-900">₹{p.amount.toFixed(2)}</span>
    },
    {
      header: 'Method',
      accessorKey: 'method',
      cell: (p) => <span className="text-gray-500 text-sm">{p.method}</span>
    },
    {
      header: 'Date',
      cell: (p) => <span className="text-gray-500 text-sm">{new Date(p.date).toLocaleDateString()}</span>
    },
    {
      header: 'Status',
      cell: (p) => <StatusBadge status={p.status} />
    },
    {
      header: 'Actions',
      cell: (p) => (
        <div className="flex justify-end space-x-2">
          <button className="text-gray-500 hover:text-black transition-colors" title="Download Receipt">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderMobileCard = (p: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-gray-900">{p.id}</div>
          <div className="text-sm text-gray-500">{p.vendor}</div>
        </div>
        <StatusBadge status={p.status} />
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-gray-900">₹{p.amount.toFixed(2)}</span>
        <span className="text-gray-500">{new Date(p.date).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100 gap-4">
        <span className="text-xs text-gray-400">{p.method}</span>
        <button className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium">
          <Download className="w-3 h-3" />
          Receipt
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payments & Settlements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage vendor payouts, platform revenue, and transaction history.</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <a
            href="/admin/payments/settings"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Gateway Settings</span>
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard 
          label="Total Revenue (All Time)" 
          value={`₹${kpis.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend={{ value: 12, isPositive: true }}
        />
        <KpiCard 
          label="Pending Settlements" 
          value={`₹${kpis.pendingSettlements.toLocaleString()}`} 
          icon={AlertCircle} 
          trend={{ value: 5, isPositive: false }}
        />
        <KpiCard 
          label="Completed Settlements" 
          value={`₹${kpis.completedSettlements.toLocaleString()}`} 
          icon={CheckCircle2} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <DataTable
          data={payments}
          columns={columns}
          keyExtractor={(p) => p.id}
          isLoading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          renderMobileCard={renderMobileCard}
          emptyMessage="No payment transactions found."
        />
      </div>
    </div>
  );
}
