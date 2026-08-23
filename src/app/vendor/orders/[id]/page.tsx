'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { vendorClient } from '@/lib/api/vendorClient';
import { Loader2, ArrowLeft, Download, FileText, CheckCircle, Clock, MapPin, Package, Printer } from 'lucide-react';
import Link from 'next/link';

export default function VendorOrderDetails() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorClient.getOrder(id);
      setOrderData(data);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Unauthorized or Forbidden access.");
      } else if (err.message?.includes('404')) {
        setError("Order not found.");
      } else {
        setError(err.message || 'Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!orderData?.order?.orderStatus) return;
    try {
      setUpdating(true);
      setUpdateError(null);
      await vendorClient.updateOrderStatus(id, newStatus, orderData.order.orderStatus);
      // Success, refresh
      await fetchOrder();
    } catch (err: any) {
      if (err.message?.includes('409') || err.message?.includes('Concurrency')) {
        setUpdateError("Another operator has already changed this order's status. The page has been refreshed with the latest data.");
        await fetchOrder(); // Fetch latest to show new status
      } else {
        setUpdateError(err.message || 'Failed to update order status');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const url = await vendorClient.getDocumentAccessUrl(docId);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download document securely');
    }
  };

  if (loading && !orderData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-start">
        <p className="font-medium mb-2">{error}</p>
        <Link href="/vendor" className="text-sm underline flex items-center mt-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { order, items } = orderData;

  // Vendor allowed next transitions mapped out
  const allowedTransitions: Record<string, string[]> = {
    'received': ['printing'],
    'printing': ['binding', 'quality_check', 'packed'],
    'binding': ['quality_check', 'packed'],
    'quality_check': ['packed'],
    'packed': ['ready_for_pickup', 'out_for_delivery'],
    'ready_for_pickup': ['delivered'],
    'out_for_delivery': ['delivered']
  };

  const nextActions = allowedTransitions[order.orderStatus] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/vendor" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order {order.orderId}</h1>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-[#FF6B00] uppercase tracking-wider">{order.orderStatus.replace(/_/g, ' ')}</span></p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
            order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}>
            {order.paymentStatus === 'paid' ? '✔ Payment Verified' : '⚠ Payment Pending'}
          </span>
        </div>
      </div>

      {updateError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm font-medium flex items-center">
          <span className="mr-2">⚠</span> {updateError}
        </div>
      )}

      {/* Operational Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 bg-gradient-to-b from-white to-orange-50/20">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Process Next Step</h2>
        {nextActions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {nextActions.map((actionStatus) => (
              <button
                key={actionStatus}
                disabled={updating}
                onClick={() => handleStatusUpdate(actionStatus)}
                className="px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#e66000] focus:ring-4 focus:ring-orange-200 disabled:opacity-50 transition-all flex items-center shadow-sm"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Mark as {actionStatus.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" /> Order processing complete. No further operational actions required.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Delivery Details</h2>
          <div className="space-y-3 text-base">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">{order.classroom || 'Default Location'}</p>
                <p className="text-sm text-gray-600">{order.branchName || '-'}</p>
              </div>
            </div>
            <div className="ml-8 border-t border-gray-50 pt-2">
              <p className="font-medium text-gray-900">{order.studentName}</p>
              <p className="text-sm text-gray-500">{order.rollNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Print Configuration</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 bg-black text-white rounded text-xs font-bold uppercase tracking-wider">
                    {item.item_type}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900">
                    {item.item_type === 'manual' ? item.manual_title : item.document_filename}
                  </h3>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Pages</p>
                    <p className="font-bold text-lg text-black">{item.page_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Copies</p>
                    <p className="font-bold text-lg text-black">{item.copies}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Color</p>
                    <p className="font-bold text-black">{item.print_type === 'color' ? 'Color' : 'B&W'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Sides</p>
                    <p className="font-bold text-black">{item.color_mode === 'double' ? 'Double' : 'Single'}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-4 border-t border-gray-200 pt-3 mt-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Binding Requirements</p>
                    <p className="font-bold text-black">{item.binding_type || 'None'}</p>
                  </div>
                </div>
              </div>
              
              {item.document_id && (
                <div className="md:border-l md:border-gray-100 md:pl-6 flex items-center justify-start md:justify-center">
                  <button 
                    onClick={() => handleDownload(item.document_id, item.document_filename)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-orange-200 rounded-xl hover:border-[#FF6B00] hover:bg-orange-50 transition-all text-[#FF6B00] group w-full md:w-48"
                  >
                    <Download className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-center">Download PDF</span>
                    <span className="text-xs text-orange-400 mt-1">Secure stream</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
