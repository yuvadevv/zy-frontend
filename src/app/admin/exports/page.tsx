'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Database, Loader2, AlertCircle } from 'lucide-react';
import { adminClient } from '@/lib/api/adminClient';

export default function AdminExportsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  
  // Filter states
  const [orderStatus, setOrderStatus] = useState('all');
  const [orderBranch, setOrderBranch] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  
  const [userStatus, setUserStatus] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const [paymentStatus, setPaymentStatus] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  
  const handleExport = async (type: string) => {
    setLoading(type);
    try {
      let params = {};
      if (type === 'orders') {
        params = { status: orderStatus, branch: orderBranch, search: orderSearch };
      } else if (type === 'users') {
        params = { status: userStatus, search: userSearch };
      } else if (type === 'payments') {
        params = { status: paymentStatus, search: paymentSearch };
      }

      const res = await adminClient.getExportCsv(type, params);
      const blob = await (res as unknown as Response).blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      alert(`Failed to export ${type}: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Data Exports</h1>
          <p className="text-sm text-gray-500 mt-1">Export platform data to CSV for external analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Orders Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Orders Data</h3>
              <p className="text-xs text-gray-500 mt-1">CSV Format</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6 flex-1">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} className="w-full text-sm border-gray-300 rounded-md">
                <option value="all">All Statuses</option>
                <option value="received">Received</option>
                <option value="accepted">Accepted</option>
                <option value="printing">Printing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search ID</label>
              <input type="text" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Order ID..." className="w-full text-sm border-gray-300 rounded-md" />
            </div>
          </div>
          
          <button
            onClick={() => handleExport('orders')}
            disabled={loading !== null}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              loading === 'orders' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading === 'orders' ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></> : <><Download className="w-4 h-4" /><span>Export Orders</span></>}
          </button>
        </div>

        {/* Users Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Directory</h3>
              <p className="text-xs text-gray-500 mt-1">CSV Format</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6 flex-1">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select value={userStatus} onChange={e => setUserStatus(e.target.value)} className="w-full text-sm border-gray-300 rounded-md">
                <option value="all">All Accounts</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Name, Email, Roll No..." className="w-full text-sm border-gray-300 rounded-md" />
            </div>
          </div>
          
          <button
            onClick={() => handleExport('users')}
            disabled={loading !== null}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              loading === 'users' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading === 'users' ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></> : <><Download className="w-4 h-4" /><span>Export Users</span></>}
          </button>
        </div>

        {/* Payments Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <Database className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
              <p className="text-xs text-gray-500 mt-1">CSV Format</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6 flex-1">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full text-sm border-gray-300 rounded-md">
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <input type="text" value={paymentSearch} onChange={e => setPaymentSearch(e.target.value)} placeholder="Order ID, Provider ID..." className="w-full text-sm border-gray-300 rounded-md" />
            </div>
          </div>
          
          <button
            onClick={() => handleExport('payments')}
            disabled={loading !== null}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              loading === 'payments' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading === 'payments' ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></> : <><Download className="w-4 h-4" /><span>Export Payments</span></>}
          </button>
        </div>

      </div>
      
    </div>
  );
}
