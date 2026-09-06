'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { UploadCloud, Search, Download, ExternalLink, Printer, Phone } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/utils/formatters';

export default function CustomUploadsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, profile] = await Promise.all([
        vendorClient.getOrders({ page: 1, limit: 100, search, status: statusTab, sort: 'newest', order_type: 'custom' }),
        vendorClient.getProfile()
      ]);
      setOrders(data.orders || []);
      setCurrentVendorId(profile.id);
    } catch (err: any) {
      setError(err.message || 'Failed to load custom upload orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusTab]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleOpenPdf = async (docId: string, filename: string) => {
    try {
      const blob = await vendorClient.getDocumentBlob(docId);
      window.open(URL.createObjectURL(blob), '_blank');
    } catch { toast.error('Failed to open document'); }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const blob = await vendorClient.getDocumentBlob(docId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch { toast.error('Failed to download document'); }
  };

  const handlePrint = async (docId: string) => {
    try {
      const blob = await vendorClient.getDocumentBlob(docId);
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 3000);
      };
    } catch { toast.error('Failed to print document'); }
  };

  const tabs = [
    { label: 'All', val: 'all' },
    { label: 'Received', val: 'received' },
    { label: 'Accepted', val: 'accepted' },
    { label: 'Printing', val: 'printing' },
    { label: 'Ready', val: 'packed,ready_for_pickup,out_for_delivery' },
    { label: 'Delivered', val: 'delivered' },
    { label: 'Cancelled', val: 'cancelled' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
          <UploadCloud className="w-8 h-8 mr-3 text-[#FF6B00]" /> Custom Uploads
        </h1>
        <p className="text-sm text-gray-500 mt-1">All custom document upload orders — global vendor pool.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {tabs.map(tab => (
              <button key={tab.val} onClick={() => setStatusTab(tab.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${statusTab === tab.val ? 'bg-[#FF6B00] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]" />
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No custom upload orders found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((o: any) => {
              const isOwnedByMe = o.vendorId && o.vendorId === currentVendorId;
              const isAvailable = !o.vendorId;
              return (
                <div key={o.publicId} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-gray-900 font-mono">{o.publicId}</span>
                            <StatusBadge status={o.status} />
                            {isAvailable ? (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">AVAILABLE</span>
                            ) : isOwnedByMe ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">PROCESSING BY YOU</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">PROCESSING BY {o.vendorName?.toUpperCase() || 'VENDOR'}</span>
                            )}
                          </div>
                          <p className="font-semibold text-gray-900">{o.student?.name || o.studentName || '—'}</p>
                          <p className="text-sm text-gray-500">{o.student?.rollNumber || o.rollNumber || '—'}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> {o.student?.phone || o.studentPhone || '—'}
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(o.createdAt || o.created_at, true)}</p>
                        </div>
                        <Link href={`/vendor/orders/${o.publicId}`} className="text-sm font-semibold text-[#FF6B00] hover:underline shrink-0">
                          View Order →
                        </Link>
                      </div>

                      <div className="space-y-2">
                        {(o.items || []).map((item: any, i: number) => {
                          const docId = item.document_uuid || item.document_id;
                          const docFilename = item.document_filename || item.title || 'document.pdf';
                          return (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 flex flex-col md:flex-row gap-3">
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{docFilename}</p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity || item.copies}x copies • {item.pages || item.page_count} pages • {item.printType === 'color' || item.color_mode === 'color' ? 'Color' : 'B&W'} • {item.binding || item.binding_type || 'No binding'}
                                </p>
                              </div>
                              {docId && (
                                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                                  <button onClick={() => handleOpenPdf(docId, docFilename)}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                                    <ExternalLink className="w-3.5 h-3.5" /> View
                                  </button>
                                  <button onClick={() => handleDownload(docId, docFilename)}
                                    className="px-3 py-1.5 bg-orange-50 text-[#FF6B00] rounded-lg text-xs font-semibold hover:bg-orange-100 flex items-center gap-1">
                                    <Download className="w-3.5 h-3.5" /> Download
                                  </button>
                                  <button onClick={() => handlePrint(docId)}
                                    className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-700 flex items-center gap-1">
                                    <Printer className="w-3.5 h-3.5" /> Print
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
