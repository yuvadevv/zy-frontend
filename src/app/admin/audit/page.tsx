'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Shield, Clock, User, AlertCircle, Filter, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActor, setFilterActor] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const loadData = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminClient.getAuditLogs({
        page: currentPage,
        limit: 25,
        ...(filterActor ? { actor: filterActor } : {}),
        ...(filterAction ? { action: filterAction } : {})
      });
      setLogs(res.logs || []);
      setTotalPages(Math.ceil((res.total || res.logs?.length || 0) / 25) || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleApplyFilters = () => {
    setPage(1);
    loadData(1);
  };

  const columns: Column<any>[] = [
    {
      header: 'Timestamp',
      cell: (l) => (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{new Date(l.created_at).toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Action',
      cell: (l) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {l.action}
        </span>
      )
    },
    {
      header: 'Actor',
      cell: (l) => (
        <div>
          <div className="font-medium text-gray-900">{l.actor_id}</div>
          <div className="text-xs text-gray-500">{l.actor_role}</div>
        </div>
      )
    },
    {
      header: 'Target Entity',
      cell: (l) => (
        <div>
          <div className="text-sm font-medium">{l.entity_type || '-'}</div>
          <div className="text-xs text-gray-500 font-mono truncate max-w-[150px]">{l.entity_id || '-'}</div>
        </div>
      )
    },
    {
      header: 'Context',
      cell: (l) => (
        <div className="text-xs text-gray-500 max-w-[200px] overflow-hidden">
          {l.ip_address && <div className="font-mono text-[10px]">IP: {l.ip_address}</div>}
          {l.after_value && <div className="truncate">Changed: {l.after_value}</div>}
        </div>
      )
    }
  ];

  const renderMobileCard = (l: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {l.action}
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="w-3 h-3 shrink-0" />
          <span>{new Date(l.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div>
        <div className="font-medium text-gray-900 text-sm">{l.actor_id}</div>
        <div className="text-xs text-gray-500">Entity: {l.entity_type} {l.entity_id}</div>
      </div>
      <div className="text-xs text-gray-400 font-mono pt-2 border-t border-gray-50">
        IP: {l.ip_address || 'N/A'}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-[#FF6B00]" />
            Audit Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track system events, administrative actions, and security changes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-gray-100 text-gray-900' : 'bg-white hover:bg-gray-50'}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Actor ID</label>
            <input 
              type="text" 
              placeholder="UUID"
              value={filterActor}
              onChange={(e) => setFilterActor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
            <input 
              type="text" 
              placeholder="e.g. order.vendor_assigned"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button 
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      )}

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            data={logs}
            columns={columns}
            keyExtractor={(l) => l.id}
            isLoading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            renderMobileCard={renderMobileCard}
            emptyMessage="No audit logs recorded yet."
          />
        </div>
      )}
    </div>
  );
}
