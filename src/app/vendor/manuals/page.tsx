'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { BookOpen, Search, Download, ExternalLink, Printer, Phone } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/utils/formatters';

export default function VendorManualsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, profile] = await Promise.all([
        vendorClient.getOrders({ page: 1, limit: 100, search, sort: 'newest', order_type: 'manual' }),
        vendorClient.getProfile()
      ]);
      setOrders(data.orders || []);
      setCurrentVendorId(profile.id);
    } catch (err: any) {
      setError(err.message || 'Failed to load manual orders');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleOpenPdf = async (docId: string, filename: string) => {
    try {
      const blob = await vendorClient.getDocumentBlob(docId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      toast.error('Failed to open document');
    }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const blob = await vendorClient.getDocumentBlob(docId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      toast.error('Failed to download document');
    }
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
    } catch (err) {
      toast.error('Failed to print document');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-[#FF6B00]" />
            Manual Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">All manual catalog orders in the global pool.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Roll, Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            />
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading manual orders...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">No manual orders found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((o: any) => {
              const isOwnedByMe = o.vendorId && o.vendorId === currentVendorId;
              const isAvailable = !o.vendorId;

              return (
                <div key={o.publicId} className="p-4 md:p-6 hover:bg-orange-50/10 transition-colors">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900 font-mono">{o.publicId}</h3>
                            <StatusBadge status={o.status} />
                          </div>
                          <p className="font-semibold text-gray-900">{o.student?.name || o.studentName || 'Not provided'}</p>
                          <p className="text-sm text-gray-500">{o.student?.rollNumber || o.rollNumber || '—'}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> {o.student?.phone || o.studentPhone || '—'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(o.createdAt || o.created_at, true)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isAvailable ? (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">AVAILABLE</span>
                          ) : isOwnedByMe ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">PROCESSING BY YOU</span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">PROCESSING BY {o.vendorName?.toUpperCase() || 'VENDOR'}</span>
                          )}
                          <Link href={`/vendor/orders/${o.publicId}`} className="text-sm font-semibold text-[#FF6B00] hover:underline">
                            View Order →
                          </Link>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {(o.items || []).map((item: any, i: number) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-3 flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-800">{item.title || 'Manual'}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity || item.copies}x copies • {item.pages || item.page_count} pages • {item.printType === 'color' ? 'Color' : 'B&W'} • {item.binding || item.binding_type || 'No binding'}
                              </p>
                            </div>
                            {(item.document_uuid || item.document_id) && (
                              <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => handleOpenPdf(item.document_uuid || item.document_id, item.title || 'document.pdf')}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                                  <ExternalLink className="w-3.5 h-3.5" /> View
                                </button>
                                <button onClick={() => handleDownload(item.document_uuid || item.document_id, item.title || 'document.pdf')}
                                  className="px-3 py-1.5 bg-orange-50 text-[#FF6B00] rounded-lg text-xs font-semibold hover:bg-orange-100 flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5" /> Download
                                </button>
                                <button onClick={() => handlePrint(item.document_uuid || item.document_id)}
                                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-700 flex items-center gap-1">
                                  <Printer className="w-3.5 h-3.5" /> Print
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
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
