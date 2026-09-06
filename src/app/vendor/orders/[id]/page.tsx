'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { vendorClient } from '@/lib/api/vendorClient';
import { Loader2, ArrowLeft, Download, FileText, CheckCircle, Clock, MapPin, Package, Printer, Phone, User, Lock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const VALID_VENDOR_TRANSITIONS: Record<string, string[]> = {
  'received': ['accepted'],
  'accepted': ['printing', 'cancelled'],
  'printing': ['binding', 'quality_check', 'packed', 'cancelled'],
  'binding': ['quality_check', 'packed', 'cancelled'],
  'quality_check': ['packed', 'cancelled'],
  'packed': ['ready_for_pickup', 'out_for_delivery', 'cancelled'],
  'ready_for_pickup': ['delivered', 'cancelled'],
  'out_for_delivery': ['delivered', 'failed', 'cancelled'],
  'failed': ['out_for_delivery', 'cancelled']
};

export default function VendorOrderDetails() {
  const params = useParams();
  const id = params.id as string;

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, profile] = await Promise.all([
        vendorClient.getOrder(id),
        vendorClient.getProfile()
      ]);
      setOrderData(data);
      setCurrentVendorId(profile.id);
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
    if (!orderData) return;
    const currentStatus = orderData.order?.orderStatus || orderData.order?.status || orderData.orderStatus || orderData.status;
    try {
      setUpdating(true);
      setUpdateError(null);
      await vendorClient.updateOrderStatus(id, newStatus, currentStatus);
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      await fetchOrder();
    } catch (err: any) {
      const msg = err.message || 'Failed to update status';
      if (msg.includes('409') || msg.toLowerCase().includes('already being processed')) {
        setUpdateError("Order is already being processed by another Vendor. The page has been refreshed.");
        await fetchOrder();
      } else if (msg.includes('403')) {
        setUpdateError("You are not authorized to modify this order. Only the claiming vendor can change its status.");
        await fetchOrder();
      } else {
        setUpdateError(msg);
      }
    } finally {
      setUpdating(false);
    }
  };

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

  const handlePrint = async (docId: string, filename: string) => {
    try {
      const blob = await vendorClient.getDocumentBlob(docId);
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 3000);
      };
    } catch (err) {
      toast.error('Failed to print document');
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

  // Support both old DTO (flat) and new DTO (nested)
  const order = orderData?.order || orderData;
  const items = orderData?.items || orderData?.order?.items || [];
  const currentStatus = order?.orderStatus || order?.status;
  const vendorId = order?.vendorId;
  const vendorName = order?.vendorName;
  const isAvailable = !vendorId;
  const isOwnedByMe = vendorId && vendorId === currentVendorId;
  const isOwnedByOther = vendorId && vendorId !== currentVendorId;

  // Determine allowed transitions for this vendor
  const baseTransitions = VALID_VENDOR_TRANSITIONS[currentStatus] || [];
  // For claiming: show "Accept Order" if available + received
  const canAccept = isAvailable && currentStatus === 'received';
  // For processing: only if vendor owns the order
  const canProcess = isOwnedByMe;
  const nextActions = canProcess ? baseTransitions : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link href="/vendor/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order {order?.publicId || id}</h1>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-[#FF6B00] uppercase tracking-wider">{currentStatus?.replace(/_/g, ' ')}</span></p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
            order?.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}>
            {order?.paymentStatus === 'paid' ? '✔ Payment Verified' : '⚠ Payment Pending'}
          </span>
        </div>
      </div>

      {/* Vendor Assignment Banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        isAvailable ? 'bg-gray-50 border-gray-200' :
        isOwnedByMe ? 'bg-green-50 border-green-200' :
        'bg-blue-50 border-blue-200'
      }`}>
        {isAvailable ? (
          <>
            <Package className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-700">Available — Unassigned</p>
              <p className="text-sm text-gray-500">No vendor has accepted this order yet.</p>
            </div>
          </>
        ) : isOwnedByMe ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-700">Processing by You</p>
              <p className="text-sm text-green-600">You have claimed this order and can process it.</p>
            </div>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-700">Processing by {vendorName || 'Another Vendor'}</p>
              <p className="text-sm text-blue-600">You can view and print documents, but cannot modify this order.</p>
            </div>
          </>
        )}
      </div>

      {updateError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm font-medium flex items-center">
          <span className="mr-2">⚠</span> {updateError}
        </div>
      )}

      {/* Operational Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 bg-gradient-to-b from-white to-orange-50/20">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Process Next Step</h2>
        {canAccept ? (
          <div className="flex flex-wrap gap-3">
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate('accepted')}
              className="px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#e66000] focus:ring-4 focus:ring-orange-200 disabled:opacity-50 transition-all flex items-center shadow-sm"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Accept Order — Claim & Start Processing
            </button>
          </div>
        ) : nextActions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {nextActions.map((actionStatus) => (
              <button
                key={actionStatus}
                disabled={updating}
                onClick={() => handleStatusUpdate(actionStatus)}
                className={`px-6 py-3 font-bold rounded-lg focus:ring-4 focus:ring-orange-200 disabled:opacity-50 transition-all flex items-center shadow-sm ${
                  actionStatus === 'cancelled' || actionStatus === 'rejected'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                    : 'bg-[#FF6B00] text-white hover:bg-[#e66000]'
                }`}
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Mark as {actionStatus.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        ) : isOwnedByOther ? (
          <p className="text-sm font-medium text-blue-600 flex items-center">
            <Lock className="w-4 h-4 mr-2" /> This order is being processed by {vendorName || 'another vendor'}. You can view and print documents only.
          </p>
        ) : (
          <p className="text-sm font-medium text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" /> Order processing complete. No further operational actions required.
          </p>
        )}
      </div>

      {/* Student & Order Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Student Details</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {order?.student?.name || 'Not provided'}</p>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> {order?.student?.rollNumber || 'Not provided'}</p>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {order?.student?.phone || 'Not provided'}</p>
          <p className="text-sm text-gray-500 mt-1">{order?.student?.email || ''}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Academic Context</p>
          <p className="font-semibold text-gray-900">{order?.academic?.branchCode || 'N/A'}</p>
          <p className="text-sm text-gray-600 mt-1">{order?.academic?.yearLabel || 'N/A'}, {order?.academic?.semesterLabel || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Delivery Info</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {order?.delivery?.type || 'Classroom'} Delivery</p>
          <p className="text-sm text-gray-600 mt-1">Building: {order?.delivery?.building || 'Not specified'}</p>
          <p className="text-sm text-gray-600 mt-1">Room: {order?.delivery?.room || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">ETA</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            {order?.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not set'}
          </p>
        </div>
      </div>

      {/* Print Configuration + Document Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Print Configuration & Documents</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No items found for this order.</div>
          ) : (
            items.map((item: any, idx: number) => {
              const docId = item.document_id || item.document_uuid;
              const docFilename = item.document_filename || item.original_filename || 'document.pdf';
              return (
                <div key={idx} className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2.5 py-1 bg-black text-white rounded text-xs font-bold uppercase tracking-wider">
                        {item.item_type || 'Item'}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900">
                        {item.item_type === 'manual' ? (item.manual_title || item.title) : (item.document_filename || item.title || 'Document')}
                      </h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Pages</p>
                        <p className="font-bold text-lg text-black">{item.page_count || item.pages || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Copies</p>
                        <p className="font-bold text-lg text-black">{item.copies || item.quantity || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Color</p>
                        <p className="font-bold text-black">{item.color_mode === 'color' || item.printType === 'color' ? 'Color' : 'B&W'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Sides</p>
                        <p className="font-bold text-black">{item.print_type === 'double' || item.colorMode === 'double' ? 'Double' : 'Single'}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-4 border-t border-gray-200 pt-3 mt-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Binding Requirements</p>
                        <p className="font-bold text-black">{item.binding_type || item.binding || 'None'}</p>
                      </div>
                    </div>
                  </div>

                  {/* PDF Actions — available to ALL active vendors */}
                  {docId && (
                    <div className="md:border-l md:border-gray-100 md:pl-6 flex flex-col gap-2 items-start justify-center">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Document Actions</p>
                      <button
                        onClick={() => handleOpenPdf(docId, docFilename)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-all text-sm w-full"
                      >
                        <ExternalLink className="w-4 h-4" /> Open / View PDF
                      </button>
                      <button
                        onClick={() => handleDownload(docId, docFilename)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#FF6B00] font-semibold rounded-lg hover:bg-orange-100 transition-all text-sm w-full"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                      <button
                        onClick={() => handlePrint(docId, docFilename)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all text-sm w-full"
                      >
                        <Printer className="w-4 h-4" /> Print PDF
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
