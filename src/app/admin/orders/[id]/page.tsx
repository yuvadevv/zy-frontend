'use client';

import { useEffect, useState, use } from 'react';
import { useParams } from 'next/navigation';
import { adminClient } from '@/lib/api/adminClient';
import { ArrowLeft, CheckCircle, Clock, MapPin, Phone, Mail, FileText, User, CreditCard, X } from 'lucide-react';
import Link from 'next/link';
import { formatMoney, formatDate, formatCompactETA } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

export default function AdminOrderDetails() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [updating, setUpdating] = useState(false);
  const [editEtaModal, setEditEtaModal] = useState(false);
  const [etaDate, setEtaDate] = useState('');
  const [etaTime, setEtaTime] = useState('10:00');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getOrder(id);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    const currentStatus = order.status || 'received';
    if (newStatus === currentStatus) return;
    
    if (!confirm(`Update status from ${currentStatus} to ${newStatus}?`)) return;

    try {
      setUpdating(true);
      // Wait, Admin Details is calling bulkUpdateOrders instead of updateOrderStatus!
      // I should change it to use updateOrderStatus for single updates so it gets the 409 check properly.
      await adminClient.updateOrderStatus(id, newStatus, currentStatus);
      toast.success('Status updated successfully');
      await fetchOrder();
    } catch (err: any) {
      if (err.status === 409 || err.message?.includes('elsewhere') || err.message?.includes('Concurrency')) {
        toast.error('This order was updated by someone else. Refreshing the latest status.', { duration: 4000 });
        await fetchOrder();
      } else {
        toast.error(err.message || 'Failed to update order status');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleEtaUpdate = async () => {
    if (!etaDate || !etaTime) return;
    if (!confirm('Update Estimated Delivery time?')) return;

    try {
      setUpdating(true);
      const targetDate = new Date(`${etaDate}T${etaTime}:00`);
      const ms = targetDate.getTime();
      
      await adminClient.bulkUpdateOrders([id], { estimatedDelivery: ms });
      toast.success('ETA updated successfully');
      setEditEtaModal(false);
      await fetchOrder();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update ETA');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenPdf = async (docId: string, filename: string) => {
    try {
      toast.loading('Opening document...', { id: 'pdf' });
      const blob = await adminClient.getDocumentBlob(docId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('Document opened', { id: 'pdf' });
      // Clean up after some time
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      toast.error('Failed to open document', { id: 'pdf' });
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto p-6 flex justify-center py-20 text-gray-500 font-medium tracking-wide">Loading order details...</div>;

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl font-medium shadow-sm border border-red-100 flex flex-col items-center">
          <p className="text-lg">{error || 'Order not found'}</p>
          <Link href="/admin/orders" className="mt-4 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-sm border border-gray-200">Go Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{order.publicId}</h1>
          <p className="text-sm text-gray-500 font-medium">{formatDate(order.createdAt, true)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase flex items-center mb-4">
              <FileText className="w-4 h-4 mr-2" /> Order Items
            </h3>
            
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.title || item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.pages} Pages • {item.printType || item.print_type} • Binding: {item.binding || item.binding_type}</p>
                      
                      {item.document_id && (
                        <div className="mt-2">
                          <button 
                            onClick={() => handleOpenPdf(item.document_id, item.document_filename || 'document.pdf')}
                            className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors border border-primary/20"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Document: {item.document_filename || 'PDF'}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">{formatMoney(item.totalPrice || item.item_total)}</div>
                      <div className="text-sm text-gray-500">{item.quantity} x {formatMoney(item.unitPrice || item.base_price)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4">Pricing</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatMoney(order.pricing?.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">{formatMoney(order.pricing?.deliveryFee)}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatMoney(order.pricing?.discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="font-bold text-gray-900 text-base">Grand Total</span>
                <span className="font-black text-gray-900 text-lg">{formatMoney(order.pricing?.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Operations / Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#FF6B00]/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]"></div>
             <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> Operations
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">CURRENT STATUS</label>
                <select 
                  value={order.status || 'received'}
                  onChange={e => handleStatusUpdate(e.target.value)}
                  disabled={updating}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-gray-900 focus:border-[#FF6B00] focus:ring-[#FF6B00]"
                >
                  <option value="received">Received</option>
                  <option value="accepted">Accepted</option>
                  <option value="printing">Printing</option>
                  <option value="binding">Binding</option>
                  <option value="quality_check">Quality Check</option>
                  <option value="packed">Packed</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="text-[10px] uppercase font-bold text-gray-400 mt-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mr-1.5"></span>
                  Admin Override Enabled
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">ESTIMATED DELIVERY (ETA)</label>
                <div className="flex items-center gap-2">
                   <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-medium text-gray-900">
                     {formatCompactETA(order.estimatedDelivery)}
                   </div>
                   <button onClick={() => setEditEtaModal(true)} className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm">Edit</button>
                </div>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" /> Student Information
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-lg font-bold text-gray-900">{order.student?.name}</div>
                <div className="text-sm font-medium text-[#FF6B00]">{order.student?.rollNumber}</div>
              </div>
              
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 p-2 rounded-lg inline-block">
                {order.academic?.branchCode} • {order.academic?.yearLabel} • {order.academic?.semesterLabel}
              </div>

              <div className="pt-2 space-y-2">
                <a href={`tel:${order.student?.phone}`} className="flex items-center text-sm font-medium text-gray-700 hover:text-[#FF6B00] transition">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" /> {order.student?.phone}
                </a>
                <a href={`mailto:${order.student?.email}`} className="flex items-center text-sm font-medium text-gray-700 hover:text-[#FF6B00] transition">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" /> {order.student?.email}
                </a>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> Delivery
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex text-gray-600"><span className="w-24 font-medium">Type:</span> <span className="font-bold text-gray-900 capitalize">{order.delivery?.type || 'Standard'}</span></div>
              <div className="flex text-gray-600"><span className="w-24 font-medium">Building:</span> <span className="text-gray-900">{order.delivery?.building || '-'}</span></div>
              <div className="flex text-gray-600"><span className="w-24 font-medium">Room:</span> <span className="text-gray-900">{order.delivery?.room || '-'}</span></div>
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" /> Payment
            </h3>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {order.paymentStatus || 'Pending'}
              </div>
              <div className="text-sm font-medium text-gray-600">{formatMoney(order.pricing?.grandTotal)}</div>
            </div>
          </div>

        </div>
      </div>

      {/* ETA Modal */}
      {editEtaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Update ETA</h3>
              <button onClick={() => setEditEtaModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Date</label>
                <input type="date" value={etaDate} onChange={e => setEtaDate(e.target.value)} className="w-full border-gray-300 rounded-lg focus:ring-[#FF6B00]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Time</label>
                <input type="time" value={etaTime} onChange={e => setEtaTime(e.target.value)} className="w-full border-gray-300 rounded-lg focus:ring-[#FF6B00]" />
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleEtaUpdate}
                  disabled={!etaDate || !etaTime || updating}
                  className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Apply ETA'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
