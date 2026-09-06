'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { Activity, Clock, ShieldCheck, Database, Search } from 'lucide-react';

export default function VendorActivityPage() {
  const [data, setData] = useState<any>({ activities: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await vendorClient.getActivity({ page, limit: 30 });
      setData(res);
    } catch (err: any) {
      console.error('Failed to load activity:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    if (action.includes('update') || action.includes('status')) return <Activity className="w-5 h-5 text-blue-500" />;
    return <Database className="w-5 h-5 text-gray-400" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('login')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (action.includes('update')) return 'bg-blue-50 text-blue-700 border-blue-100';
    if (action.includes('status')) return 'bg-orange-50 text-orange-700 border-orange-100';
    return 'bg-gray-50 text-gray-700 border-gray-100';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-indigo-600" />
            Activity Log
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review recent operations and system events for your account.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && data.activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading activity...</div>
        ) : data.activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Activity className="w-12 h-12 text-gray-300 mb-3" />
            <p>No recent activity found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.activities.map((log: any) => (
              <div key={log.id} className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors flex gap-4">
                <div className="mt-1">{getActionIcon(log.action)}</div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded border ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{log.actor_role === 'vendor' ? 'You' : 'System/Admin'}</span> performed an action on <span className="font-semibold">{log.entity_type}</span> {log.entity_id ? `(${log.entity_id})` : ''}
                    </p>
                    
                    {(log.before_value || log.after_value) && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 border border-gray-100 overflow-x-auto">
                        {log.before_value && (
                          <div className="flex gap-2 mb-2">
                            <span className="text-red-500 shrink-0">-</span>
                            <span className="break-all">{log.before_value}</span>
                          </div>
                        )}
                        {log.after_value && (
                          <div className="flex gap-2">
                            <span className="text-green-500 shrink-0">+</span>
                            <span className="break-all">{log.after_value}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page <span className="font-medium">{page}</span> of <span className="font-medium">{data.totalPages}</span></span>
            <button
              disabled={page === data.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
