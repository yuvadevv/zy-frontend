'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { Search, Calendar, AlertCircle, Check, X, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { StatusControl } from '@/features/operations/StatusControl';
import { formatMoney, formatDate, formatCompactETA } from '@/utils/formatters';
import { toast } from 'react-hot-toast';
import CommonManualBatches from '@/features/operations/CommonManualBatches';
import ImportWizard from '@/features/operations/ImportWizard';
import { generateExcelExport } from '@/features/operations/ExportGenerator';
import { MobileOrderCard } from '@/features/operations/MobileOrderCard';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  
  // Dashboard Metrics & Profile
  const [metrics, setMetrics] = useState<any>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [branch, setBranch] = useState('all');
  const [year, setYear] = useState('all');
  const [semester, setSemester] = useState('all');
  const [manual, setManual] = useState('all');
  const [orderType, setOrderType] = useState('all');
  const [sort, setSort] = useState('newest');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkEta, setBulkEta] = useState<string>(''); // yyyy-mm-dd
  const [bulkEtaTime, setBulkEtaTime] = useState<string>('10:00'); // HH:mm
  const [isUpdating, setIsUpdating] = useState(false);
  const [showBulkEtaModal, setShowBulkEtaModal] = useState(false);
  
  // Modals
  const [showImport, setShowImport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [data, dashboard, profile] = await Promise.all([
        vendorClient.getOrders({
          page, limit: 25, search, status, branch, year, semester, manual_id: manual, order_type: orderType, sort
        }),
        vendorClient.getDashboard(),
        vendorClient.getProfile()
      ]);
      
      setOrders(data.orders);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
      setMetrics(dashboard.orders);
      setVendorId(profile.id);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, branch, year, semester, manual, orderType, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(orders.map(o => o.publicId)));
    } else {
      setSelectedOrders(new Set());
    }
  };
  
  const handleSelectAllMatching = async () => {
    try {
      // Need to fetch ALL matching to get IDs
      toast.loading("Selecting all matching...", { id: 'sel' });
      const data = await vendorClient.getOrders({ limit: 'all', search, status, branch, year, semester, manual_id: manual, order_type: orderType, sort });
      setSelectedOrders(new Set(data.orders.map((o: any) => o.publicId)));
      toast.success(`Selected ${data.orders.length} orders`, { id: 'sel' });
    } catch(err) {
      toast.error("Failed to select all", { id: 'sel' });
    }
  };

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedOrders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedOrders(next);
  };

  const handleBulkUpdateStatus = async () => {
    if (!bulkStatus || selectedOrders.size === 0) return;
    if (!confirm(`Update status to ${bulkStatus} for ${selectedOrders.size} orders?`)) return;
    
    try {
      setIsUpdating(true);
      const res = await vendorClient.bulkUpdateOrders(Array.from(selectedOrders), { status: bulkStatus });
      if (res.results.skipped > 0) {
        toast.error(`${res.results.updated} updated, ${res.results.skipped} skipped due to invalid state transition.`, { duration: 5000 });
      } else {
        toast.success(`${res.results.updated} orders updated successfully.`);
      }
      setSelectedOrders(new Set());
      setBulkStatus('');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Bulk update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkUpdateETA = async () => {
    if (!bulkEta || !bulkEtaTime || selectedOrders.size === 0) return;
    if (!confirm(`Update ETA for ${selectedOrders.size} orders?`)) return;
    
    try {
      setIsUpdating(true);
      const targetDate = new Date(`${bulkEta}T${bulkEtaTime}:00`);
      const ms = targetDate.getTime();
      
      const res = await vendorClient.bulkUpdateOrders(Array.from(selectedOrders), { estimatedDelivery: ms });
      toast.success(`${res.results.updated} ETA values updated.`);
      setSelectedOrders(new Set());
      setShowBulkEtaModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Bulk update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportExcel = async (exportType: 'current' | 'all') => {
    try {
      setIsExporting(true);
      toast.loading("Generating Excel...", { id: 'export' });
      let dataToExport = orders;
      if (exportType === 'all') {
         const res = await vendorClient.exportOrders({ search, status, branch, year, semester, manual_id: manual, order_type: orderType });
         dataToExport = res.orders;
      } else {
         if (selectedOrders.size > 0) {
             dataToExport = orders.filter(o => selectedOrders.has(o.publicId));
         }
      }
      generateExcelExport(dataToExport);
      toast.success("Excel generated successfully", { id: 'export' });
    } catch (err: any) {
      toast.error("Export failed: " + err.message, { id: 'export' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">ORDER MANAGEMENT</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Live data • Last synced: {new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
            <button onClick={loadData} className="ml-3 text-[#FF6B00] hover:underline text-xs font-medium">Refresh</button>
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowImport(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-gray-50 transition">
             <Upload className="w-4 h-4"/> Import
           </button>
           <button onClick={() => handleExportExcel('all')} className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-[#e66000] transition">
             <Download className="w-4 h-4"/> Export Filtered
           </button>
        </div>
      </div>
      
      {/* Common Manual Batches */}
      <CommonManualBatches 
        clientType="vendor"
        onSelectBatch={({ manual_id, branch, year, semester }) => {
         setManual(manual_id || 'all');
         setBranch(branch ? branch.toString() : 'all');
         setYear(year ? year.toString() : 'all');
         setSemester(semester ? semester.toString() : 'all');
         setStatus('all');
         setOrderType('all');
         setSearch('');
         setPage(1);
         toast.success("Filters applied for batch.");
      }} />

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between sticky top-0 z-10">
        <div className="relative w-full xl:w-80 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search ID, Roll No, Name, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full xl:w-auto items-center">
          <select value={orderType} onChange={e => setOrderType(e.target.value)} className="border-gray-200 rounded-lg text-xs md:text-sm py-2 px-3 bg-gray-50">
            <option value="all">All Order Types</option>
            <option value="manual">Manuals</option>
            <option value="custom">Custom Uploads</option>
            <option value="hall_ticket">Hall Tickets</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border-gray-200 rounded-lg text-xs md:text-sm py-2 px-3 bg-gray-50">
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="printing">Printing</option>
            <option value="ready_for_pickup">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={branch} onChange={e => setBranch(e.target.value)} className="border-gray-200 rounded-lg text-xs md:text-sm py-2 px-3 bg-gray-50">
            <option value="all">All Branches</option>
            <option value="1">CSE</option>
            <option value="2">ECE</option>
            <option value="3">AIML</option>
            <option value="4">IT</option>
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="border-gray-200 rounded-lg text-xs md:text-sm py-2 px-3 bg-gray-50">
            <option value="all">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          <select value={semester} onChange={e => setSemester(e.target.value)} className="border-gray-200 rounded-lg text-xs md:text-sm py-2 px-3 bg-gray-50 hidden md:block">
            <option value="all">All Sems</option>
            <option value="1">Sem 1</option>
            <option value="2">Sem 2</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border-gray-200 rounded-lg text-xs md:text-sm py-2 px-3 bg-gray-50 font-medium">
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="eta_asc">Sort: ETA Soonest</option>
            <option value="eta_desc">Sort: ETA Latest</option>
            <option value="price_asc">Sort: Amount Low-High</option>
            <option value="price_desc">Sort: Amount High-Low</option>
          </select>
          
          <button onClick={() => { setSearch(''); setStatus('all'); setOrderType('all'); setBranch('all'); setYear('all'); setSemester('all'); setManual('all'); setSort('newest'); }} className="px-3 py-2 text-xs md:text-sm text-gray-500 hover:text-gray-900 whitespace-nowrap font-medium transition-colors">
            Clear All
          </button>
        </div>
      </div>

      {/* Desktop Bulk Action Bar */}
      {selectedOrders.size > 0 && (
        <div className="hidden md:flex bg-gray-900 text-white p-3 rounded-xl shadow-xl items-center justify-between sticky top-20 z-40 border border-gray-800 animate-in fade-in slide-in-from-bottom-4">
          <div className="font-medium px-2 flex gap-4">
             <span>{selectedOrders.size} selected</span>
             <button onClick={handleSelectAllMatching} className="text-sm text-blue-400 hover:text-blue-300">Select All {totalCount} Matching</button>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white rounded-md text-sm py-1.5 px-3 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            >
              <option value="">Change Status ▼</option>
              <option value="printing">Printing</option>
              <option value="ready_for_pickup">Ready for Pickup</option>
              <option value="delivered">Delivered</option>
            </select>
            <button 
              onClick={handleBulkUpdateStatus}
              disabled={isUpdating || !bulkStatus}
              className="px-4 py-1.5 bg-[#FF6B00] hover:bg-orange-600 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              Apply Status
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
            <button 
              onClick={() => setShowBulkEtaModal(true)}
              className="px-4 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Update ETA
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
            <button onClick={() => handleExportExcel('current')} className="px-4 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors">
              Export Selected
            </button>
            <button onClick={() => setSelectedOrders(new Set())} className="p-1.5 hover:bg-gray-800 rounded ml-2 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ETA Modal */}
      {showBulkEtaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Update ETA for {selectedOrders.size} Orders</h3>
              <button onClick={() => setShowBulkEtaModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Date</label>
                <input type="date" value={bulkEta} onChange={e => setBulkEta(e.target.value)} className="w-full border-gray-300 rounded-lg focus:ring-[#FF6B00]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Time</label>
                <input type="time" value={bulkEtaTime} onChange={e => setBulkEtaTime(e.target.value)} className="w-full border-gray-300 rounded-lg focus:ring-[#FF6B00]" />
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleBulkUpdateETA}
                  disabled={!bulkEta || !bulkEtaTime || isUpdating}
                  className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Apply to Selected'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {showImport && (
        <ImportWizard onClose={() => setShowImport(false)} onComplete={() => { setShowImport(false); loadData(); }} />
      )}

      {/* Results Table & Cards */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : (
        <>
          {/* Desktop Table (Visible lg and above) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4 w-12">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
                        checked={orders.length > 0 && selectedOrders.size === orders.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-5 py-4">Order ID & Date</th>
                    <th className="px-5 py-4">Student & Academic</th>
                    <th className="px-5 py-4">Manual / Item</th>
                    <th className="px-5 py-4">Amount & Payment</th>
                    <th className="px-5 py-4">Vendor Assignment</th>
                    <th className="px-5 py-4">Status & ETA</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-gray-500 text-base">Loading orders...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-gray-500 text-base">
                        {search || status !== 'all' || orderType !== 'all' || branch !== 'all' || year !== 'all' || semester !== 'all' ? (
                          <>
                            No orders match your current filters.
                            <button onClick={() => { setSearch(''); setStatus('all'); setOrderType('all'); setBranch('all'); setYear('all'); setSemester('all'); }} className="block mx-auto mt-3 text-[#FF6B00] hover:underline font-medium">Clear all filters</button>
                          </>
                        ) : (
                          <>
                            <div className="font-bold text-gray-700 mb-1">No orders assigned to you yet.</div>
                            <div className="text-sm">You will see orders here once they are assigned by the Administrator.</div>
                          </>
                        )}
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.publicId} className={`hover:bg-gray-50 transition-colors ${selectedOrders.has(order.publicId) ? 'bg-orange-50/50' : ''}`}>
                        <td className="px-5 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
                            checked={selectedOrders.has(order.publicId)}
                            onChange={() => handleSelectOne(order.publicId)}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900 font-mono tracking-tight">{order.publicId}</div>
                          <div className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt, true)}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{order.student?.name || 'Not provided'}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{order.student?.rollNumber || '-'}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{order.student?.phone || order.studentPhone || '-'}</div>
                          <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                            {order.academic?.branchCode || '-'} {order.academic?.yearLabel ? `• ${order.academic.yearLabel}` : ''} {order.academic?.semesterLabel ? `• ${order.academic.semesterLabel}` : ''}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-gray-700 max-w-[220px]">
                            {order.items?.length > 0 ? (
                              order.items.map((m: any, i: number) => (
                                <div key={i} className="truncate" title={m.title}>{m.quantity}x {m.title}</div>
                              ))
                            ) : 'Custom Documents'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900 text-base">{formatMoney(order.pricing?.grandTotal || order.total)}</div>
                          <div className={`text-[10px] uppercase font-black tracking-widest mt-1 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                            {order.paymentStatus || 'Pending'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {!order.vendorId ? (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                               AVAILABLE
                             </span>
                          ) : order.vendorId === vendorId ? (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                               PROCESSING BY YOU
                             </span>
                          ) : (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                               PROCESSING BY {order.vendorName?.toUpperCase() || 'VENDOR'}
                             </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <StatusControl orderId={order.publicId} currentStatus={order.status} clientType="vendor" onUpdated={loadData} />
                          <div className="text-xs font-medium text-gray-500 mt-2 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            {formatCompactETA(order.estimatedDelivery)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link 
                            href={`/vendor/orders/${order.publicId}`}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination (Desktop) */}
            {!loading && totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm font-medium text-gray-500">Showing page {page} of {totalPages} (Total: {totalCount})</span>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    ← Previous
                  </button>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile / Tablet Cards Layout (Visible below lg) */}
          <div className="lg:hidden">
            {loading ? (
              <div className="py-12 text-center text-gray-500 text-base">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-base">
                No orders match your current filters.
                <button onClick={() => { setSearch(''); setStatus('all'); setOrderType('all'); setBranch('all'); setYear('all'); setSemester('all'); }} className="block mx-auto mt-3 text-[#FF6B00] hover:underline font-medium">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map(order => (
                  <MobileOrderCard 
                    key={order.publicId} 
                    order={order} 
                    selected={selectedOrders.has(order.publicId)} 
                    onSelect={handleSelectOne} 
                    clientType="vendor" 
                    onUpdated={loadData} 
                  />
                ))}
              </div>
            )}
            
            {/* Pagination (Mobile) */}
            {!loading && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                  >
                    Prev
                  </button>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
